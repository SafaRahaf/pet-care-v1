import bcryptjs from "bcryptjs";
import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import { createToken, verifyToken } from "../../utils/authUtils";
import { ROLE } from "../user/user.constant";
import { TUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import { isPasswordMatched } from "./auth.utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";

const signUp = async (payload: TUser): Promise<any> => {
  const user = await User.findOne({ email: payload.email });

  if (user) {
    throw new Error("User already exists");
  }

  payload.role = ROLE.user;

  const newUser = await User.create(payload);

  return newUser;
};

const login = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email }).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  const passwordMatch = await isPasswordMatched(
    payload.password,
    user.password
  );

  if (!passwordMatch) {
    throw new Error("password didn't matched, please try again");
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: "1y",
  });

  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_access_secret as string,
    {
      expiresIn: "1y",
    }
  );

  return {
    token,
    refreshToken,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      posts: user.posts,
      followers: user.followers,
      following: user.following,
      role: user.role,
    },
  };
};

const forgotPassword = async (userId: string) => {
  //@ts-ignore
  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    "1d"
  );

  const resetUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken} `;

  sendEmail(user.email, resetUILink);

  console.log(resetUILink);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string
) => {
  //@ts-ignore
  const user = await User.isUserExistsByCustomId(payload?.id);

  if (!user) {
    throw new AppError(404, "This user is not found !");
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === "blocked") {
    throw new AppError(httpStatus.FORBIDDEN, "This user is blocked ! !");
  }

  const decoded = jwt.verify(
    token,
    config.jwt_access_secret as string
  ) as JwtPayload;

  //localhost:3000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4

  if (payload.id !== decoded.userId) {
    console.log(payload.id, decoded.userId);
    throw new AppError(httpStatus.FORBIDDEN, "You are forbidden!");
  }

  //hash new password
  const newHashedPassword = await bcryptjs.hash(
    payload.newPassword,
    Number(config.salt_round)
  );

  await User.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    }
  );
};
export const authServices = {
  signUp,
  login,
  forgotPassword,
  resetPassword,
};

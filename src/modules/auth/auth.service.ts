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

const forgotPassword = async (userEmail: string) => {
  const user = await User.findOne({ email: userEmail });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  const resetToken = createToken(
    //@ts-ignore
    { userId: user._id },
    config.jwt_access_secret as string,
    "2h"
  );

  const resetUILink = `${config.reset_pass_ui_link}?token=${resetToken}`;
  await sendEmail(user.email, resetUILink);

  return resetToken;
};

const resetPassword = async (newPassword: string, token: string) => {
  let decodedToken;

  try {
    decodedToken = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;
  } catch (error) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid or expired token!");
  }

  const user = await User.findById(decodedToken.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  }

  const newHashedPassword = await bcryptjs.hash(
    newPassword,
    Number(config.salt_round)
  );

  user.password = newHashedPassword;
  //@ts-ignore
  user.passwordChangedAt = new Date();
  await user.save();

  return { message: "Password reset successfully!" };
};

export const authServices = {
  signUp,
  login,
  forgotPassword,
  resetPassword,
};

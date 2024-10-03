import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/user/user.model";
import config from "../config";
import catchAsync from "../utils/catchAsync";
import { ROLE } from "../modules/user/user.constant";
import AppError from "../errors/AppError";

export const auth = (...requiredRoles: (keyof typeof ROLE)[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(401, "You are not authorized to access this route");
    }

    try {
      const verifiedToken = jwt.verify(
        token,
        config.jwt_access_secret as string
      );

      const { role, email } = verifiedToken as JwtPayload;

      const user = await User.findOne({ email });

      if (!user) {
        throw new AppError(401, "User not found");
      }

      if (!requiredRoles.includes(role)) {
        throw new AppError(401, "You are not authorized to access this route");
      }

      // @ts-ignore
      req.user = user;

      next();
    } catch (error) {
      throw new AppError(401, "Invalid token");
    }
  });
};

export default auth;

import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { authServices } from "./auth.service";
import crypto from "crypto";
import { User } from "../user/user.model";
import sendResponse from "../../utils/sendResponse";
import AppError from "../../errors/AppError";

const signUp = catchAsync(async (req, res) => {
  const result = await authServices.signUp(req.body);

  res.status(200).json({
    success: true,
    statusCode: 201,
    message: "User registered successfully",
    data: result,
  });
});

const login = catchAsync(async (req, res) => {
  const { token, user } = await authServices.login(req.body);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "User logged in successfully",
    token,
    data: user,
  });
});

const forgetPassword = catchAsync(async (req, res) => {
  const userId = req.body.id;
  const result = await authServices.forgotPassword(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Reset link is generated succesfully!",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, "Something went wrong !");
  }

  const result = await authServices.resetPassword(req.body, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset succesfully!",
    data: result,
  });
});

export const authControllers = {
  signUp,
  login,
  resetPassword,
  forgetPassword,
};

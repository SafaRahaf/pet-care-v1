import { ErrorRequestHandler } from "express";
import { TErrorSources } from "../interface/error";
import { ZodError } from "zod";
import handleZodError from "../errors/handleZodError";
import { handleValidationError } from "../errors/handleValidationError";
import { handleCastError } from "../errors/handleCastError";
import handleDulicateError from "../errors/hadleDublicateError";
import AppError from "../errors/AppError";
import config from "../config";

export const globalErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  let statusCode = 500;
  let message = "Something is wrong!";

  let errorSources: TErrorSources = [
    {
      path: err.path,
      message: err.message,
    },
  ];

  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === "ValidationError") {
    const simplifiedError = handleValidationError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err?.code === 11000) {
    const simplifiedError = handleDulicateError(err);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message;
    errorSources = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.node_env === "development" ? err?.stack : null,
  });
};

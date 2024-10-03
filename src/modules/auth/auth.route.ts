import validateRequest from "../../middlewares/validationRequest";
import { authControllers } from "./auth.controllere";
import { AuthValidation } from "./auth.validation";

import express from "express";

const router = express.Router();

router.post(
  "/register",
  validateRequest(AuthValidation.createRegisterAuthValidation),
  authControllers.signUp
);
router.post(
  "/login",
  validateRequest(AuthValidation.createLoginAuthValidation),
  authControllers.login
);

// auth.route.ts
router.post(
  "/forgot-password",
  validateRequest(AuthValidation.createForgotPasswordValidation),
  authControllers.forgetPassword
);

router.post(
  "/reset-password/:token",
  validateRequest(AuthValidation.createResetPasswordValidation),
  authControllers.resetPassword
);

//need to add more profile update and delete systems

export const AuthRoutes = router;

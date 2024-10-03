import { z } from "zod";

const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" })
  .refine((val) => /[a-zA-Z]/.test(val), {
    message: "Password must contain at least one alphabet",
  })
  .refine((val) => /\d/.test(val), {
    message: "Password must contain at least one number",
  });

const createRegisterAuthValidation = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email format" }),
    password: passwordSchema,
  }),
});

const createLoginAuthValidation = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Invalid email format" }),
    password: passwordSchema,
  }),
});

const createForgotPasswordValidation = z.object({
  body: z.object({
    // email: z.string({
    //   required_error: "User email is required!",
    // }),
    id: z.string({
      required_error: "User id is required!",
    }),
  }),
});

const createResetPasswordValidation = z.object({
  body: z.object({
    id: z.string({
      required_error: "User id is required!",
    }),
    newPassword: z.string({
      required_error: "User password is required!",
    }),
  }),
});

export const AuthValidation = {
  createRegisterAuthValidation,
  createLoginAuthValidation,
  createForgotPasswordValidation,
  createResetPasswordValidation,
};

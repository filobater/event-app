import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .email({ message: "Please provide a valid email" })
    .toLowerCase()
    .trim(),
});

export const signupSchema = z
  .object({
    fullName: z
      .string({ message: "Full name is required" })
      .min(3, "Full name must be at least 3 characters")
      .trim(),

    ...emailSchema.shape,

    password: z
      .string({ message: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .trim(),

    confirmPassword: z
      .string({ message: "Please confirm your password" })
      .trim(),
    role: z.enum(["admin", "user"]).default("user"),
    otp: z.string().nullable().optional(),
    otpExpiresAt: z.date().nullable().optional(),
    passwordChangedAt: z.date().nullable().optional(),
    passwordResetToken: z.string().nullable().optional(),
    passwordResetExpiresAt: z.number().nullable().optional(),
    isVerified: z.boolean().default(false),
    profilePicture: z.string().nullable().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords are not the same",
    path: ["confirmPassword"],
  });

export const signinSchema = z.object({
  ...emailSchema.shape,

  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

export const verifyOTPSchema = z.object({
  ...emailSchema.shape,
  otp: z.string({ message: "OTP is required" }),
});

export const resetPasswordSchema = z
  .object({
    password: z
      .string({ message: "Password is required" })
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string({ message: "Please confirm your password" })
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords are not the same",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>;

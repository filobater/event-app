import { z } from "zod";
export type { SignupInput } from "./auth.schema.ts";

export const updateUserProfileSchema = z.object({
  fullName: z
    .string({ message: "Full name is required" })
    .min(3, "Full name must be at least 3 characters")
    .trim(),
  profilePicture: z.string().nullable().optional(),
});

export const updateUserSchema = z.object({
  ...updateUserProfileSchema.shape,
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
  role: z.enum(["admin", "user"]).default("user"),
});

export const updateUserPasswordSchema = z
  .object({
    currentPassword: z.string({ message: "Current password is required" }),
    newPassword: z
      .string({ message: "New password is required" })
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z
      .string({ message: "Please confirm your password" })
      .trim(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords are not the same",
    path: ["confirmPassword"],
  });

export type UpdateUserInput = Partial<z.infer<typeof updateUserSchema>>;

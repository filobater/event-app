import { z } from "zod";

const objectIdSchema = z
  .string({ message: "Invalid id" })
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const registrationSchema = z.object({
  user: objectIdSchema.optional(),
  event: objectIdSchema,
  status: z
    .enum(["reserved", "confirmed", "cancelled"], {
      message: "Status is required",
    })
    .optional(),
  seatsCount: z.coerce
    .number({ message: "Seats count is required" })
    .int("Seats count must be an integer")
    .min(1, "Seats count must be at least 1"),
  totalAmount: z.coerce
    .number({ message: "Total amount is required" })
    .min(0, "Total amount must be greater than or equal to 0")
    .optional(),
  expiresAt: z.coerce
    .date({ message: "Expires at is required" })
    .min(new Date(), "Expires at must be in the future")
    .optional(),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

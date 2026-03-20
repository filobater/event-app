import { Schema, model, type HydratedDocument } from "mongoose";
import type { RegistrationInput } from "schemas/registration.schema.ts";

export type RegistrationDocument = HydratedDocument<RegistrationInput>;

const registrationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    status: {
      type: String,
      enum: ["reserved", "confirmed", "cancelled"],
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
    },
    seatsCount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Registration = model("Registration", registrationSchema);

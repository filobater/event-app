import { Schema, model, type HydratedDocument, type Types } from "mongoose";

type RegistrationFields = {
  user: Types.ObjectId;
  event: Types.ObjectId;
  status: "reserved" | "confirmed" | "cancelled";
  seatsCount: number;
  totalAmount: number;
  expiresAt: Date | null;
};

export type RegistrationDocument = HydratedDocument<RegistrationFields>;

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

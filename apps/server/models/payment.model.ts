import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
  {
    registrationId: {
      type: Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "EGP",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["simulation"],
      required: true,
    },
    transactionId: {
      type: String,
      default: null,
    },
    failureReason: {
      type: String,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const Payment = model("Payment", paymentSchema);

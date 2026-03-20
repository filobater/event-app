import mongoose, { type Types } from "mongoose";
import { Payment } from "models/payment.model.ts";
import crypto from "crypto";
import type { EventDto } from "@events-app/shared-dtos";
import { AppError } from "utils/AppError.ts";

export const createPayment = async (
  registration: any,
  type: EventDto["type"],
  session: mongoose.ClientSession,
) => {
  // id, amount from the registration
  //paymentStatus = pending
  //generate transactionId,
  const body = {
    amount: registration.totalAmount,
    registrationId: registration._id,
    paymentStatus: type === "free" ? "completed" : "pending",
    transactionId:
      type === "free"
        ? null
        : `${registration._id}-${crypto.randomBytes(32).toString("hex")}`,
  };
  await Payment.create([body], { session });
};

export const processPayment = async (
  registrationId: Types.ObjectId,
  session: mongoose.ClientSession,
) => {
  const updatedPayment = await Payment.updateOne(
    { registrationId },
    { $set: { paymentStatus: "completed", paidAt: new Date() } },
    { session },
  );
  if (updatedPayment.matchedCount === 0) {
    throw new AppError("Payment not found", 404);
  }
};

export const cancelPayment = async (
  registrationId: Types.ObjectId,
  status: string,
  session: mongoose.ClientSession,
) => {
  const reasons = {
    confirmed: "Registration cancelled by user after payment",
    reserved: "Registration cancelled by user before payment",
  };

  let paymentStatus = status === "confirmed" ? "refunded" : "failed";

  const updatedPayment = await Payment.updateOne(
    { registrationId },
    {
      $set: {
        paymentStatus: paymentStatus,
        failureReason: reasons[status as keyof typeof reasons],
      },
    },
    { session },
  );
  if (updatedPayment.matchedCount === 0) {
    throw new AppError("Payment not found", 404);
  }
};

import cron from "node-cron";
import mongoose from "mongoose";
import { Registration } from "models/registration.model.ts";
import { Payment } from "models/payment.model.ts";
import { Event } from "models/event.model.ts";

export const updateRegistrationPaymentStatus = () => {
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();

      const expiredRegistrations = await Registration.find({
        expiresAt: { $lt: now },
        status: "reserved",
      });

      if (!expiredRegistrations.length) {
        console.log("No expired registrations found");
        return;
      }

      const session = await mongoose.startSession();
      await session.withTransaction(async () => {
        for (const registration of expiredRegistrations) {
          await Event.findByIdAndUpdate(
            registration.event,
            { $inc: { registeredSeats: -registration.seatsCount } },
            { session },
          );
        }

        await Registration.updateMany(
          {
            _id: { $in: expiredRegistrations.map((r) => r._id) },
          },
          {
            $set: { status: "cancelled", expiresAt: null },
          },
          { session },
        );

        await Payment.updateMany(
          {
            registrationId: {
              $in: expiredRegistrations.map((r) => r._id),
            },
          },
          {
            $set: {
              paymentStatus: "failed",
              failureReason: "Payment timed out",
            },
          },
          { session },
        );
      });

      session.endSession();
      console.log(
        `Cancelled ${expiredRegistrations.length} expired registrations`,
      );
    } catch (error) {
      console.error("Expiry cron job failed:", error);
    }
  });
};

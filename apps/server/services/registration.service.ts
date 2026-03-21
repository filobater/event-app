import type { UserDto } from "@events-app/shared-dtos";
import { Event } from "models/event.model.ts";
import {
  Registration,
  type RegistrationDocument,
} from "models/registration.model.ts";
import mongoose, { type ObjectId, type Types } from "mongoose";
import type { RegistrationInput } from "schemas/registration.schema.ts";
import { AppError } from "utils/AppError.ts";
import {
  cancelPayment,
  createPayment,
  processPayment,
} from "./payment.service.ts";
import { User } from "models/user.model.ts";

// check event capacity
// create Registration (status: "reserved", expiresAt: now+10mins)
// calls Payment Service
export const createRegistrationService = async (
  registration: RegistrationInput,
  user: UserDto,
) => {
  const { event, seatsCount } = registration;

  const existingEvent = await Event.findById(event);
  if (!existingEvent) {
    throw new AppError("Event not found", 404);
  }

  const existingRegistration = await Registration.findOne({
    user: user._id,
    event,
    $or: [{ status: "reserved" }, { status: "confirmed" }],
  });
  if (existingRegistration) {
    throw new AppError("You have already registered for this event", 409);
  }

  if (existingEvent.status === "completed") {
    throw new AppError("Event is completed", 400);
  }

  const availableSeats =
    existingEvent.totalSeats - existingEvent.registeredSeats;
  if (availableSeats < seatsCount) {
    throw new AppError("Not enough seats available", 400);
  }

  const amount = existingEvent.price * seatsCount;

  try {
    let createdRegistration: RegistrationDocument | null = null;
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      await Event.findByIdAndUpdate(
        existingEvent._id,
        { $inc: { registeredSeats: seatsCount } },
        { session },
      );
      const newRegistration = await Registration.create(
        [
          {
            status: existingEvent.type === "free" ? "confirmed" : "reserved",
            event: existingEvent._id,
            user: user._id,
            totalAmount: amount,
            seatsCount,
          },
        ],
        { session },
      );
      await createPayment(newRegistration[0], existingEvent.type, session);
      createdRegistration = newRegistration[0];
    });
    session.endSession();
    if (!createdRegistration) {
      throw new AppError("Failed to create registration", 500);
    }
    return createdRegistration;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to create registration", 500);
  }
};

// 1- check on registration with id an expiresAt existence
// 2-event exist
// if not ok throw error
// 3- check on the user balance
// if not ok> throw error
// if ok
// start the transaction and
// take the balance
// update the registrations status to confirmed and expiresAt to null
// update the payment status to completed
export const payForRegistrationService = async (
  existingRegistration: RegistrationDocument,
) => {
  if (!existingRegistration) {
    console.log("existingRegistration", existingRegistration);
    return;
  }
  if (existingRegistration.status !== "reserved") {
    throw new AppError(`Already ${existingRegistration.status}`, 400);
  }
  if (
    !existingRegistration.expiresAt ||
    existingRegistration.expiresAt < new Date()
  ) {
    throw new AppError("Registration has expired", 400);
  }

  const { totalAmount } = existingRegistration;
  if (totalAmount === undefined) {
    throw new AppError("Invalid registration amount", 500);
  }

  try {
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      const user = await User.findById(existingRegistration.user).session(
        session,
      );
      if (!user) {
        throw new AppError("User not found", 404);
      }
      if (user.balance < totalAmount) {
        throw new AppError("Insufficient balance", 400);
      }

      const updatedUser = await User.updateOne(
        { _id: existingRegistration.user },
        { $inc: { balance: -totalAmount } },
        { session },
      );
      if (updatedUser.matchedCount === 0) {
        throw new AppError("Failed to update user balance", 500);
      }

      const updatedRegistration = await Registration.updateOne(
        { _id: existingRegistration._id },
        { $set: { status: "confirmed", expiresAt: null } },
        { session },
      );
      if (updatedRegistration.matchedCount === 0) {
        throw new AppError("Failed to update registration status", 500);
      }

      await processPayment(existingRegistration._id, session);
    });

    session.endSession();
    return { message: "Payment successful" };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to process payment", 500);
  }
};

export const cancelRegistrationService = async (
  existingRegistration: RegistrationDocument,
) => {
  if (existingRegistration.status === "cancelled") {
    throw new AppError("Registration is already cancelled", 400);
  }

  try {
    let cancelledRegistration: RegistrationDocument | null = null;
    const session = await mongoose.startSession();
    await session.withTransaction(async () => {
      await Event.findByIdAndUpdate(
        existingRegistration.event,
        { $inc: { registeredSeats: -existingRegistration.seatsCount } },
        { session },
      );

      if (existingRegistration.status === "confirmed") {
        const updatedUser = await User.updateOne(
          { _id: existingRegistration.user },
          { $inc: { balance: existingRegistration.totalAmount } },
          { session },
        );
        if (updatedUser.matchedCount === 0) {
          throw new AppError("Failed to update user balance", 500);
        }
      }

      cancelledRegistration = await Registration.findByIdAndUpdate(
        existingRegistration._id,
        { $set: { status: "cancelled", expiresAt: null } },
        { session, new: true },
      );
      if (!cancelledRegistration) {
        throw new AppError("Failed to update registration status", 500);
      }

      await cancelPayment(
        existingRegistration._id,
        existingRegistration.status ?? "",
        session,
      );
    });

    session.endSession();
    return cancelledRegistration;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("Failed to cancel registration", 500);
  }
};

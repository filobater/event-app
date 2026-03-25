import { Model, Schema, Types, model, type HydratedDocument } from "mongoose";
import type { RegistrationInput } from "schemas/registration.schema.ts";

interface IRegistration extends Omit<RegistrationInput, "user" | "event"> {
  user: Types.ObjectId;
  event: Types.ObjectId;
}

interface IRegistrationStatics {
  searchByEventTitle(
    userId: string,
    search: string,
    page: number,
  ): Promise<{ registrations: IRegistration[]; total: number }>;
}

export type RegistrationDocument = HydratedDocument<
  IRegistration,
  IRegistrationStatics
>;
type RegistrationModel = Model<IRegistration, object, object> &
  IRegistrationStatics;

const registrationSchema = new Schema<IRegistration, RegistrationModel>(
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

registrationSchema.index({ status: 1 });
registrationSchema.pre("find", function () {
  this.populate([{ path: "user", select: "fullName" }, { path: "event" }]);
});
registrationSchema.statics.searchByEventTitle = async function (
  userId: string,
  search: string,
  page: number,
) {
  const limit = 10;
  const skip = (page - 1) * limit;
  const pipeline = [
    {
      $match: {
        user: userId,
        $or: [{ status: "reserved" }, { status: "confirmed" }],
      },
    },
    {
      $lookup: {
        from: "events",
        localField: "event",
        foreignField: "_id",
        as: "event",
      },
    },
    {
      $unwind: "$event",
    },
    {
      $match: {
        // the options are i for case insensitive
        "event.title": { $regex: search, $options: "i" },
      },
    },
  ];

  const [registrations, total] = await Promise.all([
    this.aggregate([...pipeline, { $skip: skip }, { $limit: limit }]),
    this.aggregate([...pipeline, { $count: "totalRegistrations" }]),
  ]);

  return { registrations, total: total[0]?.totalRegistrations ?? 0 };
};

export const Registration = model<IRegistration, RegistrationModel>(
  "Registration",
  registrationSchema,
);

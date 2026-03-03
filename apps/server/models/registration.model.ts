import { Schema, model } from "mongoose";

const registrationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    status: {
      type: String,
      enum: ["reserved", "confirmed", "cancelled"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Registration = model("Registration", registrationSchema);

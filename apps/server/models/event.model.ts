import { Schema, model } from "mongoose";

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    registeredSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["ongoing", "upcoming", "completed"],
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    speakers: {
      type: [
        {
          name: String,
          title: String,
          image: {
            data: Buffer,
            contentType: String,
          },
        },
      ],
      required: true,

      validate: {
        validator: function (value: []) {
          return value.length <= 2;
        },
        message: "Maximum 2 speakers allowed",
      },
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["free", "paid"],
      required: true,
    },
    category: {
      type: String,
      enum: ["technology", "business", "design", "marketing"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Event = model("Event", eventSchema);

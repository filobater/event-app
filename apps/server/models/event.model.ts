import { Schema, model, type HydratedDocument } from "mongoose";
import type { EventSchema } from "schemas/event.schema.ts";

export type EventDocument = HydratedDocument<EventSchema>;

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
    },
    location: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
      default: new Date(),
    },
    totalSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    registeredSeats: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["ongoing", "upcoming", "completed"],
      required: true,
    },
    photo: {
      type: String,
      default: null,
    },
    speakers: {
      type: [
        {
          name: {
            type: String,
            required: true,
          },
          title: {
            type: String,
            required: true,
          },
          image: {
            type: String,
            default: null,
            required: true,
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

eventSchema.pre("save", function () {
  if (this.price === 0) {
    this.type = "free";
  } else {
    this.type = "paid";
  }
  // when a new event is created, the registered seats are set to 0
  if (this.isNew) {
    this.registeredSeats = 0;
  }
});

eventSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret["__v"];
    return ret;
  },
});

eventSchema.index({ title: "text" });

eventSchema.index({ createdAt: -1 });

eventSchema.index({ title: 1, createdAt: -1 });

export const Event = model("Event", eventSchema);

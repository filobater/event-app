import { z } from "zod";

export const eventSchema = z.object({
  title: z
    .string({
      message: "Title is required",
    })
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string({
      message: "Description is required",
    })
    .min(10, "Description must be at least 10 characters"),
  location: z
    .string({
      message: "Location is required",
    })
    .min(10, "Location must be at least 10 characters"),
  dateTime: z.coerce
    .date({ message: "Date and time is required" })
    .min(new Date(), "Date and time must be in the future"),
  endTime: z.coerce
    .date({ message: "End time is required" })
    .min(new Date(), "End time must be in the future"),
  totalSeats: z.coerce
    .number({
      message: "Total seats is required",
    })
    .min(10, "Total seats must be greater than or equal to 10")
    .transform((val) => Number(val)),
  status: z.enum(["ongoing", "upcoming", "completed"], {
    message: "Status is required",
  }),
  photo: z.string({
    message: "Photo is required",
  }),
  speakers: z
    .array(
      z.object({
        name: z
          .string({ message: "Speaker name is required" })
          .min(3, "Speaker name must be at least 3 characters"),
        title: z
          .string({ message: "Speaker title is required" })
          .min(3, "Speaker title must be at least 3 characters"),
        image: z.string({
          message: "Speaker image is required",
        }),
      }),
      {
        message: "Speakers are required",
      },
    )
    .max(2, "Maximum 2 speakers allowed"),
  price: z.coerce
    .number({
      message: "Price is required",
    })
    .min(0, "Price must be greater than or equal to 0")
    .transform((val) => Number(val)),
  type: z
    .enum(["free", "paid"], {
      message: "Type is required",
    })
    .default("free"),
  category: z.enum(["technology", "business", "design", "marketing"], {
    message: "Category is required",
  }),
});

export type EventSchema = z.infer<typeof eventSchema>;

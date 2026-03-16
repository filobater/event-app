import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(1, "Location is required"),
  dateTime: z.coerce.date().min(new Date(), "Date and time must be in the future"),
  totalSeats: z.number().min(0, "Total seats must be greater than or equal to 0"),
  registeredSeats: z.number().min(0, "Registered seats must be greater than or equal to 0"),
  status: z.enum(["ongoing", "upcoming", "completed"], {
    message: "Status is required",
  }),
  photo: z.string().nullable().optional(),
  speakers: z
    .array(
      z.object({
        name: z.string().min(1, "Speaker name is required"),
        title: z.string().min(1, "Speaker title is required"),
        image: z.object({
          data: z.any().optional(),
          contentType: z.string().optional(),
        }),
      }),
    )
    .max(2, "Maximum 2 speakers allowed")
    .nonempty("At least one speaker is required"),
  price: z
    .number({
      message: "Price is required",
    })
    .min(0, "Price must be greater than or equal to 0"),
  type: z.enum(["free", "paid"], {
    message: "Type is required",
  }),
  category: z.enum(["technology", "business", "design", "marketing"], {
    message: "Category is required",
  }),
});

export type EventSchema = z.infer<typeof eventSchema>;

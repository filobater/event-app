import { z } from "zod";
import type { EventSchema } from "./event.schema.ts";

export const eventRefinement = (
  data: Partial<EventSchema>,
  ctx: z.RefinementCtx,
) => {
  if (data.endTime && data.dateTime && data.endTime <= data.dateTime) {
    ctx.addIssue({
      code: "custom",
      message: "End time must be after the start date and time",
      path: ["endTime"],
    });
  }
};

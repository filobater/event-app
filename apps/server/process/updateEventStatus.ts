import cron from "node-cron";
import { Event } from "models/event.model.ts";

export const updateEventStatus = () => {
  cron.schedule("*/60 * * * *", async () => {
    try {
      const now = new Date();
      // check on the events thats not completed and the endTime< Date to update all with status complete
      await Event.updateMany(
        {
          endTime: { $lt: now },
          status: { $ne: "completed" },
        },
        {
          $set: { status: "completed" },
        },
      );
      //check on the upcoming if the dateTime === date >>> ongoing
      await Event.updateMany(
        {
          dateTime: { $lte: now },
          endTime: { $gte: now },
          status: { $ne: "ongoing" },
        },
        {
          $set: { status: "ongoing" },
        },
      );
    } catch (error) {
      console.error("Error updating event status:", error);
    }
  });
};

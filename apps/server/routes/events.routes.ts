import { Router } from "express";
import { API_ENDPOINTS } from "@events-app/endpoints";
import {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/events.controller.ts";
import { restrictTo } from "middlewares/restrictTo.middleware.ts";
import { validate } from "middlewares/validate.middleware.ts";
import { protect } from "middlewares/auth.middleware.ts";
import { eventSchema } from "schemas/event/event.schema.ts";
import { eventRefinement } from "schemas/event/event.refine.schema.ts";
import { checkId } from "middlewares/checkId.middleware.ts";
import { Event } from "models/event.model.ts";
import { upload } from "middlewares/upload/upload.middleware.ts";
import { compressAndSave } from "middlewares/upload/compressAndSave.middleware.ts";

const router = Router();

const uploadEventAndSpeakerImages = [
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "speakerImages", maxCount: 2 },
  ]),
  compressAndSave([
    {
      type: "single",
      fieldName: "photo",
      bodyKey: "photo",
      prefix: "event",
      width: 1280,
      height: 720,
    },
    {
      type: "array",
      fieldName: "speakerImages",
      bodyKey: "speakers",
      imageKey: "image",
      prefix: "speaker",
      width: 400,
      height: 400,
      maxCount: 2,
    },
  ]),
];

router.use(protect);

router.param("id", checkId(Event, "event"));

router.get(API_ENDPOINTS.events.getAll, getAllEvents);
router.get(API_ENDPOINTS.events.byId, getEvent);

router.use(restrictTo("admin"));

router.post(
  API_ENDPOINTS.events.create,
  uploadEventAndSpeakerImages,
  validate(eventSchema.superRefine(eventRefinement)),
  createEvent,
);
router.patch(
  API_ENDPOINTS.events.byId,
  uploadEventAndSpeakerImages,
  validate(eventSchema.partial().superRefine(eventRefinement)),
  updateEvent,
);
router.delete(API_ENDPOINTS.events.byId, deleteEvent);

export default router;

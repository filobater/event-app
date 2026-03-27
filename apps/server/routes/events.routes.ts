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

const router = Router();

router.use(protect);

router.param("id", checkId(Event, "event"));

router.get(API_ENDPOINTS.events.getAll, getAllEvents);
router.get(API_ENDPOINTS.events.byId, getEvent);

router.use(restrictTo("admin"));

router.post(
  API_ENDPOINTS.events.create,
  validate(eventSchema.superRefine(eventRefinement)),
  createEvent,
);
router.patch(
  API_ENDPOINTS.events.byId,
  validate(eventSchema.partial().superRefine(eventRefinement)),
  updateEvent,
);
router.delete(API_ENDPOINTS.events.byId, deleteEvent);

export default router;

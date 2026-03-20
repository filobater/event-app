
import { Router } from "express";
import { API_ENDPOINTS } from "@events-app/endpoints";
import { validate } from "middlewares/validate.middleware.ts";
import { protect } from "middlewares/auth.middleware.ts";
import { checkId } from "middlewares/checkId.middleware.ts";
import { registrationSchema } from "schemas/registration.schema.ts";
import { Registration } from "models/registration.model.ts";
import {
  cancelRegistration,
  createRegistration,
  getRegistration,
  payForRegistration,
} from "../controllers/registrations.controller.ts";

const router = Router();

router.use(protect);

router.param("id", checkId(Registration, "registration"));

router.post(
  API_ENDPOINTS.registrations.create,
  validate(registrationSchema.pick({ event: true, seatsCount: true })),
  createRegistration,
);

router.patch(
  API_ENDPOINTS.registrations.pay,
  validate(registrationSchema.partial()),
  payForRegistration,
);

router.patch(
  API_ENDPOINTS.registrations.cancel,
  validate(registrationSchema.partial()),
  cancelRegistration,
);

router.get(API_ENDPOINTS.registrations.getAll, getRegistration);

export default router;

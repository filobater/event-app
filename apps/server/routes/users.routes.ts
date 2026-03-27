import { Router } from "express";
import { API_ENDPOINTS } from "@events-app/endpoints";
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  updateUserProfile,
  updateUserPassword,
  deleteUser,
  getMe,
} from "../controllers/users.controller.ts";
import { getUserRegistrations } from "../controllers/registrations.controller.ts";
import { restrictTo } from "middlewares/restrictTo.middleware.ts";
import { validate } from "middlewares/validate.middleware.ts";
import { protect } from "middlewares/auth.middleware.ts";
import { signupSchema } from "schemas/auth.schema.ts";
import {
  updateUserProfileSchema,
  updateUserPasswordSchema,
  updateUserSchema,
} from "schemas/user.schema.ts";
import { checkId } from "middlewares/checkId.middleware.ts";
import { User } from "models/user.model.ts";

const router = Router();

router.use(protect);

router.param("id", checkId(User, "targetUser"));

router.patch(
  API_ENDPOINTS.users.updateProfile,
  validate(updateUserProfileSchema),
  updateUserProfile,
);
router.patch(
  API_ENDPOINTS.users.updatePassword,
  validate(updateUserPasswordSchema),
  updateUserPassword,
);

router.get(API_ENDPOINTS.users.getMe, getMe);
router.use(restrictTo("admin"));

router.post(
  API_ENDPOINTS.users.create,
  validate(signupSchema),
  createUser,
);

router.get(API_ENDPOINTS.users.getAll, getAllUsers);

router.get(API_ENDPOINTS.users.byId, getUser);
router.get(API_ENDPOINTS.users.userRegistrations, getUserRegistrations);

router.patch(
  API_ENDPOINTS.users.byId,
  validate(updateUserSchema),
  updateUser,
);
router.delete(API_ENDPOINTS.users.byId, deleteUser);

export default router;

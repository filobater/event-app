import { Router } from "express";
import { API_ENDPOINTS } from "@events-app/endpoints";
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  updateUserProfile,
  updateUserPassword,
  checkUserId,
  deleteUser,
  getMe,
} from "../controllers/users.controller.ts";
import { restrictTo } from "middlewares/restrictTo.middleware.ts";
import { validate } from "middlewares/validate.middleware.ts";
import { protect } from "middlewares/auth.middleware.ts";
import { signupSchema } from "schemas/auth.schema.ts";
import {
  updateUserProfileSchema,
  updateUserPasswordSchema,
  updateUserSchema,
} from "schemas/user.schema.ts";
import { compressAndSave, upload } from "middlewares/upload.middleware.ts";

const router = Router();

const uploadUserProfilePicture = [
  upload.single("profilePicture"),
  compressAndSave("profilePicture", 500, 500),
];

router.use(protect);

router.param("id", checkUserId);

router.patch(
  API_ENDPOINTS.users.updateProfile,
  uploadUserProfilePicture,
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
  uploadUserProfilePicture,
  validate(signupSchema),
  createUser,
);

router.get(API_ENDPOINTS.users.getAll, getAllUsers);

router.get(API_ENDPOINTS.users.byId("id"), getUser);

// router.get(API_ENDPOINTS.users.getAll, getAllUsers);
router.patch(
  API_ENDPOINTS.users.byId("id"),
  uploadUserProfilePicture,
  validate(updateUserSchema),
  updateUser,
);
router.delete(API_ENDPOINTS.users.byId("id"), deleteUser);

export default router;

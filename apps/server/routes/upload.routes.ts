import { Router } from "express";
import { API_ENDPOINTS } from "@events-app/endpoints";
import { protect } from "middlewares/auth.middleware.ts";
import { resolveUploadSpec } from "middlewares/upload/resolve.upload.middleware.ts";
import {
  handleMultipleUpload,
  handleSingleUpload,
} from "middlewares/upload/multer.middleware.ts";
import { uploadController } from "controllers/upload.controller.ts";

const router = Router();

router.use(protect);

router.post(
  API_ENDPOINTS.upload.single,
  resolveUploadSpec,
  handleSingleUpload,
  uploadController,
);
router.post(
  API_ENDPOINTS.upload.multiple,
  resolveUploadSpec,
  handleMultipleUpload,
  uploadController,
);

export default router;

import { Router } from "express";
import {
  signin,
  signup,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  refreshToken,
  signout,
  protect,
} from "../controllers/auth.controller.ts";
import {
  signinSchema,
  signupSchema,
  verifyOTPSchema,
  emailSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import { API_ENDPOINTS } from "@events-app/endpoints";

const router = Router();

router.post(API_ENDPOINTS.auth.signup, validate(signupSchema), signup);
router.post(API_ENDPOINTS.auth.verifyOtp, validate(verifyOTPSchema), verifyOTP);
router.post(API_ENDPOINTS.auth.resendOtp, validate(emailSchema), resendOTP);
router.post(API_ENDPOINTS.auth.signin, validate(signinSchema), signin);
router.post(
  API_ENDPOINTS.auth.forgotPassword,
  validate(emailSchema),
  forgotPassword,
);
router.post(
  API_ENDPOINTS.auth.resetPassword(":resetToken"),
  validate(resetPasswordSchema),
  resetPassword,
);

router.use(protect);
router.post(API_ENDPOINTS.auth.signout, signout);
router.post(API_ENDPOINTS.auth.refreshToken, refreshToken);
export default router;

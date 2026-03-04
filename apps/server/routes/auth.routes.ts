import { Router } from "express";
import {
  signin,
  signup,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.ts";
import {
  signinSchema,
  signupSchema,
  verifyOTPSchema,
  emailSchema,
  resetPasswordSchema,
} from "../schemas/user.schema.ts";
import { validate } from "../middlewares/validate.middleware.ts";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/verify-otp", validate(verifyOTPSchema), verifyOTP);
router.post("/resend-otp", validate(emailSchema), resendOTP);
router.post("/signin", validate(signinSchema), signin);
router.post("/forgot-password", validate(emailSchema), forgotPassword);
router.post(
  "/reset-password/:resetToken",
  validate(resetPasswordSchema),
  resetPassword,
);
export default router;

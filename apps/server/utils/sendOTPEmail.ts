import { AppError } from "./AppError.ts";
import sendEmail from "./sendEmail.ts";

const OTP_EXPIRY_MINUTES = 10;

export const sendOTPEmail = async (
  email: string,
  otp: string,
): Promise<void> => {
  try {
    await sendEmail({
      email,
      subject: "Your verification OTP",
      message: `Your OTP is ${otp}. It will expire in ${OTP_EXPIRY_MINUTES} minutes. Do not share it with anyone.`,
    });
  } catch (error) {
    throw new AppError("Failed to send OTP email", 500);
  }
};

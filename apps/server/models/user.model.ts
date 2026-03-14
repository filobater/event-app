import { Schema, model, type HydratedDocument, type Model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import type { SignupInput } from "schemas/user.schema.ts";
import crypto from "crypto";
interface IUserMethods {
  comparePassword(enteredPassword: string): Promise<boolean>;
  generateOTP(): { otp: string; otpExpiresAt: Date };
  generatePasswordResetToken(): string;
  isPasswordChangedAfter(iat: number): boolean;
}

type UserModel = Model<SignupInput, object, IUserMethods>;

export type UserDocument = HydratedDocument<SignupInput, IUserMethods>;

const userSchema = new Schema<SignupInput, UserModel, IUserMethods>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      maxlength: 50,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: 8,
      select: false,
    },
    passwordChangedAt: {
      type: Date,
      default: null,
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    otp: {
      type: String,
      default: null,
      select: false,
    },
    otpExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: {
      type: String,
      default: null,
      select: false,
    },
    passwordResetExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },
    profilePicture: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

userSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret["password"];
    delete ret["otp"];
    delete ret["otpExpiresAt"];
    delete ret["passwordResetToken"];
    delete ret["passwordResetExpiresAt"];
    delete ret["__v"];
    return ret;
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

userSchema.methods.isPasswordChangedAfter = function (iat: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      (this.passwordChangedAt.getTime() / 1000).toString(),
      10,
    );
    return iat < changedTimestamp;
  }
  return false;
};

// text index searches words, not inside the word.
userSchema.index({ fullName: "text" });

// default sort (newest first)
userSchema.index({ createdAt: -1 });

userSchema.index({ fullName: 1, createdAt: -1 });

export const User = model<SignupInput, UserModel>("User", userSchema);

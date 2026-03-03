import { Schema, model } from "mongoose";
import validators from "validators";
const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: [validators.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },

  timestamps: true,
});

export const User = model("User", userSchema);

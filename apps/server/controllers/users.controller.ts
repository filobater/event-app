import { User } from "models/user.model.ts";
import type { Request, Response } from "express";
import { sendResponse } from "utils/sendResponse.ts";
import { AppError } from "utils/AppError.ts";
import { ApiFeatures } from "utils/ApiFeatures.ts";
import { replaceFile } from "utils/replaceFile.ts";

// create user from admin
// in this step we take directly the user because there will ba validation from zod

// admin

export const createUser = async (req: Request, res: Response) => {
  const createdUser = await User.create({
    ...req.body,
    isVerified: true,
  });

  sendResponse({
    res,
    statusCode: 201,
    message: "User created successfully",
    data: {
      user: createdUser,
    },
  });
};

export const getUser = async (req: Request, res: Response) => {
  const { targetUser } = req;
  sendResponse({
    res,
    statusCode: 200,
    message: "User fetched successfully",
    data: {
      user: targetUser,
    },
  });
};

export const getAllUsers = async (req: Request, res: Response) => {
  const queryUsers = User.find();
  // this is here because we need to count the total users before the pagination
  const totalFeatures = new ApiFeatures(queryUsers, req.query).search();

  const totalUsers = await User.countDocuments(totalFeatures.query.getFilter());

  // this is here because we need to get the users after the pagination
  const features = new ApiFeatures(queryUsers, req.query)
    .search()
    .sort()
    .paginate();

  const users = await features.query;

  sendResponse({
    res,
    statusCode: 200,
    message: "Users fetched successfully",
    data: {
      users,
      count: users.length,
      totalData: totalUsers,
      totalPages: Math.ceil(totalUsers / 10) || 1,
      page: Number(req.query.page) || 1,
    },
  });
};

export const updateUser = async (req: Request, res: Response) => {
  const { targetUser } = req;

  if (req.body.email) {
    throw new AppError("Email is not allowed to be updated", 400);
  }
  replaceFile(targetUser.profilePicture, req, "profilePicture");

  const updatedUser = Object.assign(targetUser, req.body);
  await updatedUser.save();

  sendResponse({
    res,
    statusCode: 200,
    message: "User updated successfully",
    data: {
      user: updatedUser,
    },
  });
};

export const deleteUser = async (req: Request, res: Response) => {
  const { targetUser } = req;
  replaceFile(targetUser.profilePicture);
  await targetUser.deleteOne();
  sendResponse({
    res,
    statusCode: 204,
    message: "User deleted successfully",
    data: null,
  });
};

// user

export const getMe = async (req: Request, res: Response) => {
  const { user } = req;
  sendResponse({
    res,
    statusCode: 200,
    message: "User fetched successfully",
    data: {
      user,
    },
  });
};

export const updateUserProfile = async (req: Request, res: Response) => {
  const { user } = req;
  const { fullName } = req.body;
  const profilePicture = replaceFile(
    user.profilePicture,
    req,
    "profilePicture",
  );

  const updatedUser = Object.assign(user, {
    ...(fullName && { fullName }),
    ...(profilePicture && { profilePicture }),
  });
  await updatedUser.save({
    validateBeforeSave: false,
  });
  sendResponse({
    res,
    statusCode: 200,
    message: "Profile updated successfully",
    data: {
      user: updatedUser,
    },
  });
};

// check on the user and user password

export const updateUserPassword = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?._id).select("+password");
  const { currentPassword, newPassword } = req.body;
  const passwordIsValid = await user?.comparePassword(currentPassword);
  if (!passwordIsValid) throw new AppError("Incorrect current Password", 400);
  user!.password = newPassword;
  await user!.save();

  sendResponse({
    res,
    statusCode: 200,
    message: "Password updated successfully",
    data: {
      user,
    },
  });
};

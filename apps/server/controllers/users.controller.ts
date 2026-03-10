import { User, type UserDocument } from "models/user.model.ts";
import type { Request, Response, NextFunction } from "express";
import { sendResponse } from "utils/sendResponse.ts";
import { AppError } from "utils/AppError.ts";
import { ApiFeatures } from "utils/ApiFeatures.ts";

interface UserRequest extends Request {
  targetUser?: UserDocument;
  user?: UserDocument;
}

export const checkUserId = async (
  req: UserRequest,
  _res: Response,
  next: NextFunction,
  value: string,
) => {
  const user = await User.findById(value);
  if (!user) throw new AppError("User not found", 404);
  req.targetUser = user;
  next();
};

// create user from admin
// in this step we take directly the user because there will ba validation from zod


// admin 

export const createUser = async (req: Request, res: Response) => {
  const createdUser = await User.create({
    ...req.body,
    profilePicture: req?.file?.path || null,
  });

  sendResponse({
    res,
    statusCode: 201,
    message: "User created successfully",
    data: createdUser,
  });
};

export const getUser = async (req: UserRequest, res: Response) => {
  // TODO: update this when the registration is done
  const { targetUser } = req;
  sendResponse({
    res,
    statusCode: 200,
    message: "User fetched successfully",
    data: targetUser,
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
      totalPages: Math.ceil(totalUsers / features.query.limit),
      page: Number(req.query.page) || 1,
    },
  });
};



export const updateUser = async (req: UserRequest, res: Response) => {
  const { targetUser } = req;

  if (req.body.email) {
    throw new AppError("email is not allowed to be updated", 400);
  }

  const updatedUser = await User.findByIdAndUpdate(targetUser?._id, req.body, {
    new: true,
    runValidators: false,
  });
  sendResponse({
    res,
    statusCode: 200,
    message: "User updated successfully",
    data: updatedUser,
  });
};

export const deleteUser = async (req: UserRequest, res: Response) => {
  const { targetUser } = req;
  await User.findByIdAndDelete(targetUser?._id);
  sendResponse({
    res,
    statusCode: 204,
    message: "User deleted successfully",
    data: null,
  });
};


// user update profile

export const updateUserProfile = async (req: UserRequest, res: Response) => {
  const { user } = req;
  const { fullName, profilePicture } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    user?._id,
    {
      fullName,
      profilePicture,
    },
    {
      new: true,
      runValidators: false,
    },
  );
  sendResponse({
    res,
    statusCode: 200,
    message: "Profile updated successfully",
    data: updatedUser,
  });
};

// check on the user and user password

export const updateUserPassword = async (req: UserRequest, res: Response) => {
  const user = await User.findById(req.user?._id).select("+password");
  const { currentPassword, newPassword } = req.body;
  const passwordIsValid = user?.comparePassword(currentPassword);
  if (!passwordIsValid) throw new AppError("Incorrect current Password", 400);
  user!.password = newPassword;
  await user!.save();

  sendResponse({
    res,
    statusCode: 200,
    message: "Password updated successfully",
    data: user,
  });
};


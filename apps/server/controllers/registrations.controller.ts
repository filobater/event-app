import {
  createRegistrationService,
  cancelRegistrationService,
  payForRegistrationService,
} from "services/registration.service.ts";
import { sendResponse } from "utils/sendResponse.ts";
import type { Request, Response } from "express";
import { Registration } from "models/registration.model.ts";
import { ApiFeatures } from "utils/ApiFeatures.ts";

export const createRegistration = async (req: Request, res: Response) => {
  const { body, user } = req;
  const registration = await createRegistrationService(body, user);
  sendResponse({
    res,
    statusCode: 201,
    message: "Registered for the event successfully",
    data: { registration },
  });
};

export const payForRegistration = async (req: Request, res: Response) => {
  const registration = await payForRegistrationService(req.registration);
  sendResponse({
    res,
    statusCode: 200,
    message: "Payment successful",
    data: { registration },
  });
};

export const cancelRegistration = async (req: Request, res: Response) => {
  const registration = await cancelRegistrationService(req.registration);
  sendResponse({
    res,
    statusCode: 200,
    message: "Registration cancelled successfully",
    data: { registration },
  });
};

export const getUserRegistrations = async (req: Request, res: Response) => {
  const { targetUser, user } = req;

  const registrationQuery = Registration.find({
    user: targetUser?._id || user?._id,
    $or: [{ status: "reserved" }, { status: "confirmed" }],
  });

  const totalFeatures = new ApiFeatures(registrationQuery, req.query).search();

  const totalRegistrations = await Registration.countDocuments(
    totalFeatures.query.getFilter(),
  );

  const features = new ApiFeatures(registrationQuery, req.query)
    .paginate()
    .search();

  const registrations = await features.query;

  sendResponse({
    res,
    statusCode: 200,
    message: "User registrations fetched successfully",
    data: {
      registrations,
      count: registrations.length,
      totalData: totalRegistrations,
      totalPages: Math.ceil(totalRegistrations / 10) || 1,
      page: Number(req.query.page) || 1,
    },
  });
};

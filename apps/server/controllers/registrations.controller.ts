import {
  createRegistrationService,
  cancelRegistrationService,
  payForRegistrationService,
} from "services/registration.service.ts";
import { sendResponse } from "utils/sendResponse.ts";
import type { Request, Response } from "express";
import {
  Registration,
  type RegistrationDocument,
} from "models/registration.model.ts";
import { ApiFeatures } from "utils/ApiFeatures.ts";

const registrationsResponse = (
  res: Response,
  registrations: RegistrationDocument[],
  total: number,
  page: number,
) => {
  return sendResponse({
    res,
    statusCode: 200,
    message: "User registrations fetched successfully",
    data: {
      registrations,
      count: registrations.length,
      totalData: total,
      totalPages: Math.ceil(total / 10) || 1,
      page: page,
    },
  });
};

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

  if (req.query.search) {
    const { registrations, total } = await (
      Registration as any
    ).searchByEventTitle(
      targetUser?._id || user?._id,
      req.query.search,
      Number(req.query.page) || 1,
    );
    registrationsResponse(
      res,
      registrations,
      total,
      Number(req.query.page) || 1,
    );
  }

  const registrationQuery = Registration.find({
    user: targetUser?._id || user?._id,
    $or: [{ status: "reserved" }, { status: "confirmed" }],
  });

  const totalFeatures = new ApiFeatures(registrationQuery, req.query);

  const totalRegistrations = await Registration.countDocuments(
    totalFeatures.query.getFilter(),
  );

  const features = new ApiFeatures(registrationQuery, req.query).paginate();

  const registrations = await features.query;

  return registrationsResponse(
    res,
    registrations,
    totalRegistrations,
    Number(req.query.page) || 1,
  );
};

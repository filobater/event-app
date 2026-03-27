import { Event } from "models/event.model.ts";
import { Registration } from "models/registration.model.ts";
import { User } from "models/user.model.ts";
import { sendResponse } from "utils/sendResponse.ts";
import type { Request, Response } from "express";
import type { PipelineStage } from "mongoose";

export const getDashboardStats = async (req: Request, res: Response) => {
  const pipeline = [
    { $match: { status: "confirmed" } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    { $project: { _id: 0, totalRevenue: 1 } },
  ];
  const [totalEvents, totalUsers, totalRegistrations, totalRevenue] =
    await Promise.all([
      Event.countDocuments(),
      User.countDocuments(),
      Registration.countDocuments(),
      Registration.aggregate(pipeline),
    ]);

  sendResponse({
    res,
    statusCode: 200,
    message: "Dashboard stats fetched successfully",
    data: {
      totalEvents,
      totalUsers,
      totalRegistrations,
      totalRevenue: totalRevenue[0]?.totalRevenue ?? 0,
    },
  });
};

// top event by reg. find the status confirmed or reserved then sort the result based on the totalAmount limit the result to 5
export const getTopEventsByRegistration = async (
  req: Request,
  res: Response,
) => {
  const pipeline = [
    { $match: { $or: [{ status: "confirmed" }, { status: "reserved" }] } },
    {
      $group: {
        _id: "$event",
        totalAmount: { $sum: "$totalAmount" },
        seatsCount: { $sum: "$seatsCount" },
      },
    },
    { $sort: { totalAmount: -1, seatsCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "events",
        localField: "_id",
        foreignField: "_id",
        as: "event",
      },
    },
    { $unwind: "$event" },
    {
      $project: {
        _id: 1,
        totalAmount: 1,
        seatsCount: 1,
        "event.title": 1,
        "event.registeredSeats": 1,
        "event.totalSeats": 1,
      },
    },
  ];
  const topEvents = await Registration.aggregate(pipeline as PipelineStage[]);

  sendResponse({
    res,
    statusCode: 200,
    message: "Top events by registration fetched successfully",
    data: {
      events: topEvents,
    },
  });
};

export const eventsByCategory = async (req: Request, res: Response) => {
  const pipeline = [
    { $unwind: "$category" },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ];
  const events = await Event.aggregate(pipeline as PipelineStage[]);
  sendResponse({
    res,
    statusCode: 200,
    message: "Events by category fetched successfully",
    data: {
      events,
    },
  });
};

export const getTopEventsByRevenue = async (req: Request, res: Response) => {
  const pipeline: PipelineStage[] = [
    { $match: { status: "confirmed", totalAmount: { $gt: 0 } } },
    {
      $group: {
        _id: "$event",
        totalRevenue: { $sum: "$totalAmount" },
        totalSeats: { $sum: "$seatsCount" },
      },
    },
    { $sort: { totalRevenue: -1, totalSeats: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "events",
        localField: "_id",
        foreignField: "_id",
        as: "event",
      },
    },
    { $unwind: "$event" },
    {
      $project: {
        _id: 1,
        totalRevenue: 1,
        totalSeats: 1,
        "event.title": 1,
        "event.location": 1,
        "event.dateTime": 1,
        "event.status": 1,
        "event.photo": 1,
      },
    },
  ];

  const topEvents = await Registration.aggregate(pipeline);

  sendResponse({
    res,
    statusCode: 200,
    message: "Top events by revenue fetched successfully",
    data: {
      events: topEvents,
    },
  });
};

export const eventsStatus = async (req: Request, res: Response) => {
  const pipeline = [
    { $unwind: "$status" },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ];
  const events = await Event.aggregate(pipeline as PipelineStage[]);
  sendResponse({
    res,
    statusCode: 200,
    message: "Events status fetched successfully",
    data: {
      events,
    },
  });
};

import type { Request, Response } from "express";
import { Event, type EventDocument } from "models/event.model.ts";
import { ApiFeatures } from "utils/ApiFeatures.ts";
import { sendResponse } from "utils/sendResponse.ts";
import { AppError } from "utils/AppError.ts";
import { Registration } from "models/registration.model.ts";
import { replaceFile } from "utils/replaceFile.ts";
import type { SpeakerDto } from "@events-app/shared-dtos";

const getEventWithRegistration = async (event: EventDocument, req: Request) => {
  const registration = await Registration.findOne({
    event: event._id,
    user: req.user?._id,
    $or: [{ status: "reserved" }, { status: "confirmed" }],
  });
  return {
    registration: {
      _id: registration?._id.toString(),
      seatsCount: registration?.seatsCount,
      totalAmount: registration?.totalAmount,
    },
    isPaid:
      req.event?.type === "paid"
        ? registration?.status === "confirmed"
          ? true
          : false
        : undefined,
  };
};

// here in all controllers we can directly take the req body and put it because of the validation

export const createEvent = async (req: Request, res: Response) => {
  const newEvent = await Event.create(req.body);
  sendResponse({
    res,
    statusCode: 200,
    message: "Event created Successfully",
    data: {
      event: newEvent,
    },
  });
};

export const getAllEvents = async (req: Request, res: Response) => {
  const eventQuery = Event.find();

  const totalFeatures = new ApiFeatures(eventQuery, req.query).search();

  const totalEvents = await Event.countDocuments(
    totalFeatures.query.getFilter(),
  );

  const features = new ApiFeatures(eventQuery, req.query)
    .search()
    .paginate()
    .filterByCategory()
    .filterByStatus()
    .sort();

  const events = await features.query;

  sendResponse({
    res,
    statusCode: 200,
    message: "Events fetched Successfully",
    data: {
      events,
      count: events.length,
      totalData: totalEvents,
      totalPages: Math.ceil(totalEvents / 10) || 1,
      page: Number(req.query.page) || 1,
    },
  });
};

export const getEvent = async (req: Request, res: Response) => {
  const eventWithRegistration = await getEventWithRegistration(req.event, req);

  sendResponse({
    res,
    statusCode: 200,
    message: "Event fetched Successfully",
    data: {
      event: {
        ...req.event.toObject(),
        ...eventWithRegistration,
      },
    },
  });
};

export const updateEvent = async (req: Request, res: Response) => {
  const eventWithRegistration = await getEventWithRegistration(req.event, req);
  if ("registeredSeats" in req.body && req.body.registeredSeats !== undefined) {
    throw new AppError("Registered seats cannot be updated", 400);
  }
  replaceFile(req.event.photo, req, "photo");
  req.event.speakers.forEach((speaker: SpeakerDto) => {
    replaceFile(speaker.image as string, req, "image");
  });
  const updatedEvent = Object.assign(req.event, req.body);
  await updatedEvent.save();
  sendResponse({
    res,
    statusCode: 200,
    message: "Event updated Successfully",
    data: {
      event: {
        ...updatedEvent.toObject(),
        ...eventWithRegistration,
      },
    },
  });
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { event } = req;
  replaceFile(event.photo);
  event.speakers.forEach((speaker: SpeakerDto) => {
    replaceFile(speaker.image as string);
  });
  await event.deleteOne();

  sendResponse({
    res,
    statusCode: 204,
    message: "Event deleted Successfully",
    data: null,
  });
};

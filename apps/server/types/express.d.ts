import { UserDocument } from "../models/user.model";
import { EventDocument } from "../models/event.model";
import { RegistrationDocument } from "../models/registration.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
      targetUser?: UserDocument;
      event?: EventDocument;
      registration?: RegistrationDocument;
    }
  }
}

export {};

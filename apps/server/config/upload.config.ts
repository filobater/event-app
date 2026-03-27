import type { UploadKind, UploadSpecDto } from "@events-app/shared-dtos";

export type UploadSpec = UploadSpecDto;

export const UPLOAD_SPECS: Record<UploadKind, UploadSpecDto> = {
  eventPhoto: { prefix: "events", width: 1280, height: 720 },
  profilePicture: { prefix: "profilePictures", width: 500, height: 500 },
  speakerImage: { prefix: "speakers", width: 400, height: 400 },
};

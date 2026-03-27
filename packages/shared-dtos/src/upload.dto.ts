import type { BaseResponseDto } from "./base.dto.js";

export type UploadKind = "eventPhoto" | "profilePicture" | "speakerImage";

export type UploadSpecDto = {
  prefix: string;
  width: number;
  height: number;
};


export type UploadQueryDto = {
  type: UploadKind;
};


export type SingleUploadDataDto = {
  url: string;
};


export type MultipleUploadDataDto = {
  urls: string[];
};

export type UploadSingleResponseDto = BaseResponseDto & {
  data: SingleUploadDataDto;
};

export type UploadMultipleResponseDto = BaseResponseDto & {
  data: MultipleUploadDataDto;
};

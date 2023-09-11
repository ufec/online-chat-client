import { type ResultDto } from './result.dto';

export interface UploadFileDto {
  url: string;
  filename: string;
  mimetype: string;
  encoding: string;
  size: number;
}

export type UploadFileResultDto = ResultDto<UploadFileDto>;

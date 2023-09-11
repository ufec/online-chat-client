import { type MessageResult, type BaseDto } from '@/common/interface';

export interface AttachmentResultDto extends BaseDto {
  id: string;
  userId: number;
  fileName: string;
  fileUrl?: string;
  fileSize: number;
  fileType: string;
  filePath?: string;
  messageId: string;
  width?: number;
  height?: number;
  message?: MessageResult;
}

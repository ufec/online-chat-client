import { request } from '@/utils/request';
import { attachment } from './api';

export async function uploadAttachment(formData: FormData) {
  return await request.post<unknown, FormData>({
    url: attachment.uploadAttachmentApi,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

import { request } from '@/utils/request';
import { file } from './api';
import { type UploadFileResultDto } from './dto/file.dto';

export async function uploadAvatar(params: FormData) {
  return await request.post<UploadFileResultDto, FormData>({
    url: file.uploadAvatarApi,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

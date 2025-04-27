import { getCookie } from '@/utils';
import axios from 'axios';

function interceptor(config: any) {
  const accessToken = getCookie('accessToken');
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
}

export const $drive = axios.create({
  baseURL: 'https://www.googleapis.com/drive/v3/files',
  timeout: 4000,
});

export const $upload = axios.create({
  baseURL: 'https://www.googleapis.com/upload/drive/v3/files',
  timeout: 4000,
});

$drive.interceptors.request.use(interceptor);
$upload.interceptors.request.use(interceptor);

import { getCookie } from '@/utils';
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

function getAxiosInstance(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: 6000
  });

  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = getCookie('access_token');
    if (accessToken)
      config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

  instance.interceptors.response.use((response: AxiosResponse) => {
    return response;    
  }, (error: AxiosError) => {
    return Promise.reject(error);
  });

  return instance;
}

export const $drive = getAxiosInstance('https://www.googleapis.com/drive/v3/files');
export const $upload = getAxiosInstance('https://www.googleapis.com/upload/drive/v3/files');

import { API_KEY, API_SCRIPT_URL } from '@/constants';
import { $drive, $upload } from '@/services';
import { MimeType } from '@/types';
import axios, { AxiosError, AxiosResponse } from 'axios';

export function useArchive() {
  async function fetchFile(id: string) {
    try {
      const response = await $drive.get('/', {
        params: {
          q: `"${id}"+in+parents and trashed = false`,
          fields: 'files(id, name, kind, shared, mimeType, createdTime, modifiedTime)',
          key: API_KEY,
        },
        paramsSerializer: (params) =>
          new URLSearchParams(params).toString().replaceAll('%2B', '+'),
      });
      return response.data.files;
    } catch (e) {
      console.error(e);
      const response = await tryOnScript({
        dirId: id,
        command: 'list',
      });
      return response;
    }
  }

  async function fetchContents(id: string) {
    try {
      const response = await $drive.get(`/${id}`, {
        params: {
          alt: 'media',
          key: API_KEY,
        },
      });
      return response.data;
    } catch (e) {
      console.error(e);
      const response = await tryOnScript({
        fileId: id,
        command: 'select',
        mimeType: 'text/x-markdown',
      });
      return response;
    }
  }

  async function tryOnScript(params: any) {
    try {
      const response: AxiosResponse = await axios({
        url: API_SCRIPT_URL,
        params,
      });
      return response;
    } catch (e) {
      console.error(e);
    }
  }

  async function createFile(mimeType: MimeType, parents: string[], fileName: string) {
    const isFile = mimeType === 'text/markdown';
    const fileMetadata = {
      name: fileName + (isFile ? '.md' : ''),
      parents,
      mimeType,
    };

    try {
      const response = await $drive.post('', fileMetadata);
      return response;
    } catch (e) {
      console.error(e);
    }
  }

  async function updateFile(id: string, data: any) {
    try {
      const response = await $drive.patch(`/${id}`, data);
      return response;
    } catch (e) {
      console.error(e);
    }
  }

  async function updateContents(id: string, data: string) {
    try {
      const response = await $upload.patch(`/${id}`, data);
      return response;
    } catch (e) {
      console.error(e);

      let status = 404;
      if (axios.isAxiosError(e)) {
        status = e.status ?? 404;
      }

      return new AxiosError(`Error [${status}]`);
    }
  }

  async function trashFiles(ids: string[]) {
    for (const id of ids) {
      try {
        const response = await $drive.patch(`/${id}`, { trashed: true });
      } catch (e) {
        console.error(e);
      }
    }
  }

  return {
    createFile,
    fetchFile,
    fetchContents,
    trashFiles,
    updateContents,
    updateFile,
  };
}

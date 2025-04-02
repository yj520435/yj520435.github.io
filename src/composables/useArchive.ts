import { API_KEY, API_SCRIPT_URL, API_URL } from '@/constants';
import { Account, MimeType } from '@/types';
import axios from 'axios';
import { computed, ref, Ref } from 'vue';

export function useArchive() {
  const account: Ref<Account> = ref(<Account>{});

  const axiosHeader = computed(() => {
    const accessToken = account.value.accessToken;
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  });

  function init(params: Account) {
    account.value = params;
  }

  async function trashFiles(ids: string[]) {
    for (const id of ids) {
      try {
        const response = await axios({
          url: API_URL.concat('/', id),
          method: 'PATCH',

          data: {
            trashed: true,
          },
          headers: axiosHeader.value,
        });
        console.log(response);
      } catch (e) {
        console.error(e);
      }
    }
  }

  async function createFile(mimeType: MimeType, name: string, parents: string[]) {
    const isFolder = mimeType === 'application/vnd.google-apps.folder';

    const fileMetadata = {
      name,
      parents,
      mimeType,
    };

    try {
      const response = await axios({
        url: API_URL,
        method: 'POST',
        data: fileMetadata,
        headers: axiosHeader.value,
      });
      return response;
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchFiles(id: string) {
    try {
      const response = await axios({
        url: API_URL,
        params: {
          q: `"${id}"+in+parents`,
          key: API_KEY,
        },
        paramsSerializer: (params) =>
          new URLSearchParams(params).toString().replaceAll('%2B', '+'),
        timeout: 2000,
      });
      return response.data.files;
    } catch (error) {
      const response = await onScript({
        dirId: id,
        command: 'list',
      });
      return response;
    }
  }

  async function fetchContents(id: string) {
    try {
      const response = await axios({
        url: API_URL.concat('/', id),
        params: {
          key: API_KEY,
          alt: 'media',
        },
        timeout: 2000,
      });
      return response.data;
    } catch (error) {
      const response = await onScript({
        fileId: id,
        command: 'select',
        mimeType: 'text/x-markdown',
      });
    }
  }

  async function onScript(params: any) {
    try {
      const response = await axios({
        url: API_SCRIPT_URL,
        params,
      });
      return response;
    } catch (e) {
      console.error(e);
    }
  }

  return {
    init,
    createFile,
    fetchFiles,
    fetchContents,
    trashFiles,
  };
}

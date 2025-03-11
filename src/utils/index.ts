import { API_KEY, API_URL, FOLDER_MIME_TYPE } from '@/constants';
import { File, MimeType, Project } from '@/types';
import axios from 'axios';
import dayjs from 'dayjs';

export function getIcon(mimeType: MimeType): string {
  switch (mimeType) {
    case 'text/x-markdown':
      return 'file';
    case 'application/vnd.google-apps.folder':
      return 'folder';
    default:
      return 'unknown';
  }
}

export function filterAndSort(data: File[]): File[] {
  // Filter
  const filteredDirectories = data.filter((v: File) => v.mimeType === FOLDER_MIME_TYPE);
  const filteredFiles = data
    .filter((v: File) => v.mimeType !== FOLDER_MIME_TYPE)
    .map((v: File) => {
      const name = removeExtension(v.name);
      const copied: any = { ...v };
      delete copied.name;
      return { ...copied, name };
    });

  // Sort
  const sortedDirectories = [...filteredDirectories].sort((a: File, b: File) =>
    sortAlphabetically(a.name, b.name)
  );

  const sortedFiles = [...filteredFiles].sort((a: File, b: File) =>
    sortAlphabetically(a.name, b.name)
  );

  return sortedDirectories.concat(sortedFiles);
}

function removeExtension(name: string): string {
  if (name !== '') {
    const extIndex = name.lastIndexOf('.');
    return extIndex !== -1 ? name.substring(0, extIndex) : name;
  }
  return 'untitled';
}

function sortAlphabetically(pa: string, pb: string) {
  const a = pa.toLowerCase();
  const b = pb.toLowerCase();

  if (a > b) return 1;
  else if (a < b) return -1;
  else return 0;
}

async function fetchWithTimeout(url: string, options: any = {}) {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(url, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);

  return response;
}

export async function loadFolder(id: string) {
  const url = `https://www.googleapis.com/drive/v3/files?q="${id}"+in+parents&key=${API_KEY}`;
  const retry = async (id: string) => {
    try {
      const response = await axios({
        url: API_URL,
        method: 'get',
        params: {
          dirId: id,
          command: 'list',
        },
      });
      return response.data?.result;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  try {
    const response = await fetchWithTimeout(url, { timeout: 2000 });
    if (response.ok) {
      const data = (await response.json()).files;
      return data;
    } else {
      const data = await retry(id);
      return data;
    }
  } catch (e) {
    console.error(e);
    const data = await retry(id);
    return data;
  }
}

export async function loadFile(id: string, type?: string) {
  const url = `https://www.googleapis.com/drive/v3/files/${id}?key=${API_KEY}&alt=media`;
  const retry = async (id: string) => {
    try {
      const response = await axios({
        url: API_URL,
        method: 'get',
        params: {
          fileId: id,
          command: 'select',
          mimeType: 'text/x-markdown',
        },
      });
      return response.data;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  try {
    const response = await fetchWithTimeout(url, {
      timeout: 2000,
    });
    if (response.ok) {
      const data = type === 'json' ? response.json() : response.text();
      return data;
    } else {
      const data = await retry(id);
      return data;
    }
  } catch (e) {
    console.error(e);
    const data = await retry(id);
    return data;
  }
}

export function addMouseEvent(elements: HTMLElement[]) {
  for (const el of elements) {
    let trigger = false;
    const fix = { x: 0, left: 0 };

    el.onmousedown = (event: MouseEvent) => {
      fix.x = event.clientX;
      fix.left = el.scrollLeft;
      trigger = true;
      el.style.cursor = 'grabbing';
    };

    el.onmousemove = (event: MouseEvent) => {
      if (trigger) {
        const dx = event.clientX - fix.x;
        el.scrollLeft = fix.left - dx;
      }
    };

    el.onmouseup = () => {
      fix.left = el.scrollLeft;
      trigger = false;
      el.style.cursor = 'grab';
    };
  }
}

export function login() {
  window.google.accounts.id.initialize({
    client_id: '827293727138-rpq0n9svbmdlu0hup4h4qiagvs8hujio.apps.googleusercontent.com',
    callback: handleCredentialResponse,
    ux_mode: 'popup',
  });
  window.google.accounts.id.prompt();
}

function handleCredentialResponse(response: any) {
  const user = JSON.parse(atob(response.credential.split('.')[1]));
  console.log('>> User', user);

  const client = window.google.accounts.oauth2.initTokenClient({
    client_id: '827293727138-rpq0n9svbmdlu0hup4h4qiagvs8hujio.apps.googleusercontent.com',
    scope: 'https://www.googleapis.com/auth/drive',
    callback: (data) => {
      const expire = dayjs().add(1, 'hour').toDate();

      // const now = new Date();
      // const time = now.getTime();
      // now.setTime(time + 1000 * 3600);
      // const expire = dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss');

      // const auth = useAuthStore();
      // auth.init(expire);

      if ('access_token' in data)
        document.cookie = `token=${data.access_token};expires=${expire.toUTCString()}`;
    },
  });

  client.requestAccessToken();
}

export function preloadImage(projects: Project[]) {
  const div = document.querySelector('#secret');

  for (const project of projects) {
    const image = new Image();
    image.src = require(`@/assets/images/${project.id}.gif`);
    div?.append(image);
  }
}

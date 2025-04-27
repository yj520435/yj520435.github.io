import { Project } from '@/types';
import dayjs from 'dayjs';

export function sortAlphabetically(pa: string, pb: string) {
  const a = pa.toLowerCase();
  const b = pb.toLowerCase();

  if (a > b) return 1;
  else if (a < b) return -1;
  else return 0;
}

export function preloadImage(projects: Project[]) {
  const load = (path: string) => {
    const image = new Image();
    image.src = require(`@/assets/${path}`);
  };

  for (const project of projects) {
    load(`images/${project.id}.gif`);
  }
}

export function getCookie(key: string) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${key}=`))
    ?.split('=')[1];
}

export function transferSnakeToCamel(str: string) {
  return str.replace(/(_\w)/g, (k) => k[1].toUpperCase());
}

export function getFormattedDate(date: any) {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}

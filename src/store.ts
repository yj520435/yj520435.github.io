import { defineStore } from 'pinia';
import { computed, Ref, ref, watch } from 'vue';
import dayjs from 'dayjs';
import { User } from './types';

export const useAuthStore = defineStore('auth', () => {
  const expired: Ref<string | undefined> = ref();

  function init(exp?: string) {
    expired.value = exp;
  }

  function save(data: { token: string; expired: Date; user: User }) {
    const stringifiedExp = dayjs(data.expired).format('YYYY-MM-DD HH:mm:ss');
    init(stringifiedExp);

    const cookies: any = {
      TOKEN: data.token,
      EXP: stringifiedExp,
      NAME: data.user.name,
      EMAIL: data.user.email,
    };

    for (const key of Object.keys(cookies)) {
      document.cookie = `${key}=${cookies[key]};expires=${data.expired.toUTCString()}`;
    }
  }

  function revoke() {
    init();
    ['TOKEN', 'EXP', 'NAME', 'EMAIL'].forEach((v) => {
      document.cookie = `${v}=; Path=/; Expires=${new Date(1970).toISOString()}`;
    });
  }

  return { expired, init, save, revoke };
});

export const useItemStore = defineStore('item', () => {
  const folders: Ref<{ id: string; items: any }[]> = ref([]);

  function get(id: string) {
    return folders.value.find((v) => v.id === id);
  }

  function set(id: string, items: any) {
    folders.value.push({ id, items });
  }

  return { folders, get, set };
});

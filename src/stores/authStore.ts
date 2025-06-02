import { Account } from '@/types';
import { getCookie, getFormattedDate, transferSnakeToCamel } from '@/utils';
import { defineStore } from 'pinia';
import { computed, onMounted, Ref, ref } from 'vue';
import { COOKIE_KEYS as cookieKeys } from '@/constants';

export const useAuthStore = defineStore('auth', () => {
  const account: Ref<Account | undefined> = ref();
  const isAuthenticated = computed(() => account.value !== undefined);

  onMounted(() => {
    const cookie: any = {};
    cookieKeys.forEach((key) => (cookie[key] = getCookie(key)));

    if (Object.values(cookie).every((v) => !!v)) {
      const object: any = {};
      cookieKeys.forEach((key) => (object[transferSnakeToCamel(key)] = cookie[key]));
      account.value = object as Account;
    }
  });

  function create(params: Account) {
    if (!params.expiryDate) return;

    account.value = params;

    const cookie: any = { ...params };
    cookie.expiryDate = getFormattedDate(params.expiryDate);

    for (const key of cookieKeys) {
      document.cookie = `${key}=${
        cookie[transferSnakeToCamel(key)]
      };expires=${params.expiryDate.toUTCString()}`;
    }
  }

  function update(cookie: any) {
    // const object: any = {};
    // cookieKeys.forEach((key) => (object[transferSnakeToCamel(key)] = cookie[key]));
    // account.value = object as Account;
  }

  function $reset() {
    account.value = undefined;

    cookieKeys.forEach((key) => {
      document.cookie = `${key}=; Path=/; Expires=${new Date(1970).toUTCString()}`;
    });
  }

  return {
    account,
    create,
    update,
    $reset,
    isAuthenticated,
  };
});

import { Account } from '@/types';
import { getCookie, transferSnakeToCamel } from '@/utils';
import axios from 'axios';
import dayjs from 'dayjs';
import { defineStore } from 'pinia';
import { computed, onMounted, Ref, ref } from 'vue';
import { COOKIE_KEYS as cookieKeys } from '@/constants';

export const useAuthStore = defineStore('auth', () => {
  const account: Ref<Account> = ref(<Account>{});

  // const isAuthenticated = computed(() =>
  //   Object.values(account.value).every((v) => v !== undefined)
  // );

  function create(params: Account) {
    if (!params.expiryDate) return;

    account.value = params;

    const cookie: any = { ...params };
    cookie.expiryDate = dayjs(params.expiryDate).format('YYYY-MM-DD HH:mm:ss');

    cookieKeys.forEach((key) => {
      document.cookie = `${key}=${
        cookie[transferSnakeToCamel(key)]
      };expires=${params.expiryDate.toUTCString()}`;
    });
  }

  function update(cookie: any) {
    const object: any = {};
    cookieKeys.forEach((key) => (object[transferSnakeToCamel(key)] = cookie[key]));
    account.value = object as Account;
  }

  function revoke() {
    account.value = <Account>{};
    cookieKeys.forEach((key) => {
      document.cookie = `${key}=; Path=/; Expires=${new Date(1970).toUTCString()}`;
    });
  }

  return {
    account,
    create,
    update,
    revoke,
  };
});

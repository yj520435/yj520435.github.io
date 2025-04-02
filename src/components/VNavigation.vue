<script setup lang="ts">
import { CLIENT_ID, COOKIE_KEYS as cookieKeys } from '@/constants';
import { useAuthStore } from '@/stores/authStore';
import { useZoomStore } from '@/stores/zoomStore';
import { Account } from '@/types';
import { getCookie } from '@/utils';
import axios from 'axios';
import dayjs from 'dayjs';
import { computed, onMounted, Ref, ref, watch } from 'vue';

const zoomStore = useZoomStore();

const authStore = useAuthStore();
const account = computed(() => authStore.account);
const isAuthenticated: Ref<boolean> = ref(false);

let client: any = null;

function initTokenClient() {
  client = (window as any).google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/drive',
    callback: handleTokenResponse,
  });
}

function requestAccessToken() {
  client.requestAccessToken();
}

function handleTokenResponse(response: any) {
  const { access_token, expires_in, token_type } = response;

  axios({
    url: 'https://www.googleapis.com/drive/v3/about?fields=user',
    headers: {
      Authorization: `${token_type} ${access_token}`,
    },
  })
    .then((axiosResponse) => {
      const { displayName: userName, emailAddress: userEmail } = axiosResponse.data.user;
      const account: Account = {
        accessToken: access_token,
        expiryDate: dayjs().add(expires_in, 'second').toDate(),
        userName,
        userEmail
      };

      authStore.create(account);
    })
    .catch((axiosError) => {
      console.error(axiosError);
    });
}

function revokeAccessToken() {
  const accessToken = account.value.accessToken;

  if (!accessToken)
    return;
  
  (window as any).google.accounts.oauth2.revoke(accessToken, authStore.revoke);
}

function checkCookie() {
  const cookie: any = {}
  cookieKeys.forEach((key) => cookie[key] = getCookie(key));

  if (Object.keys(cookie).length === cookieKeys.length)
    authStore.update(cookie);
}

// Time Ticker
const expiresIn = ref(0);
let timeTicker: any = null;

function startTimeTicker() {
  if (!account.value.expiryDate)
    return

  const handler = () => {
    expiresIn.value = dayjs(account.value.expiryDate).diff(Date.now(), 'minute');
  }

  handler();
  timeTicker = setInterval(handler, 1000 * 60);
}

function stopTimeTicker() {
  clearInterval(timeTicker);
  timeTicker = null;
}

watch(account, (v) => {
  isAuthenticated.value = Object.values(v).every((x) => x !== undefined);
  isAuthenticated.value ? startTimeTicker() : stopTimeTicker();
}, {
  deep: true
});

onMounted(() => {
  initTokenClient();
  checkCookie();
});
</script>

<template>
  <nav>
    <section>
      <button
        class="admin"
        :class="isAuthenticated ? 'log-out' : 'log-in'"
        :style="zoomStore.style"
        @click="isAuthenticated ? revokeAccessToken() : requestAccessToken()"
      />
      <button
        class="zoom"
        :class="zoomStore.isActive ? 'minimize' : 'maximize'"
        :style="zoomStore.style"
        @click="zoomStore.toggle"
      />
      <div v-if="isAuthenticated" class="bubble">
        <span>{{ authStore.account.userName }}</span>
        <span><strong>{{ expiresIn }}</strong> 분 후 인증 만료</span>
      </div>
    </section>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  position: relative;
  z-index: 3;

  section {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: right;
    width: 100%;
    gap: 10px;

    button {
      border: none;
      padding: 0;
      margin-right: 10px;
      display: inline-flex;
      align-items: center;
      gap: 6px;

      &.admin.log-in {
        @include icon(log-in);
      }

      &.admin.log-out {
        @include icon(log-out);
      }

      &.zoom.maximize {
        @include icon(maximize);
      }

      &.zoom.minimize {
        @include icon(minimize);
      }
    }
  }
}

@media (width < 650px) {
  .zoom {
    display: none !important;
  }
}
</style>
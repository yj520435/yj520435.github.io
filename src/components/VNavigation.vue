<script setup lang="ts">
import { CLIENT_ID } from '@/constants';
import { useAuthStore } from '@/stores/authStore';
import { Account } from '@/types';
import axios from 'axios';
import dayjs from 'dayjs';
import { onMounted, ref, watch } from 'vue';
import VItem from './base/VItem.vue';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();

const {
  account,
  isAuthenticated
} = storeToRefs(authStore);

const {
  create
} = authStore;


let client: any = null;

let timer: any = null;
const timestamp = ref('59:59');

function startTimer(expiresIn: Date) {
  if (timer) {
    stopTimer();
    timer = null;
  }

  const timerHandler = () => {
    const leftTimeSeconds = dayjs(expiresIn).diff(Date.now(), 'second');
    
    const min = leftTimeSeconds / 60;
    const sec = leftTimeSeconds % 60; 

    timestamp.value = `${Math.floor(min)}:${sec < 10 ? '0' + sec : sec }`;
    if (leftTimeSeconds === 60 * 5)
      requestAccessToken();

    if (leftTimeSeconds < 0) {
      stopTimer();
      timer = null;
      revokeAccessToken();
    }
  }
  
  timerHandler();
  timer = setInterval(timerHandler, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

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
      const {
        displayName: userName,
        emailAddress: userEmail,
        photoLink: userPhoto
      } = axiosResponse.data.user;

      const account: Account = {
        accessToken: access_token,
        expiryDate: dayjs().add(expires_in, 'second').toDate(),
        userName,
        userEmail,
        userPhoto
      };

      create(account);
    })
    .catch((axiosError) => {
      console.error(axiosError);
    });
}

function revokeAccessToken() {
  if (!authStore.account) return;
  (window as any).google.accounts.oauth2.revoke(authStore.account.accessToken, authStore.$reset);
}

watch(account, (v) => {
  if (v) startTimer(v.expiryDate);
});

onMounted(() => {
  initTokenClient();
});
</script>

<template>
  <nav >
    <section>
      <div v-if="account" class="account">
        <img :src="account.userPhoto" alt="user">
        <span class="user">{{ account.userName }}</span>
        <span class="timestamp">{{ timestamp }}</span>
      </div>
      <VItem
        v-if="isAuthenticated"
        icon="log-out"
        @click="revokeAccessToken"
      />
      <VItem
        v-else
        icon="log-in"
        @click="requestAccessToken"
      />
      <!-- <VItem
        :icon="zoom ? 'minimize' : 'maximize'"
        @click="emits('zoom')"
      /> -->
    </section>
  </nav>
</template>

<style lang="scss" scoped>
nav {
  position: relative;
  z-index: 3;
  float: right;

  section {
    position: absolute;
    display: flex;
    gap: 10px;
    transform-origin: right;
    right: 0;
    height: 20px;

    .account {
      @extend .flex-center;
      width: max-content;
      gap: 10px;
      margin-right: 3px;

      img {
        width: 20px;
        border-radius: 50%;
      }

      span {
        font-size: 12px;
        color: $text-color;
        
        &.user {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-family: 'galmuri11';
          font-weight: bold;
        }

        &.timestamp {
          font-family: 'Ubuntu Mono';
          font-size: 16px;
          display: inline-grid;
          background-color: $text-color;
          color: $base-color;
          font-weight: bold;
          padding: 1px 0;
          border-radius: 5px;
          width: 51px;
          text-align: center;
        }
      }
    }

    :deep(.item) {
      cursor: pointer;
    }
  }
}
</style>
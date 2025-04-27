<script setup lang="ts">
import { CLIENT_ID } from '@/constants';
import { useAuthStore } from '@/stores/authStore';
import { Account } from '@/types';
import { getFormattedDate } from '@/utils';
import axios from 'axios';
import dayjs from 'dayjs';
import { onMounted, ref } from 'vue';
import VItem from './VItem.vue';

const authStore = useAuthStore();
const expiresIn = ref('');

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

      authStore.create(account);
      expiresIn.value = getFormattedDate(account.expiryDate);
    })
    .catch((axiosError) => {
      console.error(axiosError);
    });
}

function revokeAccessToken() {
  if (!authStore.account) return;
  (window as any).google.accounts.oauth2.revoke(authStore.account.accessToken, authStore.$reset);
}

// async function tokeninfo() {
//   const token = authStore.account.accessToken;
//   const response = await axios(`https://oauth2.googleapis.com/tokeninfo?access_token=${token}`);
//   console.log(response);
// }

onMounted(() => {
  initTokenClient();
});
</script>

<template>
  <nav >
    <section>
      <VItem
        v-if="authStore.isAuthenticated"
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
      <div v-if="authStore.isAuthenticated" class="bubble">
        <img :src="authStore.account?.userPhoto" alt="user">
        <span>{{ authStore.account?.userName }}</span>
      </div>
      <!-- <div v-if="authStore.isAuthenticated" class="bubble">
        <span>{{ authStore.account.userName }}</span>
        <span><strong>{{ getFormattedDate(authStore.account.expiryDate) }}</strong></span>
      </div> -->
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

    :deep(.item) {
      cursor: pointer;
    }

    .bubble {
      @extend .flex-center;
      gap: 7px;
      background-color: #00000090;
      width: max-content;
      position: absolute;
      top: 30px;
      padding: 6px 10px;
      right: 0;
      transform-origin: right;
      
      img {
        width: 26px;
        height: 26px;
        border-radius: 50%;
      }
      
      span {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        color: $text-color;
        opacity: 0.6;
        font-family: 'galmuri11';
        font-size: 12px;
        font-weight: bold;
      }
    }
  }
}
</style>
import { getCookie } from '@/utils';
import axios from 'axios';
import dayjs from 'dayjs';
import { onMounted, onUnmounted, ref, Ref, watch } from 'vue';

export function useAuth() {
  let tokenClient: any = null;

  let authIntervalHandler: any = null;

  const expired: Ref<string | undefined> = ref();
  const expiryTimer = ref();

  function initTokenClient() {
    tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
      client_id:
        '827293727138-rpq0n9svbmdlu0hup4h4qiagvs8hujio.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/drive',
      callback: handleTokenResponse,
    });
  }

  function handleTokenResponse(response: any) {
    const { access_token, expires_in } = response;

    const expiresIn = dayjs().add(expires_in, 'second').toDate();

    // Fetch User Info
    axios({
      url: 'https://www.googleapis.com/drive/v3/about?fields=user',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }).then((res) => {
      expired.value = dayjs(expiresIn).format('YYYY-MM-DD HH:mm:ss');

      // Save Cookies
      const { displayName: name, emailAddress: email } = res.data.user;
      const cookie = new Map()
        .set('TOKEN', access_token)
        .set('EXP', expired.value)
        .set('NAME', name)
        .set('EMAIL', email);
      cookie.forEach((v, k) => {
        document.cookie = `${k}=${v}; expires=${expiresIn.toUTCString()}`;
      });
    });
  }

  function requestAccessToken() {
    tokenClient.requestAccessToken();
  }

  function revokeAccessToken() {
    const token = getCookie('TOKEN');
    if (token) {
      (window as any).google.accounts.oauth2.revoke(token, () => {
        expired.value = undefined;

        ['TOKEN', 'EXP', 'NAME', 'EMAIL'].forEach((v) => {
          document.cookie = `${v}=; Path=/; Expires=${new Date(1970).toISOString()}`;
        });
      });
    }
  }

  watch(expired, (v) => {
    if (v) {
      const interval = () => (expiryTimer.value = Math.abs(dayjs().diff(v, 'minute')));
      interval();
      authIntervalHandler = setInterval(interval, 1000 * 60);
    } else {
      clearInterval(authIntervalHandler);
    }
  });

  onMounted(() => {
    initTokenClient();

    const storedExpired = getCookie('EXP');
    if (storedExpired) expired.value = storedExpired;
  });

  onUnmounted(() => {
    clearInterval(authIntervalHandler);
  });

  return {
    expired,
    expiryTimer,
    initTokenClient,
    requestAccessToken,
    revokeAccessToken,
  };
}

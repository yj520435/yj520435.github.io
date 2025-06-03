# 포트폴리오

![portfolio](https://github.com/user-attachments/assets/40cc5479-420f-4003-9afe-2d3e6d73db9e)

## 프로젝트 소개

Vue3 기반으로 구현한 포트폴리오입니다.

- 기술스택: 보유 기술 리스트
- 경력사항: 근무 이력 및 진행 프로젝트 리스트
- 프로젝트: 개인 프로젝트 리스트
- 아카이브: 문서 기록

## 작업 내용

### 구글 드라이브 연동

Google Drive API를 이용해 아카이브 섹션의 파일들을 로드합니다.  
별도의 인증 과정을 거치지 않고 누구나 파일에 접근할 수 있도록 하기 위해 다음 두 가지 방법을 이용합니다.

1. Google Drive API 호출 - Google Cloud Console에서 발급한 API KEY를 파라미터로 전달
2. Google App Script 배포 URL 호출

```js
const response = await $drive.get('/', {
  params: {
    q: `"${id}"+in+parents and trashed = false`,
    fields: 'files(id, name, kind, shared, mimeType, createdTime, modifiedTime)',
    key: API_KEY,
  },
  paramsSerializer: (params) =>
    new URLSearchParams(params).toString().replaceAll('%2B', '+'),
});
return response.data.files;
```

### 구글 로그인

구글 드라이브 내 파일을 원격으로 관리 및 편집하기 위해 [구글 써드파티 라이브러리](https://developers.google.com/identity/oauth2/web/reference/js-reference)를 이용합니다.  
(현재 앱 테스트 상태이므로 승인된 테스트 사용자 이외에는 로그인을 할 수 없습니다.)

```js
function initTokenClient() {
  client = (window as any).google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: 'https://www.googleapis.com/auth/drive',
    callback: handleTokenResponse,
  });
}

function handleTokenResponse(response: any) {
  const { access_token, expires_in, token_type } = response;
  // Get user information and save it to store/cookie
}
```

### Pinia를 이용한 인증 상태 관리

인증 성공 시 Vue 내부 스토어와 쿠키에 액세스 토큰과 사용자 정보를 저장합니다.  
화면 새로고침이 발생하는 경우 쿠키에 저장된 값을 기반으로 스토어를 다시 세팅합니다.

```js
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

  function create(params: Account) { /* save */ }
  function $reset() { /* reset */ }

  return {
    account,
    create,
    $reset,
    isAuthenticated,
  };
}
```

### 파일 컨텐츠 로드 및 편집

**직접 개발한 Markdown Text ↔ HTML DOM 변환 로직**을 사용하고 있습니다.  
다양한 마크다운 문법을 지원하기 위해 지속적으로 업데이트중입니다.

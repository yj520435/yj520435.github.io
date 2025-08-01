import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useDataStore = defineStore('data', () => {
  const isMobile = ref(false);

  function setIsMobile(args: boolean) {
    isMobile.value = args;
  }

  const skills = computed(() => [
    {
      id: 'Front-End',
      name: '프론트엔드',
      items: ['Vue', 'TypeScript']
    },
    {
      id: 'Back-End',
      name: '백엔드',
      items: isMobile.value
        ? ['Java', 'Spring Boot']
        : ['Java', 'Spring Boot', 'PostgreSQL']
    },
    {
      id: 'DBMS',
      name: '데이터베이스',
      items: ['PostgreSQL']
    },
    {
      id: 'SCM',
      name: '버전관리',
      items: ['Git']
    },
    {
      id: 'Co-Work',
      name: '협업도구',
      items: ['Jira', 'Slack', 'Notion']
    }
  ].filter((v) => isMobile.value ? v : v.id !== 'DBMS'));

  const works = computed(() => [
    {
      id: 'copynpaste',
      name: '(주)카피앤패이스트',
      from: '2022. 01',
      to: '2024. 10',
      department: '연구개발팀',
      position: '사원',
      description: 'ICT 기반 비즈니스 서비스 및 솔루션 개발 기업 (KT 협력업체)',
      tasks: isMobile.value ? [
        'IoT 관제 플랫폼 프로젝트 개발 참여',
        'Vue 기반 UI 개발, 상태 관리 (Pinia)',
        'Spring Boot 기반 API 개발',
        '데이터 쿼리 (JPA, MyBatis)',
        '실시간 데이터 처리 (WebSocket)',
        '다국어 처리 (i18n) ・ API 모킹 (msw)',
        '버전 관리 (GitLab)'
      ] : [
        'IoT 관제 플랫폼 프로젝트 개발 참여',
        'Vue 기반 UI 개발, 상태 관리 (Vuex, Pinia)',
        'Spring Boot 기반 API 개발, 데이터 쿼리 (JPA, MyBatis)',
        '웹소켓 ・ 다국어 처리 (i18n) ・ API 모킹 (msw)',
        '버전 관리 (GitLab)'
      ]
    },
    {
      id: 'urpsystem',
      name: '(주)유알피시스템',
      from: '2018. 06',
      to: '2018. 12',
      department: '행정포털팀',
      position: '사원',
      description: '공공분야 IT 인프라 서비스 개발 및 정부업무관리시스템 구축, 운영 기업',
      tasks: isMobile.value ? [
        '공공현수막 게시대 관리 시스템 개발 참여',
        '(JSP, jQuery)',
        '온나라문서시스템 유지보수'
      ] : [
        '공공현수막 게시대 관리 시스템 개발 참여 (JSP, jQuery)',
        '온나라문서시스템 유지보수'
      ]
    }
  ]);

  const projects = computed(() => [
    {
      id: 'portfolio',
      name: 'Portfolio',
      from: '2025. 01',
      to: '2025. 06',
      keywords: ['Vue3', 'TypeScript', 'Pinia'],
      comment: '포트폴리오',
      link: 'https://github.com/yj520435/yj520435.github.io',
      details: isMobile.value ? [
        'Google 3P 인증 ・ 로그인',
        'Drive API 연동, 원격 파일 관리',
        '동적 컴포넌트 임포트 (Render Function)',
        '인증키(액세스 토큰) 저장 및 쿠키 관리',
        '커스텀 에디터 개발 (HTML ↔ Markdown)'
      ] : [
        'Google 3P 인증 및 Drive API 연동, 원격 파일 관리',
        '동적 컴포넌트 임포트 (Vue Render Function)',
        '인증키(액세스 토큰) 저장 및 쿠키 관리',
        '커스텀 에디터 개발 (HTML ↔ Markdown 변환)'
      ]
    },
    {
      id: 'fumblr',
      name: 'Fumblr',
      from: '2021. 08',
      to: '2021. 11',
      keywords: ['JSP', 'Servlet', 'Spring Boot', 'MyBatis'],
      comment: '텀블러(Tumblr)를 모방한 마이크로 블로그',
      link: 'https://github.com/yj520435/fumblr',
      details: isMobile.value ? [
        '계정 정보에 따른 화면 렌더링',
        '포스트 작성 기능 (Oracle DBMS)',
        '비밀번호 초기화 메일 전송 (javax.mail)',
        '웹 크롤링 (jsoup)',
        'AWS EC2 인스턴스를 이용한 배포'
      ] : [
        '간단한 계정 생성 및 포스트 작성 기능 (Oracle DBMS)',
        '비밀번호 초기화를 위한 메일 전송 (javax.mail)',
        '웹 크롤링 (jsoup)',
        'AWS EC2 인스턴스를 이용한 배포'
      ]
    },
    {
      id: 'qloud',
      name: 'Qloud',
      from: '2017. 01',
      to: '2017. 05',
      keywords: ['C#', 'Unity'],
      comment: '모바일 2D 함정 피하기 게임 (졸업작품)',
      link: 'https://github.com/yj520435/qloud',
      details: isMobile.value ? [
        '플레이어 이동 및 함정 로직 작성',
        'Assets 관리 ・ 사운드 설정, 제어 전반',
        '픽셀 그래픽 제작',
        '캐릭터 애니메이션 구현',
        '게임 테스트 ・ 기타 산출물 관리'
      ] : [
        '플레이어 이동 및 함정 로직 작성',
        'Assets 관리 ・ 사운드 설정, 제어 전반',
        '픽셀 그래픽 제작 전반 및 캐릭터 애니메이션 구현',
        '게임 테스트 ・ 기타 산출물 관리'
      ]
    }
  ]);

  return {
    isMobile,
    setIsMobile,
    skills,
    works,
    projects
  }
});
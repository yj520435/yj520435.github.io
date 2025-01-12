(function(){var e={1732:function(e,t,n){"use strict";var i=n(5130),s=n(5234),o=n(6768),a=n(4232),r=n(144);n(4114),n(8992),n(4520),n(2577);const l=(0,s.nY)("store",(()=>{const e=(0,r.KR)([]);function t(t,n){e.value.push({id:t,items:n})}function n(t){return e.value.find((e=>e.id===t))}const i=(0,r.KR)([]);function s(e,t){i.value.push({id:e,contents:t})}function o(e){return i.value.find((t=>t.id===e))}return{setFolder:t,getFolder:n,setFile:s,getFile:o}})),c="AIzaSyBgjHhLJ-4KpONdeY4zzxSbb5jZ2KDcQvA",u="https://script.google.com/macros/s/AKfycby6xDrEwxLM-YNMty9wa75GecwuigoKrZPEXSXILqNAbi57u8aJatp2yXrolvtl5XIoyg/exec",v="application/vnd.google-apps.folder",g="19krnKls4kkkLN2_phD_7bLieU91LzULy",d="101ySHAx1_ay6MZQy-69klLcz8l_vf_X2";var p=n(4373);function f(e){switch(e){case"text/x-markdown":return"file";case"application/vnd.google-apps.folder":return"folder";default:return"unknown"}}function m(e,t){const n=e.toLowerCase(),i=t.toLowerCase();return n>i?1:n<i?-1:0}async function k(e,t={}){const{timeout:n=8e3}=t,i=new AbortController,s=setTimeout((()=>i.abort()),n),o=await fetch(e,{...t,signal:i.signal});return clearTimeout(s),o}async function y(e){const t=`https://www.googleapis.com/drive/v3/files?q="${e}"+in+parents&key=${c}`;try{const n=await k(t,{timeout:2e3});if(n.ok){const e=(await n.json()).files;return e}{const t=await w(e);return t}}catch(n){console.error(n);const t=await w(e);return t}}async function h(e,t){const n=`https://www.googleapis.com/drive/v3/files/${e}?key=${c}&alt=media`;try{const i=await k(n,{timeout:2e3});if(i.ok){const e="json"===t?i.json():i.text();return e}{const t=await L(e);return t}}catch(i){console.error(i);const t=await L(e);return t}}async function w(e){try{const t=await(0,p.A)({url:u,method:"get",params:{dirId:e,command:"list"}});return t.data?.result}catch(t){return console.error(t),[]}}async function L(e){try{const t=await(0,p.A)({url:u,method:"get",params:{fileId:e,command:"select",mimeType:"text/x-markdown"}});return t.data}catch(t){return console.error(t),[]}}const b={id:"index",class:"component"},C={class:"lt"},x=["disabled","onClick"],E=["src","alt"],K={class:"rt"},_=["src"],X=["src"],F={key:0},R=["src"],I=["onClick"],O={class:"info"},T=["src"],j={class:"skills"},M={class:"career"},S={key:0,class:"loading"},A=["src"],W={key:1},z={class:"parent"},N={class:"name"},$=["src"],D={class:"days"},P=["onClick"],Q={key:0,class:"loading"},U=["src"],q=["onClick"],B=["src"],H={key:0,class:"empty"},J={class:"etc"},V=["onClick"];var G=(0,o.pM)({__name:"IndexPage",emits:["load"],setup(e,{emit:t}){const i=t,s=l(),c=(0,r.KR)();function u(e,t){k.value=e;const n=c.value.offsetHeight;c.value.scrollTo(0,n*t)}const p=[{id:"user",name:"프로필"},{id:"skills",name:"기술스택"},{id:"career",name:"경력사항"},{id:"archive",name:"아카이브"},{id:"gitflow",name:"기타 개발 이력"}],k=(0,r.KR)(p[0]),w=(0,o.EW)((()=>"archive"===k.value.id)),L=[{id:"tag",name:"김유진 (1994. 05)"},{id:"phone",name:"010-8695-4830"},{id:"mail",name:"yj520435@gmail.com"}],G=[{id:"FrontEnd",name:"프론트엔드",items:["Vue","Nuxt","JavaScript","TypeScript","Quasar","Vuetify"]},{id:"BackEnd",name:"백엔드",items:["Java","Spring","JPA","MyBatis","PostgreSQL","Gradle","Linux"]},{id:"Version",name:"버전관리",items:["Git","GitHub","GitLab"]},{id:"CoworkTool",name:"협업도구",items:["Jira","Slack","Notion"]}],Y=(0,r.KR)([]),Z=(0,r.KR)(!0);async function ee(e){Z.value=!0,Y.value=await h(e,"json"),Z.value=!1}const te=(0,r.KR)(),ne=(0,r.KR)(0),ie=(0,r.KR)([{id:"up",icon:"arrow-up.svg",action:()=>oe.value.pop()},{id:"reload",icon:"refresh.svg",action:()=>ve()},{id:"home",icon:"home.svg",action:()=>oe.value=[]},{id:"view",icon:"list.svg"}]);function se(){const e=te.value.offsetWidth,t=Math.trunc(e/110);ne.value=e%110/(t-1)}const oe=(0,r.KR)([]),ae=(0,o.EW)((()=>oe.value.length));(0,o.wB)(ae,(async()=>{await ve()}));const re=(0,r.KR)([]),le=(0,r.KR)(!0);async function ce(e){re.value=[],le.value=!0;const t=s.getFolder(e);if(t)re.value=t.items;else{const t=await y(e);console.log(">> result",t),t.length>0&&(re.value=ue(t)),s.setFolder(e,re.value)}le.value=!1,se()}function ue(e){const t=e.filter((e=>e.mimeType===v)),n=e.filter((e=>e.mimeType!==v)),i=t.sort(((e,t)=>m(e.name,t.name)));re.value=i;const s=n.sort(((e,t)=>m(e.name,t.name)));return i.concat(s)}async function ve(){const e=oe.value.length>0?oe.value[oe.value.length-1].id:d;await ce(e)}async function ge(e){e.mimeType===v?(oe.value.push(e),await ce(e.id)):i("load",e)}const de=[{id:"10nvMm_VzaMxF21htCetwhdso3mOSYWFP",name:"Vue3 개인 포트폴리오 구현"},{id:"-RealTimeDataStreamDemo",name:"플링크, 카프카를 이용한 실시간 데이터 스트림 처리 (데모)"},{id:"-MicroBlog",name:"AWS EC2 인스턴스 기반 스프링 부트 프로젝트 배포 및 구동"},{id:"-Qloud",name:"Unity 2D 게임 제작 및 플레이스토어 배포"}];return(0,o.sV)((async()=>{await ee(g),await ce(d)})),(e,t)=>((0,o.uX)(),(0,o.CE)("main",b,[(0,o.Lk)("nav",null,[(0,o.Lk)("div",C,[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(ie.value,(e=>((0,o.uX)(),(0,o.CE)("button",{key:e.id,disabled:!w.value,onClick:e.action},[(0,o.Lk)("img",{src:n(5853)(`./${e.icon}`),alt:e.icon},null,8,E)],8,x)))),128))]),(0,o.Lk)("div",K,[(0,o.Lk)("img",{src:n(6669)(`./${k.value.id}.svg`),alt:"icon"},null,8,_),(0,o.Lk)("img",{src:n(3173),alt:""},null,8,X),w.value?((0,o.uX)(),(0,o.CE)("div",F,[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(oe.value,(e=>((0,o.uX)(),(0,o.CE)("span",{key:e.id},[(0,o.Lk)("span",null,(0,a.v_)(e.name),1),(0,o.Lk)("img",{src:n(3173),alt:"arrow"},null,8,R)])))),128))])):(0,o.Q3)("",!0)])]),(0,o.Lk)("section",null,[(0,o.Lk)("aside",null,[(0,o.Lk)("ul",null,[((0,o.uX)(),(0,o.CE)(o.FK,null,(0,o.pI)(p,((e,t)=>(0,o.Lk)("li",{key:e.id,class:(0,a.C4)({selected:k.value.id===e.id}),onClick:n=>u(e,t)},(0,a.v_)(e.name),11,I))),64))])]),(0,o.Lk)("div",{ref_key:"bodyRef",ref:c},[(0,o.Lk)("section",O,[((0,o.uX)(),(0,o.CE)(o.FK,null,(0,o.pI)(L,(e=>(0,o.Lk)("span",{key:e.id},[(0,o.Lk)("img",{src:n(6669)(`./${e.id}.svg`),alt:""},null,8,T),(0,o.eW)(" "+(0,a.v_)(e.name),1)]))),64))]),(0,o.Lk)("section",j,[(0,o.Lk)("div",null,[((0,o.uX)(),(0,o.CE)(o.FK,null,(0,o.pI)(G,(e=>(0,o.Lk)("div",{key:e.id,class:"box"},[(0,o.Lk)("span",null,(0,a.v_)(e.name),1),(0,o.Lk)("div",null,[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(e.items,(e=>((0,o.uX)(),(0,o.CE)("span",{key:e,class:"keyword"},(0,a.v_)(e),1)))),128))])]))),64))])]),(0,o.Lk)("section",M,[Z.value?((0,o.uX)(),(0,o.CE)("div",S,[(0,o.Lk)("img",{src:n(4343),alt:"search"},null,8,A)])):((0,o.uX)(),(0,o.CE)("div",W,[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(Y.value,(e=>((0,o.uX)(),(0,o.CE)("ul",{key:e.id},[(0,o.Lk)("li",z,[(0,o.Lk)("div",null,[(0,o.Lk)("span",N,[(0,o.Lk)("img",{src:n(2528),alt:""},null,8,$),(0,o.eW)(" "+(0,a.v_)(e.name),1)]),(0,o.Lk)("span",D,(0,a.v_)(e.from)+" ~ "+(0,a.v_)(e.to),1)])]),((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(e.projects,(e=>((0,o.uX)(),(0,o.CE)("li",{key:e.id,onClick:t=>i("load",e),class:"child"},[(0,o.Lk)("div",{class:(0,a.C4)({"no-item":e.id.startsWith("-")})},(0,a.v_)(e.name),3)],8,P)))),128))])))),128))]))]),(0,o.Lk)("section",{class:"archive",ref_key:"archiveRef",ref:te},[le.value?((0,o.uX)(),(0,o.CE)("div",Q,[(0,o.Lk)("img",{src:n(4343),alt:"search"},null,8,U)])):((0,o.uX)(),(0,o.CE)("div",{key:1,class:"wrapper",style:(0,a.Tr)(`column-gap: ${ne.value}px`)},[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(re.value,(e=>((0,o.uX)(),(0,o.CE)("div",{class:"icon",key:e.id,onClick:t=>ge(e)},[(0,o.Lk)("img",{src:n(6669)(`./${(0,r.R1)(f)(e.mimeType)}.svg`),alt:"icon"},null,8,B),(0,o.Lk)("span",null,(0,a.v_)(e.name),1)],8,q)))),128)),0===re.value.length?((0,o.uX)(),(0,o.CE)("div",H," 이 폴더는 비어있습니다. ")):(0,o.Q3)("",!0)],4))],512),(0,o.Lk)("section",J,[(0,o.Lk)("ul",null,[((0,o.uX)(),(0,o.CE)(o.FK,null,(0,o.pI)(de,(e=>(0,o.Lk)("li",{key:e.id,onClick:t=>i("load",{id:e.id,name:e.id,kind:"drive#file",mimeType:"text/x-markdown"}),class:(0,a.C4)({"no-item":e.id.startsWith("-")})},(0,a.v_)(e.name),11,V))),64))])])],512)])]))}});const Y=G;var Z=Y,ee=n(5255),te=n(1109);n(9351);const ne={class:"buttons"},ie=["src"],se={class:"article"},oe=["innerHTML"];var ae=(0,o.pM)({__name:"ArticlePage",props:["file"],emits:["ready","close"],setup(e,{emit:t}){const i=e,s=t,l=(0,r.KR)(!0),c=(0,r.KR)(!1),u=(0,r.lW)((()=>i.file)),v=new ee.Converter({tables:!0}),g=(0,r.KR)(""),d=(0,r.KR)();function p(){c.value=!1,s("close")}return(0,o.wB)(u,(async e=>{e&&(g.value=await h(e.id),d.value=v.makeHtml(`${g.value}`),s("ready"),c.value=!0,l.value=!1,setTimeout((()=>{te.A.highlightAll()}),500))})),(e,t)=>((0,o.uX)(),(0,o.CE)("main",{id:"article",class:(0,a.C4)([{in:c.value&&!l.value,out:!c.value&&!l.value},"scroll"])},[(0,o.Lk)("section",ne,[(0,o.Lk)("button",{onClick:p},[(0,o.Lk)("img",{src:n(5837),alt:"close"},null,8,ie)])]),(0,o.Lk)("section",se,[(0,o.Lk)("article",{innerHTML:d.value},null,8,oe)])],2))}});const re=ae;var le=re;const ce={id:"main"},ue={id:"window"},ve={class:"lt"},ge=["onClick"],de={class:"rt"},pe=["src"],fe=["src"],me={key:0,id:"loading"};var ke=(0,o.pM)({__name:"App",setup(e){const t=(0,r.KR)([{id:"base",name:"로컬 디스크 (C:)"}]),i=(0,r.KR)(t.value[0]);let s;const l=(0,r.KR)(0),c=(0,r.KR)(!1);function u(){l.value=l.value<3?l.value+1:0}(0,o.wB)(c,(e=>{e?(l.value=0,s=setInterval(u,500)):(clearInterval(s),s=void 0)}));const v=(0,r.KR)();function g(e){e.id.startsWith("-")||(v.value=e,c.value=!0)}const d=(0,r.KR)(0);function p(){d.value=window.innerWidth/1920}return(0,o.sV)((()=>{p(),window.addEventListener("resize",p)})),(0,o.hi)((()=>{window.removeEventListener("resize",p)})),(e,s)=>((0,o.uX)(),(0,o.CE)(o.FK,null,[(0,o.Lk)("main",ce,[s[4]||(s[4]=(0,o.Lk)("section",{id:"title"},[(0,o.Lk)("h1",null,"KIM YUJIN"),(0,o.Lk)("h2",null,"프론트엔드 개발자 김유진의 포트폴리오입니다.")],-1)),(0,o.Lk)("section",ue,[(0,o.Lk)("header",null,[(0,o.Lk)("div",ve,[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(t.value,(e=>((0,o.uX)(),(0,o.CE)("button",{key:e.id,onClick:t=>i.value=e,class:(0,a.C4)({selected:e.id===i.value.id})},(0,a.v_)(e.name),11,ge)))),128))]),(0,o.Lk)("div",de,[(0,o.Lk)("button",null,[(0,o.Lk)("img",{src:n(9427),alt:"minimize"},null,8,pe)]),(0,o.Lk)("button",null,[(0,o.Lk)("img",{src:n(5837),alt:"close"},null,8,fe)])])]),(0,o.Lk)("section",null,[(0,o.bF)(Z,{onLoad:g})]),s[3]||(s[3]=(0,o.Lk)("footer",null,null,-1)),c.value?((0,o.uX)(),(0,o.CE)("section",me,[(0,o.Lk)("div",null,[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(l.value,(e=>((0,o.uX)(),(0,o.CE)("span",{key:e})))),128))]),s[2]||(s[2]=(0,o.eW)(" 로딩중 "))])):(0,o.Q3)("",!0)])]),(0,o.Lk)("main",{id:"background",style:(0,a.Tr)(`opacity: ${d.value}`)},null,4),(0,o.bF)(le,{file:v.value,onClose:s[0]||(s[0]=e=>{v.value=void 0}),onReady:s[1]||(s[1]=e=>c.value=!1)},null,8,["file"])],64))}});const ye=ke;var he=ye,we=n(9103),Le=(n(5209),n(5700),n(7043));const be=(0,s.Ey)();(0,i.Ef)(he).use(be).use(we.Ay,{clientId:"827293727138-rpq0n9svbmdlu0hup4h4qiagvs8hujio.apps.googleusercontent.com"}).use(Le.A).mount("#app")},5853:function(e,t,n){var i={"./alert.svg":7727,"./archive.svg":9363,"./arrow-drop-right.svg":3173,"./arrow-up.svg":6688,"./bookmark.svg":359,"./career.svg":4005,"./caret-down.svg":1149,"./caret-left.svg":9494,"./caret-right.svg":5701,"./caret-up.svg":1058,"./close.svg":5837,"./file.svg":4709,"./folder.svg":811,"./gitflow.svg":457,"./home.svg":4174,"./list.svg":71,"./mail.svg":9814,"./minimize.svg":9427,"./monitor.svg":7871,"./package.svg":9453,"./pencil.svg":184,"./phone.svg":6345,"./pin.svg":2528,"./question.svg":4515,"./refresh.svg":2304,"./search.svg":4343,"./skills.svg":5417,"./tag.svg":8197,"./unknown.svg":9335,"./user.svg":698};function s(e){var t=o(e);return n(t)}function o(e){if(!n.o(i,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return i[e]}s.keys=function(){return Object.keys(i)},s.resolve=o,e.exports=s,s.id=5853},6669:function(e,t,n){var i={"./alert.svg":7727,"./archive.svg":9363,"./arrow-drop-right.svg":3173,"./arrow-up.svg":6688,"./bookmark.svg":359,"./career.svg":4005,"./caret-down.svg":1149,"./caret-left.svg":9494,"./caret-right.svg":5701,"./caret-up.svg":1058,"./close.svg":5837,"./file.svg":4709,"./folder.svg":811,"./gitflow.svg":457,"./home.svg":4174,"./list.svg":71,"./mail.svg":9814,"./minimize.svg":9427,"./monitor.svg":7871,"./package.svg":9453,"./pencil.svg":184,"./phone.svg":6345,"./pin.svg":2528,"./question.svg":4515,"./refresh.svg":2304,"./search.svg":4343,"./skills.svg":5417,"./tag.svg":8197,"./unknown.svg":9335,"./user.svg":698};function s(e){var t=o(e);return n(t)}function o(e){if(!n.o(i,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return i[e]}s.keys=function(){return Object.keys(i)},s.resolve=o,e.exports=s,s.id=6669},7727:function(e,t,n){"use strict";e.exports=n.p+"img/alert.baffd746.svg"},9363:function(e,t,n){"use strict";e.exports=n.p+"img/archive.f9073f16.svg"},3173:function(e,t,n){"use strict";e.exports=n.p+"img/arrow-drop-right.c13e70e5.svg"},6688:function(e,t,n){"use strict";e.exports=n.p+"img/arrow-up.eee0be16.svg"},359:function(e,t,n){"use strict";e.exports=n.p+"img/bookmark.fe440ff8.svg"},4005:function(e,t,n){"use strict";e.exports=n.p+"img/career.3552748d.svg"},1149:function(e,t,n){"use strict";e.exports=n.p+"img/caret-down.89b3d96b.svg"},9494:function(e,t,n){"use strict";e.exports=n.p+"img/caret-left.e78d70ad.svg"},5701:function(e,t,n){"use strict";e.exports=n.p+"img/caret-right.04ab6dae.svg"},1058:function(e,t,n){"use strict";e.exports=n.p+"img/caret-up.66ce7eef.svg"},5837:function(e,t,n){"use strict";e.exports=n.p+"img/close.19ab61cb.svg"},4709:function(e,t,n){"use strict";e.exports=n.p+"img/file.27fca3cf.svg"},811:function(e,t,n){"use strict";e.exports=n.p+"img/folder.ca40fbe4.svg"},457:function(e,t,n){"use strict";e.exports=n.p+"img/gitflow.6a209bd8.svg"},4174:function(e,t,n){"use strict";e.exports=n.p+"img/home.252da919.svg"},71:function(e,t,n){"use strict";e.exports=n.p+"img/list.ccae2022.svg"},9814:function(e,t,n){"use strict";e.exports=n.p+"img/mail.f5842c0b.svg"},9427:function(e,t,n){"use strict";e.exports=n.p+"img/minimize.55aba63e.svg"},7871:function(e,t,n){"use strict";e.exports=n.p+"img/monitor.39a7cd00.svg"},9453:function(e,t,n){"use strict";e.exports=n.p+"img/package.0b951b89.svg"},184:function(e,t,n){"use strict";e.exports=n.p+"img/pencil.33bdd83d.svg"},6345:function(e,t,n){"use strict";e.exports=n.p+"img/phone.b1fea5e1.svg"},2528:function(e,t,n){"use strict";e.exports=n.p+"img/pin.28df56ee.svg"},4515:function(e,t,n){"use strict";e.exports=n.p+"img/question.85a386e1.svg"},2304:function(e,t,n){"use strict";e.exports=n.p+"img/refresh.60766f18.svg"},4343:function(e,t,n){"use strict";e.exports=n.p+"img/search.a9fe126d.svg"},5417:function(e,t,n){"use strict";e.exports=n.p+"img/skills.fd9ce652.svg"},8197:function(e,t,n){"use strict";e.exports=n.p+"img/tag.c09a8fe3.svg"},9335:function(e,t,n){"use strict";e.exports=n.p+"img/unknown.a23a517c.svg"},698:function(e,t,n){"use strict";e.exports=n.p+"img/user.fa8c61bc.svg"}},t={};function n(i){var s=t[i];if(void 0!==s)return s.exports;var o=t[i]={exports:{}};return e[i].call(o.exports,o,o.exports,n),o.exports}n.m=e,function(){var e=[];n.O=function(t,i,s,o){if(!i){var a=1/0;for(u=0;u<e.length;u++){i=e[u][0],s=e[u][1],o=e[u][2];for(var r=!0,l=0;l<i.length;l++)(!1&o||a>=o)&&Object.keys(n.O).every((function(e){return n.O[e](i[l])}))?i.splice(l--,1):(r=!1,o<a&&(a=o));if(r){e.splice(u--,1);var c=s();void 0!==c&&(t=c)}}return t}o=o||0;for(var u=e.length;u>0&&e[u-1][2]>o;u--)e[u]=e[u-1];e[u]=[i,s,o]}}(),function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){n.d=function(e,t){for(var i in t)n.o(t,i)&&!n.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){n.p="/"}(),function(){var e={524:0};n.O.j=function(t){return 0===e[t]};var t=function(t,i){var s,o,a=i[0],r=i[1],l=i[2],c=0;if(a.some((function(t){return 0!==e[t]}))){for(s in r)n.o(r,s)&&(n.m[s]=r[s]);if(l)var u=l(n)}for(t&&t(i);c<a.length;c++)o=a[c],n.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return n.O(u)},i=self["webpackChunkyj520435_github_io"]=self["webpackChunkyj520435_github_io"]||[];i.forEach(t.bind(null,0)),i.push=t.bind(null,i.push.bind(i))}();var i=n.O(void 0,[504],(function(){return n(1732)}));i=n.O(i)})();
//# sourceMappingURL=app.155601fd.js.map
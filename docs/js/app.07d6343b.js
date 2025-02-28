(function(){var e={6793:function(e,t,n){"use strict";var i=n(5130),l=n(5234),o=(n(4114),n(6768)),a=n(4232),s=n(144),r=(n(8992),n(4520),JSON.parse('[{"id":"Front-End","name":"프론트엔드","items":["Vue","Nuxt"]},{"id":"Back-End","name":"백엔드","items":["Java","Spring","PostgreSQL"]},{"id":"SCM","name":"버전관리","items":["Git"]},{"id":"Co-Work","name":"협업도구","items":["Jira","Slack","Notion"]}]')),u=JSON.parse('[{"id":"1RsApMVgmRXjA7gycp7KbHoDw37eh89bY","name":"카피앤패이스트","from":"2022. 01","to":"2024. 10","department":"연구개발팀","position":"사원","tasks":"IoT 관제 시스템 UI 및 서비스 개발"},{"id":"-","name":"스위스로그헬스케어코리아","from":"2019. 07","to":"2021. 05","department":"경영지원팀","position":"사원","tasks":"회계, 총무, 건설공무 외 경영지원 전반"},{"id":"1381tfhzUkSjLDnAcvOUvbK3kUoS7kOM5","name":"유알피시스템","from":"2018. 06","to":"2018. 12","department":"행정포털팀","position":"사원","tasks":"행정포털시스템 기능개선사업 개발 참여"}]'),c=JSON.parse('[{"id":"portfolio","name":"Portfolio","from":"2025. 01","to":"2025. 02","keywords":["Vue3","TypeScript"],"comment":"포트폴리오","link":"https://github.com/yj520435/yj520435.github.io"},{"id":"fumblr","name":"Fumblr","from":"2021. 08","to":"2021. 11","keywords":["JSP","Servlet","Spring","MyBatis"],"comment":"텀블러(<a href=\'https://www.tumblr.com/\'>tumblr</a>)를 모방한 마이크로 블로그","link":"https://github.com/yj520435/fumblr"},{"id":"qloud","name":"Qloud","from":"2017. 01","to":"2017. 05","keywords":["C#","Unity"],"comment":"모바일 2D 함정 피하기 게임 (졸업작품)","link":"https://github.com/yj520435/qloud"}]');const d="AIzaSyBgjHhLJ-4KpONdeY4zzxSbb5jZ2KDcQvA",v="https://script.google.com/macros/s/AKfycby6xDrEwxLM-YNMty9wa75GecwuigoKrZPEXSXILqNAbi57u8aJatp2yXrolvtl5XIoyg/exec",f="application/vnd.google-apps.folder",m="101ySHAx1_ay6MZQy-69klLcz8l_vf_X2";var p=n(4373);function k(e){switch(e){case"text/x-markdown":return"file";case"application/vnd.google-apps.folder":return"folder";default:return"unknown"}}function y(e){const t=e.filter((e=>e.mimeType===f)),n=e.filter((e=>e.mimeType!==f)),i=[...t].sort(((e,t)=>g(e.name,t.name))),l=[...n].sort(((e,t)=>g(e.name,t.name)));return i.concat(l)}function g(e,t){const n=e.toLowerCase(),i=t.toLowerCase();return n>i?1:n<i?-1:0}async function h(e,t={}){const{timeout:n=8e3}=t,i=new AbortController,l=setTimeout((()=>i.abort()),n),o=await fetch(e,{...t,signal:i.signal});return clearTimeout(l),o}async function L(e){const t=`https://www.googleapis.com/drive/v3/files?q="${e}"+in+parents&key=${d}`;try{const n=await h(t,{timeout:2e3});if(n.ok){const e=(await n.json()).files;return e}{const t=await b(e);return t}}catch(n){console.error(n);const t=await b(e);return t}}async function w(e,t){const n=`https://www.googleapis.com/drive/v3/files/${e}?key=${d}&alt=media`;try{const i=await h(n,{timeout:2e3});if(i.ok){const e="json"===t?i.json():i.text();return e}{const t=await C(e);return t}}catch(i){console.error(i);const t=await C(e);return t}}async function b(e){try{const t=await(0,p.A)({url:v,method:"get",params:{dirId:e,command:"list"}});return t.data?.result}catch(t){return console.error(t),[]}}async function C(e){try{const t=await(0,p.A)({url:v,method:"get",params:{fileId:e,command:"select",mimeType:"text/x-markdown"}});return t.data}catch(t){return console.error(t),[]}}var E=n(5255);n(2577);const _=(0,l.nY)("store",(()=>{const e=(0,s.KR)([]);function t(t,n){e.value.push({id:t,items:n})}function n(t){return e.value.find((e=>e.id===t))}function i(t){const n=e.value.findIndex((e=>e.id===t));e.value.splice(n,1)}const l=(0,s.KR)([]);function o(e,t){l.value.push({id:e,contents:t})}function a(e){return l.value.find((t=>t.id===e))}return{setFolder:t,getFolder:n,deleteFolder:i,setFile:o,getFile:a}}));var R=n(1576),T=n.n(R);const j={id:"root",class:"scroll"},K={key:0},O={id:"avatar"},S=["src"],x={id:"skills"},X={class:"outline list"},I={class:"name"},M={id:"career"},A={class:"outline"},F=["onClick"],z={class:"date"},P={class:"dep"},W={class:"task"},D={id:"project"},H={class:"outline"},N={class:"scroll"},Y={class:"list"},J={class:"name"},Q=["href"],U={class:"date"},q={class:"keywords"},$={class:"comment"},B=["innerHTML"],V={class:"counts"},Z=["disabled"],G=["disabled"],ee={id:"archive"},te={key:0,class:"loading"},ne=["src"],ie={key:1,class:"view"},le={class:"list"},oe=["onClick"],ae={key:0,class:"empty"},se={key:0,class:"loading"},re=["src"],ue=["innerHTML"];var ce=(0,o.pM)({__name:"App",setup(e){const t=_(),i=(0,s.KR)(1),l=(0,s.KR)(!1),d=((0,o.EW)((()=>l.value?"minimize":"maximize")),(0,o.EW)((()=>`transform: scale(${i.value})`)));function v(e){const t=e?e.target.innerWidth:window.innerWidth;i.value=1+.3/1420*(t-500)}(0,o.wB)(l,(e=>{e?(v(),window.addEventListener("resize",v)):(i.value=1,window.removeEventListener("resize",v))}));const p=(0,s.KR)(!1),g=(0,s.KR)(0),h=(0,o.EW)((()=>c[g.value])),b=(0,o.EW)((()=>0===g.value)),C=(0,o.EW)((()=>g.value===c.length-1));function R(){b.value||(g.value-=1)}function ce(){C.value||(g.value+=1)}const de=(0,s.KR)([]),ve=(0,s.KR)(!0),fe=(0,s.KR)([]),me=(0,o.EW)((()=>fe.value[fe.value.length-1]===m));async function pe(e){de.value=[],ve.value=!0;const n=t.getFolder(e);if(n)de.value=n.items;else{const n=await L(e);n.length>0&&(de.value=y(n)),t.setFolder(e,de.value)}ve.value=!1}async function ke(e){e.mimeType===f?fe.value.push(e.id):await Ee(e.id)}(0,o.wB)(fe,(async e=>{const t=e[e.length-1];await pe(t)}),{deep:!0});const ye=(0,s.KR)(!1),ge=(0,s.KR)(!0),he=(0,s.KR)("show"),Le=(0,s.KR)(""),we=(0,s.KR)(),be=new E.Converter({tables:!0,simpleLineBreaks:!0}),Ce=(0,s.KR)();async function Ee(e){ye.value=!0,Le.value=await w(e),we.value=be.makeHtml(`${Le.value}`),ge.value=!1}function _e(){ye.value=!1,ge.value=!0}function Re(e){const t=Ce.value;t.clientHeight<t.scrollHeight&&(he.value=e.deltaY<0?"show":"hide")}const Te=(0,s.KR)();return(0,o.sV)((async()=>{fe.value.push(m),Te.value=document.documentElement.dataset.build})),(e,t)=>((0,o.uX)(),(0,o.CE)(o.FK,null,[(0,o.Lk)("main",j,[ye.value?(0,o.Q3)("",!0):((0,o.uX)(),(0,o.CE)("nav",K,[(0,o.Lk)("div",null,[(0,o.Lk)("button",{class:(0,a.C4)(["zoom",l.value?"minimize":"maximize"]),style:(0,a.Tr)(d.value),onClick:t[0]||(t[0]=e=>l.value=!l.value)},null,6)])])),(0,o.Lk)("div",{style:(0,a.Tr)(d.value)},[(0,o.Lk)("header",null,[(0,o.Lk)("div",O,[(0,o.Lk)("img",{src:n(5572),alt:""},null,8,S)]),t[4]||(t[4]=(0,o.Lk)("h1",null,"Yu Jin",-1))]),t[11]||(t[11]=(0,o.Fv)('<section id="profile"><span class="title">PROFILE</span><div class="outline"><p>김유진 (1994. 05)</p><p>주니어 웹 개발자</p></div></section><div class="wrapper"><section id="education"><span class="title">EDUCATION</span><ul class="outline list"><li>인천대학교 컴퓨터공학부</li></ul></section><section id="certificates"><span class="title">CERTIFICATES</span><ul class="outline list"><li>정보처리기사</li></ul></section></div>',2)),(0,o.Lk)("section",x,[t[6]||(t[6]=(0,o.Lk)("span",{class:"title"},"SKILLS",-1)),(0,o.Lk)("ul",X,[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)((0,s.R1)(r),(e=>((0,o.uX)(),(0,o.CE)("li",{key:e.id},[(0,o.Lk)("span",I,(0,a.v_)(e.id),1),t[5]||(t[5]=(0,o.Lk)("span",null,">",-1)),(0,o.Lk)("span",null,(0,a.v_)(e.items?.join(" ・ ")),1)])))),128))])]),(0,o.Lk)("section",M,[t[7]||(t[7]=(0,o.Lk)("span",{class:"title"},"CAREER",-1)),(0,o.Lk)("div",A,[((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)((0,s.R1)(u),(e=>((0,o.uX)(),(0,o.CE)("ul",{key:e.id,class:(0,a.C4)(["list",{disabled:e.id.startsWith("-")}])},[(0,o.Lk)("li",{class:"name",onClick:()=>{e.id.startsWith("-")||Ee(e.id)}},(0,a.v_)(e.name),9,F),(0,o.Lk)("li",z,(0,a.v_)(e.from)+" - "+(0,a.v_)(e.to),1),(0,o.Lk)("li",P,(0,a.v_)(e.department)+" / "+(0,a.v_)(e.position),1),(0,o.Lk)("li",W,(0,a.v_)(e.tasks),1)],2)))),128))])]),(0,o.Lk)("section",D,[t[8]||(t[8]=(0,o.Lk)("span",{class:"title"},"SIDE PROJECT",-1)),(0,o.Lk)("div",H,[(0,o.Lk)("article",N,[(0,o.Lk)("div",{class:(0,a.C4)(["image",{color:p.value}]),style:(0,a.Tr)({backgroundImage:"url("+n(7763)(`./${h.value.id}.gif`)+")"}),onClick:t[1]||(t[1]=e=>p.value=!p.value)},null,6),(0,o.Lk)("ul",Y,[(0,o.Lk)("li",J,[(0,o.Lk)("a",{href:h.value.link,target:"_blank"},(0,a.v_)(h.value.name),9,Q)]),(0,o.Lk)("li",U,(0,a.v_)(h.value.from)+" - "+(0,a.v_)(h.value.to),1),(0,o.Lk)("li",q,(0,a.v_)(h.value.keywords.join(" ・ ")),1),(0,o.Lk)("li",$,[(0,o.Lk)("span",{innerHTML:h.value.comment},null,8,B)])])]),(0,o.Lk)("span",V,[(0,o.Lk)("button",{onClick:R,disabled:b.value},null,8,Z),(0,o.Lk)("span",null,(0,a.v_)(g.value+1)+" / "+(0,a.v_)((0,s.R1)(c).length),1),(0,o.Lk)("button",{onClick:ce,disabled:C.value},null,8,G)])])]),(0,o.Lk)("section",ee,[t[9]||(t[9]=(0,o.Lk)("span",{class:"title"},"ARCHIVE",-1)),ve.value?((0,o.uX)(),(0,o.CE)("div",te,[(0,o.Lk)("img",{src:n(4343),alt:"loading"},null,8,ne)])):((0,o.uX)(),(0,o.CE)("div",ie,[(0,o.Lk)("ul",le,[me.value?(0,o.Q3)("",!0):((0,o.uX)(),(0,o.CE)("li",{key:0,class:"root",onClick:t[2]||(t[2]=e=>fe.value=[(0,s.R1)(m)])},".")),me.value?(0,o.Q3)("",!0):((0,o.uX)(),(0,o.CE)("li",{key:1,class:"back",onClick:t[3]||(t[3]=e=>fe.value.pop())},"..")),((0,o.uX)(!0),(0,o.CE)(o.FK,null,(0,o.pI)(de.value,(e=>((0,o.uX)(),(0,o.CE)("li",{key:e.id,class:(0,a.C4)((0,s.R1)(k)(e.mimeType)),onClick:t=>ke(e)},(0,a.v_)(e.name),11,oe)))),128))]),0===de.value.length?((0,o.uX)(),(0,o.CE)("div",ae," EMPTY ")):(0,o.Q3)("",!0)]))]),(0,o.Lk)("footer",null,[(0,o.Lk)("p",null,"Last Updated "+(0,a.v_)((0,s.R1)(T())(Te.value).format("YYYY-MM-DD")),1),t[10]||(t[10]=(0,o.Lk)("p",null,"Contact Me yj520435@gmail.com",-1))])],4)]),ye.value?((0,o.uX)(),(0,o.CE)("main",{key:0,id:"shadow",style:(0,a.Tr)(d.value)},[ge.value?((0,o.uX)(),(0,o.CE)("div",se,[(0,o.Lk)("img",{src:n(4343),alt:"loading"},null,8,re)])):((0,o.uX)(),(0,o.CE)("div",{key:1,class:"article",style:(0,a.Tr)({height:1/i.value*100+"%"})},[(0,o.Lk)("div",{class:(0,a.C4)(["buttons",he.value])},[(0,o.Lk)("button",{class:"close",onClick:_e})],2),(0,o.Lk)("article",{innerHTML:we.value,ref_key:"articleRef",ref:Ce,class:"scroll",onWheelPassive:Re},null,40,ue)],4))],4)):(0,o.Q3)("",!0)],64))}});const de=ce;var ve=de,fe=n(9103),me=(n(5209),n(5700),n(7043));const pe=(0,l.Ey)();(0,i.Ef)(ve).use(pe).use(fe.Ay,{clientId:"827293727138-rpq0n9svbmdlu0hup4h4qiagvs8hujio.apps.googleusercontent.com"}).use(me.A).mount("#app")},7763:function(e,t,n){var i={"./fumblr.gif":3588,"./portfolio.gif":7888,"./qloud.gif":733};function l(e){var t=o(e);return n(t)}function o(e){if(!n.o(i,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return i[e]}l.keys=function(){return Object.keys(i)},l.resolve=o,e.exports=l,l.id=7763},4343:function(e,t,n){"use strict";e.exports=n.p+"img/search.a9fe126d.svg"},3588:function(e,t,n){"use strict";e.exports=n.p+"img/fumblr.a812e1ea.gif"},7888:function(e,t,n){"use strict";e.exports=n.p+"img/portfolio.169c61ee.gif"},5572:function(e,t,n){"use strict";e.exports=n.p+"img/profile.25ab12a7.png"},733:function(e,t,n){"use strict";e.exports=n.p+"img/qloud.ce0c3a2f.gif"}},t={};function n(i){var l=t[i];if(void 0!==l)return l.exports;var o=t[i]={exports:{}};return e[i].call(o.exports,o,o.exports,n),o.exports}n.m=e,function(){var e=[];n.O=function(t,i,l,o){if(!i){var a=1/0;for(c=0;c<e.length;c++){i=e[c][0],l=e[c][1],o=e[c][2];for(var s=!0,r=0;r<i.length;r++)(!1&o||a>=o)&&Object.keys(n.O).every((function(e){return n.O[e](i[r])}))?i.splice(r--,1):(s=!1,o<a&&(a=o));if(s){e.splice(c--,1);var u=l();void 0!==u&&(t=u)}}return t}o=o||0;for(var c=e.length;c>0&&e[c-1][2]>o;c--)e[c]=e[c-1];e[c]=[i,l,o]}}(),function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){n.d=function(e,t){for(var i in t)n.o(t,i)&&!n.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){n.p="/"}(),function(){var e={524:0};n.O.j=function(t){return 0===e[t]};var t=function(t,i){var l,o,a=i[0],s=i[1],r=i[2],u=0;if(a.some((function(t){return 0!==e[t]}))){for(l in s)n.o(s,l)&&(n.m[l]=s[l]);if(r)var c=r(n)}for(t&&t(i);u<a.length;u++)o=a[u],n.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return n.O(c)},i=self["webpackChunkyj520435_github_io"]=self["webpackChunkyj520435_github_io"]||[];i.forEach(t.bind(null,0)),i.push=t.bind(null,i.push.bind(i))}();var i=n.O(void 0,[504],(function(){return n(6793)}));i=n.O(i)})();
//# sourceMappingURL=app.07d6343b.js.map
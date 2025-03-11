(function(){var e={2858:function(e,t,n){"use strict";var l=n(5130),o=n(5234),i=(n(4114),n(6768)),a=n(4232),s=n(144),r=(n(8992),n(4520),n(1454),n(4979),JSON.parse('[{"id":"Front-End","name":"프론트엔드","items":["Vue","Nuxt"]},{"id":"Back-End","name":"백엔드","items":["Java","Spring","PostgreSQL"]},{"id":"SCM","name":"버전관리","items":["Git"]},{"id":"Co-Work","name":"협업도구","items":["Jira","Slack","Notion"]}]')),u=JSON.parse('[{"id":"1RsApMVgmRXjA7gycp7KbHoDw37eh89bY","name":"카피앤패이스트","from":"2022. 01","to":"2024. 10","department":"연구개발팀","position":"사원","tasks":"IoT 관제 시스템 UI 및 서비스 개발"},{"id":"-","name":"스위스로그헬스케어코리아","from":"2019. 07","to":"2021. 05","department":"경영지원팀","position":"사원","tasks":"회계, 총무, 건설공무 외 경영지원 전반"},{"id":"1381tfhzUkSjLDnAcvOUvbK3kUoS7kOM5","name":"유알피시스템","from":"2018. 06","to":"2018. 12","department":"행정포털팀","position":"사원","tasks":"행정포털시스템 기능개선사업 개발 참여"}]'),c=JSON.parse('[{"id":"portfolio","name":"Portfolio","from":"2025. 01","to":"2025. 02","keywords":["Vue3","TypeScript"],"comment":"포트폴리오","link":"https://github.com/yj520435/yj520435.github.io"},{"id":"fumblr","name":"Fumblr","from":"2021. 08","to":"2021. 11","keywords":["JSP","Servlet","Spring","MyBatis"],"comment":"텀블러(<a href=\'https://www.tumblr.com/\'>tumblr</a>)를 모방한 마이크로 블로그","link":"https://github.com/yj520435/fumblr"},{"id":"qloud","name":"Qloud","from":"2017. 01","to":"2017. 05","keywords":["C#","Unity"],"comment":"모바일 2D 함정 피하기 게임 (졸업작품)","link":"https://github.com/yj520435/qloud"}]');const d="AIzaSyBgjHhLJ-4KpONdeY4zzxSbb5jZ2KDcQvA",v="https://script.google.com/macros/s/AKfycby6xDrEwxLM-YNMty9wa75GecwuigoKrZPEXSXILqNAbi57u8aJatp2yXrolvtl5XIoyg/exec",f="application/vnd.google-apps.folder",m="101ySHAx1_ay6MZQy-69klLcz8l_vf_X2";var p=n(4373),k=n(1576),g=n.n(k);function y(e){switch(e){case"text/x-markdown":return"file";case"application/vnd.google-apps.folder":return"folder";default:return"unknown"}}function L(e){const t=e.filter((e=>e.mimeType===f)),n=e.filter((e=>e.mimeType!==f)).map((e=>{const t=h(e.name),n={...e};return delete n.name,{...n,name:t}})),l=[...t].sort(((e,t)=>w(e.name,t.name))),o=[...n].sort(((e,t)=>w(e.name,t.name)));return l.concat(o)}function h(e){if(""!==e){const t=e.lastIndexOf(".");return-1!==t?e.substring(0,t):e}return"untitled"}function w(e,t){const n=e.toLowerCase(),l=t.toLowerCase();return n>l?1:n<l?-1:0}async function b(e,t={}){const{timeout:n=8e3}=t,l=new AbortController,o=setTimeout((()=>l.abort()),n),i=await fetch(e,{...t,signal:l.signal});return clearTimeout(o),i}async function C(e){const t=`https://www.googleapis.com/drive/v3/files?q="${e}"+in+parents&key=${d}`,n=async e=>{try{const t=await(0,p.A)({url:v,method:"get",params:{dirId:e,command:"list"}});return t.data?.result}catch(t){return console.error(t),[]}};try{const l=await b(t,{timeout:2e3});if(l.ok){const e=(await l.json()).files;return e}{const t=await n(e);return t}}catch(l){console.error(l);const t=await n(e);return t}}async function E(e,t){const n=`https://www.googleapis.com/drive/v3/files/${e}?key=${d}&alt=media`,l=async e=>{try{const t=await(0,p.A)({url:v,method:"get",params:{fileId:e,command:"select",mimeType:"text/x-markdown"}});return t.data}catch(t){return console.error(t),[]}};try{const o=await b(n,{timeout:2e3});if(o.ok){const e="json"===t?o.json():o.text();return e}{const t=await l(e);return t}}catch(o){console.error(o);const t=await l(e);return t}}function _(e){for(const t of e){let e=!1;const n={x:0,left:0};t.onmousedown=l=>{n.x=l.clientX,n.left=t.scrollLeft,e=!0,t.style.cursor="grabbing"},t.onmousemove=l=>{if(e){const e=l.clientX-n.x;t.scrollLeft=n.left-e}},t.onmouseup=()=>{n.left=t.scrollLeft,e=!1,t.style.cursor="grab"}}}function R(e){const t=document.querySelector("#secret");for(const l of e){const e=new Image;e.src=n(7763)(`./${l.id}.gif`),t?.append(e)}}var T=n(5255);n(2577);const x=(0,o.nY)("item",(()=>{const e=(0,s.KR)([]);function t(t){return e.value.find((e=>e.id===t))}function n(t,n){e.value.push({id:t,items:n})}return{folders:e,get:t,set:n}}));var O=n(1109);n(9351);const S={id:"root",class:"scroll"},j={key:0},K={id:"avatar"},X=["src"],I={id:"skills"},A={class:"outline list"},M={class:"name"},N={id:"career"},D={class:"outline"},F=["onClick"],W={class:"date"},q={class:"dep"},z={class:"task"},J={id:"project"},P={class:"outline"},U={class:"scroll"},H={class:"list"},Y={class:"name"},$=["href"],Q={class:"date"},B={class:"keywords"},V={class:"comment"},G=["innerHTML"],Z={class:"counts"},ee=["disabled"],te=["disabled"],ne={id:"archive"},le={key:0,class:"loading"},oe=["src"],ie={key:1,class:"view"},ae={class:"list items"},se=["onClick"],re={key:0,class:"loading"},ue=["src"],ce=["innerHTML"];var de=(0,i.pM)({__name:"App",setup(e){const t=x(),l=(0,s.KR)(1),o=(0,s.KR)(!1),d=(0,i.EW)((()=>`transform: scale(${l.value})`));function v(e){const t=e?e.target.innerWidth:window.innerWidth;l.value=1+.3/1420*(t-500)}(0,i.wB)(o,(e=>{e?(v(),window.addEventListener("resize",v)):(l.value=1,window.removeEventListener("resize",v))}));const p=(0,s.KR)(!1),k=(0,s.KR)(0),h=(0,i.EW)((()=>c[k.value])),w=(0,i.EW)((()=>0===k.value)),b=(0,i.EW)((()=>k.value===c.length-1)),de=(0,i.EW)((()=>{const e=c[k.value].id,t=n(7763)(`./${e}.gif`);return`url(${t})`}));function ve(){w.value||(k.value-=1)}function fe(){b.value||(k.value+=1)}const me=(0,s.KR)([]),pe=(0,s.KR)(!0),ke=(0,s.KR)([]),ge=(0,s.KR)(),ye=(0,i.EW)((()=>ke.value[ke.value.length-1]===m));async function Le(e){me.value=[],pe.value=!0;const n=t.get(e);if(n)me.value=n.items;else{const n=await C(e);n.length>0&&(me.value=L(n)),t.set(e,me.value)}pe.value=!1}async function he(e){e.mimeType===f?ke.value.push(e.id):await xe(e)}(0,i.wB)(ke,(async e=>{const t=e[e.length-1];await Le(t)}),{deep:!0});const we=(0,s.KR)(!1),be=(0,s.KR)(!0),Ce=(0,s.KR)("show"),Ee=(0,s.KR)(""),_e=(0,s.KR)(),Re=new T.Converter({tables:!0,simpleLineBreaks:!0}),Te=(0,s.KR)();async function xe(e){"id"in e&&(ge.value=e,we.value=!0,Ee.value=await E(e.id),_e.value=Re.makeHtml(`${Ee.value}`),be.value=!1,setTimeout((()=>{O.A.highlightAll();const e=Te.value.querySelectorAll("pre code");_(e)}),500))}function Oe(){we.value=!1,be.value=!0}const Se=(0,s.KR)();return(0,i.sV)((async()=>{R(c),ke.value.push(m),Se.value=document.documentElement.dataset.build})),(e,t)=>((0,i.uX)(),(0,i.CE)(i.FK,null,[(0,i.Lk)("main",S,[we.value?(0,i.Q3)("",!0):((0,i.uX)(),(0,i.CE)("nav",j,[(0,i.Lk)("div",null,[(0,i.Lk)("button",{class:(0,a.C4)(["zoom",o.value?"minimize":"maximize"]),style:(0,a.Tr)(d.value),onClick:t[0]||(t[0]=e=>o.value=!o.value)},null,6)])])),(0,i.Lk)("div",{style:(0,a.Tr)(d.value)},[(0,i.Lk)("header",null,[(0,i.Lk)("div",K,[(0,i.Lk)("img",{src:n(5572),alt:""},null,8,X)]),t[4]||(t[4]=(0,i.Lk)("h1",null,"Yu Jin",-1))]),t[11]||(t[11]=(0,i.Fv)('<section id="profile"><span class="title">PROFILE</span><div class="outline"><p>김유진 (1994. 05)</p><p>주니어 웹 개발자</p></div></section><div class="wrapper"><section id="education"><span class="title">EDUCATION</span><ul class="outline list"><li><span><span class="full">인천대학교</span><a class="abbr" href="https://www.inu.ac.kr/inu/index.do?epTicket=LOG" target="_blank">INU</a> 컴퓨터공학부 </span></li></ul></section><section id="certificates"><span class="title">CERTIFICATES</span><ul class="outline list"><li>정보처리기사</li></ul></section></div>',2)),(0,i.Lk)("section",I,[t[6]||(t[6]=(0,i.Lk)("span",{class:"title"},"SKILLS",-1)),(0,i.Lk)("ul",A,[((0,i.uX)(!0),(0,i.CE)(i.FK,null,(0,i.pI)((0,s.R1)(r),(e=>((0,i.uX)(),(0,i.CE)("li",{key:e.id},[(0,i.Lk)("span",M,(0,a.v_)(e.id),1),t[5]||(t[5]=(0,i.Lk)("span",null,">",-1)),(0,i.Lk)("span",null,(0,a.v_)(e.items?.join(" ・ ")),1)])))),128))])]),(0,i.Lk)("section",N,[t[7]||(t[7]=(0,i.Lk)("span",{class:"title"},"CAREER",-1)),(0,i.Lk)("div",D,[((0,i.uX)(!0),(0,i.CE)(i.FK,null,(0,i.pI)((0,s.R1)(u),(e=>((0,i.uX)(),(0,i.CE)("ul",{key:e.id,class:(0,a.C4)(["list",{disabled:e.id.startsWith("-")}])},[(0,i.Lk)("li",{class:"name",onClick:()=>{e.id.startsWith("-")||xe(e)}},(0,a.v_)(e.name),9,F),(0,i.Lk)("li",W,(0,a.v_)(e.from)+" - "+(0,a.v_)(e.to),1),(0,i.Lk)("li",q,(0,a.v_)(e.department)+" / "+(0,a.v_)(e.position),1),(0,i.Lk)("li",z,(0,a.v_)(e.tasks),1)],2)))),128))])]),(0,i.Lk)("section",J,[t[8]||(t[8]=(0,i.Lk)("span",{class:"title"},"SIDE PROJECT",-1)),(0,i.Lk)("div",P,[(0,i.Lk)("article",U,[(0,i.Lk)("div",{class:(0,a.C4)(["image",{color:p.value}]),style:(0,a.Tr)({backgroundImage:de.value}),onClick:t[1]||(t[1]=e=>p.value=!p.value)},null,6),(0,i.Lk)("ul",H,[(0,i.Lk)("li",Y,[(0,i.Lk)("a",{href:h.value.link,target:"_blank"},(0,a.v_)(h.value.name),9,$)]),(0,i.Lk)("li",Q,(0,a.v_)(h.value.from)+" - "+(0,a.v_)(h.value.to),1),(0,i.Lk)("li",B,(0,a.v_)(h.value.keywords.join(" ・ ")),1),(0,i.Lk)("li",V,[(0,i.Lk)("span",{innerHTML:h.value.comment},null,8,G)])])]),(0,i.Lk)("span",Z,[(0,i.Lk)("button",{onClick:ve,disabled:w.value},null,8,ee),(0,i.Lk)("span",null,(0,a.v_)(k.value+1)+" / "+(0,a.v_)((0,s.R1)(c).length),1),(0,i.Lk)("button",{onClick:fe,disabled:b.value},null,8,te)])])]),(0,i.Lk)("section",ne,[t[9]||(t[9]=(0,i.Lk)("span",{class:"title"},"ARCHIVE",-1)),pe.value?((0,i.uX)(),(0,i.CE)("div",le,[(0,i.Lk)("img",{src:n(4343),alt:"loading"},null,8,oe)])):((0,i.uX)(),(0,i.CE)("div",ie,[(0,i.Lk)("ul",ae,[ye.value?(0,i.Q3)("",!0):((0,i.uX)(),(0,i.CE)("li",{key:0,class:"root",onClick:t[2]||(t[2]=e=>ke.value=[(0,s.R1)(m)])},".")),ye.value?(0,i.Q3)("",!0):((0,i.uX)(),(0,i.CE)("li",{key:1,class:"back",onClick:t[3]||(t[3]=e=>ke.value.pop())},"..")),((0,i.uX)(!0),(0,i.CE)(i.FK,null,(0,i.pI)(me.value,(e=>((0,i.uX)(),(0,i.CE)("li",{key:e.id,class:(0,a.C4)((0,s.R1)(y)(e.mimeType)),onClick:t=>he(e)},(0,a.v_)(e.name),11,se)))),128))])]))]),(0,i.Lk)("footer",null,[(0,i.Lk)("p",null,"Last Updated "+(0,a.v_)((0,s.R1)(g())(Se.value).format("YYYY-MM-DD")),1),t[10]||(t[10]=(0,i.Lk)("p",null,"Contact Me yj520435@gmail.com",-1))])],4)]),we.value?((0,i.uX)(),(0,i.CE)("main",{key:0,id:"shadow",style:(0,a.Tr)(d.value)},[be.value?((0,i.uX)(),(0,i.CE)("div",re,[(0,i.Lk)("img",{src:n(4343),alt:"loading"},null,8,ue)])):((0,i.uX)(),(0,i.CE)("div",{key:1,class:"article",style:(0,a.Tr)({height:1/l.value*100+"%"})},[(0,i.Lk)("header",{class:(0,a.C4)(Ce.value)},[(0,i.Lk)("span",null,(0,a.v_)(ge.value.name),1),(0,i.Lk)("button",{class:"close",onClick:Oe})],2),(0,i.Lk)("article",{innerHTML:_e.value,ref_key:"articleRef",ref:Te,class:"scroll"},null,8,ce)],4))],4)):(0,i.Q3)("",!0),t[12]||(t[12]=(0,i.Lk)("div",{id:"secret"},null,-1))],64))}});const ve=de;var fe=ve,me=n(9103),pe=(n(5209),n(5700),n(7043));const ke=(0,o.Ey)();(0,l.Ef)(fe).use(ke).use(me.Ay,{clientId:"827293727138-rpq0n9svbmdlu0hup4h4qiagvs8hujio.apps.googleusercontent.com"}).use(pe.A).mount("#app")},7763:function(e,t,n){var l={"./fumblr.gif":3588,"./portfolio.gif":7888,"./qloud.gif":733};function o(e){var t=i(e);return n(t)}function i(e){if(!n.o(l,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return l[e]}o.keys=function(){return Object.keys(l)},o.resolve=i,e.exports=o,o.id=7763},4343:function(e,t,n){"use strict";e.exports=n.p+"img/search.a9fe126d.svg"},3588:function(e,t,n){"use strict";e.exports=n.p+"img/fumblr.a812e1ea.gif"},7888:function(e,t,n){"use strict";e.exports=n.p+"img/portfolio.169c61ee.gif"},5572:function(e,t,n){"use strict";e.exports=n.p+"img/profile.25ab12a7.png"},733:function(e,t,n){"use strict";e.exports=n.p+"img/qloud.ce0c3a2f.gif"}},t={};function n(l){var o=t[l];if(void 0!==o)return o.exports;var i=t[l]={exports:{}};return e[l].call(i.exports,i,i.exports,n),i.exports}n.m=e,function(){var e=[];n.O=function(t,l,o,i){if(!l){var a=1/0;for(c=0;c<e.length;c++){l=e[c][0],o=e[c][1],i=e[c][2];for(var s=!0,r=0;r<l.length;r++)(!1&i||a>=i)&&Object.keys(n.O).every((function(e){return n.O[e](l[r])}))?l.splice(r--,1):(s=!1,i<a&&(a=i));if(s){e.splice(c--,1);var u=o();void 0!==u&&(t=u)}}return t}i=i||0;for(var c=e.length;c>0&&e[c-1][2]>i;c--)e[c]=e[c-1];e[c]=[l,o,i]}}(),function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){n.d=function(e,t){for(var l in t)n.o(t,l)&&!n.o(e,l)&&Object.defineProperty(e,l,{enumerable:!0,get:t[l]})}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){n.p="/"}(),function(){var e={524:0};n.O.j=function(t){return 0===e[t]};var t=function(t,l){var o,i,a=l[0],s=l[1],r=l[2],u=0;if(a.some((function(t){return 0!==e[t]}))){for(o in s)n.o(s,o)&&(n.m[o]=s[o]);if(r)var c=r(n)}for(t&&t(l);u<a.length;u++)i=a[u],n.o(e,i)&&e[i]&&e[i][0](),e[i]=0;return n.O(c)},l=self["webpackChunkyj520435_github_io"]=self["webpackChunkyj520435_github_io"]||[];l.forEach(t.bind(null,0)),l.push=t.bind(null,l.push.bind(l))}();var l=n.O(void 0,[504],(function(){return n(2858)}));l=n.O(l)})();
//# sourceMappingURL=app.268df709.js.map
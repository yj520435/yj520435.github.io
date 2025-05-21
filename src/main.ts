import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import 'highlight.js/lib/common';
import hljsVuePlugin from '@highlightjs/vue-plugin';

const pinia = createPinia();

createApp(App).use(pinia).use(hljsVuePlugin).mount('#app');

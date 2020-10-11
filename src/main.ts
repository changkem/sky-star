import { createApp } from 'vue';
import { mitt } from './utils';

import App from './App.vue';
import './index.less';

export const app = createApp(App);

app.config.globalProperties.mitt = mitt;

app.mount('#app');

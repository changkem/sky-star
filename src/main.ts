import Mitt from 'mitt';
import { createApp } from 'vue';
import App from './App.vue';
import './index.less';

export const app = createApp(App);

export const mitt = Mitt()

app.config.globalProperties.mitt = mitt

app.mount('#app');
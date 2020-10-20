import { createApp } from 'vue';
import { Button, Form } from 'ant-design-vue';
import { mitt } from '../packages/utils';

import App from './App.vue';
import 'ant-design-vue/dist/antd.css';
import './index.less';

export const app = createApp(App);

app.config.globalProperties.mitt = mitt;
app.use(Form);
app.use(Button);
app.mount('#app');

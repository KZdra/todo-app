import './assets/main.css'

import { createApp } from 'vue';
import pinia from './stores';
import App from './App.vue';
import router from './router';
import axios from './utils/axios'; // Ensure Axios configuration is imported

const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount('#app');

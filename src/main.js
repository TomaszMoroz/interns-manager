import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/global.css';

createApp(App)
  .use(router)
  .mount('#app');

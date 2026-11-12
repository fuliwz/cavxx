import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/jiujiu-theme.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
createApp(App).use(router).mount('#app')

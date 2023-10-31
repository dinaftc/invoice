import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import axios from 'axios'
axios.defaults.baseURL = import.meta.env.VITE_INVOICES

createApp(App).use(createPinia()).use(router).mount('#app')
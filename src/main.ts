import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'

// Import routes
import routes from './router'

// Create pinia store
const pinia = createPinia()

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Create app
const app = createApp(App)

// Use plugins
app.use(pinia)
app.use(router)

// Mount app
app.mount('#app')
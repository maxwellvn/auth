import './assets/simple.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// Firebase is initialized in the config file
import './firebase/config'

// Initialize the app with router
const app = createApp(App)
app.use(router)
app.mount('#app')

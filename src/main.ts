import { createApp } from 'vue'
import './style.css'
import HomePage from './views/HomePage.vue'
import router from './router'

createApp( HomePage )
    .use( router )
    .mount( '#app' )

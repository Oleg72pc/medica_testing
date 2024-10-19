import { createRouter, createWebHistory } from 'vue-router'
import HomePage from "../views/HomePage.vue"
import TestPage from "../views/TestPage.vue"
import StatisticsPage from "../views/StatisticsPage.vue"

const routes = [
    { path: '/', component: HomePage },
    { path: '/test', component: TestPage },
    { path: '/statistics', component: StatisticsPage }
]

const router = createRouter( {
    history: createWebHistory(),
    routes
} )

export default router

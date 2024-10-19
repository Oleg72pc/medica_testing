import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import TestPage from '../views/TestPage.vue'
import StatisticsPage from '../views/StatisticsPage.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/test',
        name: 'Test',
        component: TestPage
    },
    {
        path: '/statistics',
        name: 'Statistics',
        component: StatisticsPage
    }
]

const router = createRouter( {
    history: createWebHistory(),
    routes
} )

export default router

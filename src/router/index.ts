import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import TestPage from '../views/TestPage.vue'
import StatisticsPage from '../views/StatisticsPage.vue'
import CategorySelectionPage from '../views/CategorySelectionPage.vue'
import { CATEGORY_SELECTION_ROUTE, HOME_ROUTE, STATISTICS_ROUTE, TEST_ROUTE } from "../constants/routes"

const routes = [
    {
        path: HOME_ROUTE,
        name: "Home",
        component: HomePage,
    },
    {
        path: TEST_ROUTE,
        name: "Test",
        component: TestPage,
    },
    {
        path: STATISTICS_ROUTE,
        name: "Statistics",
        component: StatisticsPage,
    },
    {
        path: CATEGORY_SELECTION_ROUTE,
        name: "CategorySelection",
        component: CategorySelectionPage,
    },
]

const router = createRouter( {
    history: createWebHistory(),
    routes
} )

export default router

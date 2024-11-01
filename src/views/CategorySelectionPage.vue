<template>
	<div class="category-selection">
		<div class="top-container">
			<h2 class="category-selection__title">Выберите категорию:</h2>
			<div class="home-page"
           @click="goHome">
				<img class="home-img"
             src="../assets/home-white.svg"
             alt="home"/>
			</div>
		</div>
		<ul class="category-selection__list">
			<li class="category-selection__item"
          v-for="category in categories"
          :key="category"
          @click="selectCategory(category)">
				{{ category }}
			</li>
		</ul>
	</div>
</template>

<script setup
        lang="ts">
import { useRouter } from 'vue-router'
import { QuestionCategory } from '../types/QuestionCategory.enum'
import { HOME_ROUTE, TEST_ROUTE } from '../constants/routes'


const router = useRouter()
const categories = Object.values( QuestionCategory )

const selectCategory = ( category: string ) => {
  router.push( { path: TEST_ROUTE, query: { category } } )
}

const goHome = () => {
  router.push( HOME_ROUTE )
}
</script>

<style lang="scss"
       scoped>
@import '../styles/_variables.scss';

.category-selection {
  background-color: $background-color;
  color: $text-color;
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.top-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.home-page {
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: $primary-color;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.home-img {
  width: 28px;
  height: 28px;
}

.category-selection__title {
  color: $primary-color;
}

.category-selection__list {
  list-style-type: none;
  padding: 0;
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  box-shadow: inset 0 0 8px 0 $primary-half-transparent-color;
  border-radius: 10px;
}

.category-selection__item {
  padding: 10px 20px;
  margin: 10px;
  font-size: 1rem;
  color: $text-color;
  background-color: $primary-color;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: $button-hover-color;
  }
}
</style>
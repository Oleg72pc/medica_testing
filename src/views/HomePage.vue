<template>
  <div class="container">
    <div class="title">Тестирование</div>
    <div class="button-container">
    <button class="button-main"
            @click="startRandomTest">50 случайных вопросов
     <span class="img-container">
      <img class="img"
           src="../assets/cat.png"
           alt="cat">
    </span>
    </button>
    <button class="button"
            @click="startStandardTest">Все вопросы</button>
    <button class="button"
            @click="goToCategorySelection">Вопросы по категориям</button>
    <button class="button"
            @click="viewStatistics">Статистика</button>
  </div>

  </div>
</template>

<script setup
        lang="ts">
import { useRouter } from 'vue-router'
import {
  TEST_ROUTE,
  RANDOM_TEST_ROUTE,
  STATISTICS_ROUTE,
  CATEGORY_SELECTION_ROUTE
} from '../constants/routes'

const router = useRouter()

const startStandardTest = () => {
  router.push( TEST_ROUTE )
}

const startRandomTest = () => {
  router.push( RANDOM_TEST_ROUTE )
}

const viewStatistics = () => {
  router.push( STATISTICS_ROUTE )
}

const goToCategorySelection = () => {
  router.push( CATEGORY_SELECTION_ROUTE )
}

</script>

<style lang="scss"
       scoped>
@import '../styles/_variables.scss';

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: $background-color;
}

.title {
  font-size: 2rem;
  margin-bottom: 80px;
  color: $text-color;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: $background-color;
}

.button {
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

.button:disabled {
  background-color: #666;
  cursor: not-allowed;
  opacity: 0.6;
}

.button-main {
  padding: 10px 20px;
  margin: 10px;
  font-size: 1rem;
  color: $text-color;
  background-color: $primary-color;
  border: 1px solid white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  position: relative;

  &:hover {
    background-color: $button-hover-color;
  }
}

.button-main :disabled {
  background-color: #666;
  cursor: not-allowed;
  opacity: 0.6;
}


.img-container {
  position: absolute;
  top: -75px;
  left: 50%;
  transform: translateX(-50%);

  .img {
    width: 120px;
  }
}

</style>

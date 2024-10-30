<template>
  <div class="container">
    <h2 class="title">Тестирование</h2>
    <div class="button-container">
    <button class="button" @click="startRandomTest">50 случайных вопросов</button>
    <button class="button" @click="startStandardTest">Все вопросы</button>
    <button class="button" disabled="true" @click="goToCategorySelection">Вопросы по категориям (скоро)</button>
    <button class="button" @click="viewStatistics">Статистика</button>
  </div>
  </div>
</template>

<script setup
        lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const startStandardTest = () => {
  router.push( '/test' )
}

const startRandomTest = () => {
  router.push( '/test?random=true' )
}

const viewStatistics = () => {
  router.push( '/statistics' )
}

const goToCategorySelection = () => {
  router.push( '/category-selection' )
}

</script>

<style lang="scss" scoped>
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
  margin-bottom: 20px;
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

</style>

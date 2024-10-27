<template>
  <div class="statistics-container">
    <h2 class="statistics-title">Статистика:</h2>
    <p class="statistics-description">Список вопросов, на которые чаще всего давали неправильные ответы:</p>
    <ul class="statistics-list">
      <li v-for="(count, question) in sortedIncorrectAnswers"
          class="stat-item"
          :key="question">
        {{ question }} — {{ count }} раз(а) неправильно
      </li>
    </ul>
    <div class="statistics-button-container">
      <button class="statistics-button" @click="clearStatistics">Сбросить статистику</button>
      <button class="statistics-button" @click="goHome">На главную</button>
    </div>
  </div>
</template>

<script setup
        lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const incorrectAnswers = ref<Record<string, number>>( {} )
const router = useRouter()

onMounted( () => {
  loadStatistics()
} )

const loadStatistics = () => {
  const savedIncorrectAnswers = JSON.parse( localStorage.getItem( 'incorrectAnswers' ) || '{}' )
  incorrectAnswers.value = savedIncorrectAnswers
}

const sortedIncorrectAnswers = computed(() => {
  return Object.entries(incorrectAnswers.value)
    .sort(([, a], [, b]) => b - a)
    .reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {} as Record<string, number>)
})

const clearStatistics = () => {
  localStorage.removeItem( 'incorrectAnswers' )
  incorrectAnswers.value = {}
}

const goHome = () => {
  router.push( '/' )
}
</script>

<style lang="scss" scoped>
$background-color: #121212;
$text-color: #e0e0e0;
$primary-color: #48a2ec;
$button-hover-color: #3a8ecf; // Пример более темного цвета
$secondary-color: #03badade;

.statistics-container {
  background-color: $background-color;
  color: $text-color;
  padding: 20px;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.statistics-title {
  color: $secondary-color;
  margin-bottom: 5px;
}

.statistics-description {
  color: $text-color;
  margin-bottom: 10px;
}

.statistics-list {
  list-style-type: none;
  padding: 0;
  flex-grow: 1;
  overflow-y: auto;
}

.stat-item {
  margin-bottom: 10px;
  color: $text-color;
  border: 1px solid $secondary-color;
  border-radius: 5px;
  padding: 5px;
}

.statistics-button-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: $background-color;
  display: flex;
  justify-content: center;
  padding: 10px 0;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.2);
}

.statistics-button {
  padding: 10px 20px;
  margin: 0 10px;
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

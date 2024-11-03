<template>
  <div class="statistics-container">
    <div class="top-container">
      <h2 class="statistics-title">Статистика:</h2>
      <div class="home-page"
           @click="goHome">
        <img class="home-img"
             src="../assets/home-white.svg"
             alt="home"/>
      </div>
    </div>
      <p class="statistics-description">Список вопросов, на которые чаще всего давали неправильные ответы:</p>
      <ul class="statistics-list">
        <li v-for="(data, question) in sortedIncorrectAnswers"
            class="stat-item"
            :key="question">
          <span class="counter">{{ data.count }} раз(а) неправильно</span>
          <span class="question">Вопрос: {{ question }}</span>
          <span class="answer">Ответы: {{ Array.isArray(data.correctAnswers) ? data.correctAnswers.join(', ') : 'Нет данных' }}</span>
        </li>
      </ul>
      <div class="statistics-button-container">
        <button class="statistics-button"
                @click="clearStatistics">Сбросить статистику</button>
      </div>
    </div>
</template>

<script setup
        lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { HOME_ROUTE } from '../constants/routes'

const incorrectAnswers = ref<Record<string, { count: number, correctAnswers: string[] }>>({})
const router = useRouter()

onMounted( () => {
  loadStatistics()
} )

const loadStatistics = () => {
  incorrectAnswers.value = JSON.parse( localStorage.getItem( 'incorrectAnswers' ) || '{}' )
}

const sortedIncorrectAnswers = computed( () => {
  return Object.entries( incorrectAnswers.value )
      .sort( ( [ , a ], [ , b ] ) => b.count - a.count )
      .reduce( ( acc, [ key, value ] ) => {
        acc[ key ] = value
        return acc
      }, {} as Record<string, { count: number, correctAnswers: string[] }> )
} )

const clearStatistics = () => {
  localStorage.removeItem( 'incorrectAnswers' )
  incorrectAnswers.value = {}
}

const goHome = () => {
  router.push( HOME_ROUTE )
}
</script>

<style lang="scss"
       scoped>
@import '../styles/_variables.scss';

.statistics-container {
  background-color: $background-color;
  color: $text-color;
  padding: 20px;
  height: calc(100vh - 58px);
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

.statistics-title {
  color: $primary-color;
  margin-bottom: 5px;
}

.statistics-description {
  color: $text-color;
  margin-bottom: 10px;
}

.statistics-list {
  list-style-type: none;
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
  box-shadow: inset 0 0 8px 0 $primary-half-transparent-color;
  border-radius: 10px;
}

.stat-item {
  margin-bottom: 10px;
  color: $text-color;
  border: 1px solid $primary-color;
  border-radius: 5px;
  padding: 5px;
  display: flex;
  flex-direction: column;

  .counter {
    color: $primary-color;
    margin: 3px;
  }

  .question {
    margin: 3px;
  }

  .answer {
    color: $correct-color;
    margin: 3px;
  }
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
}

.statistics-button {
  padding: 10px 20px;
  margin: 0 10px;
  font-size: 1rem;
  color: $text-color;
  background-color: $incorrect-color;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: $incorrect-button-hover-color;
  }
}
</style>

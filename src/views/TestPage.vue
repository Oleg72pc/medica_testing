<template>
  <div v-if="isTestFinished" class="test-finished-container">
    <h2 class="test-finished-title">Тест завершен!</h2>
    <p class="test-summary">Вы ответили на {{ correctAnswers }} из {{ questions.length }} вопросов.</p>
    <p class="test-time">Время выполнения: {{ Math.floor(elapsedTime / 60) }} мин {{ elapsedTime % 60 }} сек</p>
    <h3 class="results-title">Результаты:</h3>
    <ul class="results-list">
      <li v-for="(question, index) in questions" :key="index" class="result-item">
        <p class="question-text">{{ question.question }}</p>
        <p class="answer-status">
          <span class="skip-res" v-if="userAnswers[index].length === 0">Пропущено</span>
          <span class="correct-res" v-else-if="isCorrectAnswer(index)">Правильно</span>
          <span class="incorrect-res" v-else>Неправильно</span>
        </p>
        <ul class="answers-list">
          <li v-for="(answer, answerIndex) in question.answers" :key="answerIndex" class="answer-option" :class="{ correct: question.correctIndexes?.includes(answerIndex), selected: userAnswers[index]?.includes(answerIndex) }">
            {{ answer }}
          </li>
        </ul>
      </li>
    </ul>
    <div class="buttons-container">
      <button class="restart-button" @click="restartTest">Начать заново</button>
      <button class="back-home-button" @click="goHome">На главную</button>
    </div>
  </div>

  <div class="questions-container" v-else-if="currentQuestion">
    <h2 class="question-title">Вопрос {{ currentIndex + 1 }} из {{ questions.length }}</h2>
    <div class="progress-bar">
      <div class="progress" :style="{ width: progressPercentage + '%' }"></div>
    </div>
    <h3 class="question-text">{{ currentQuestion.question }}</h3>
    <h4 class="question-category">Категория вопроса: {{ currentQuestion.category }}</h4>
    <p class="test-time">Время: {{ Math.floor(elapsedTime / 60) }} мин {{ elapsedTime % 60 }} сек</p>
    <ul class="answers-list">
      <li v-for="(answer, index) in currentQuestion.answers" :key="index" @click="toggleAnswer(index)" 
      class="answer-option" 
      :class="getAnswerClass(index)">
        {{ answer }}
      </li>
    </ul>
    <img v-if="isAnswered" :src="resultImage" alt="Result Image" class="result-image" />
    <div class="buttons-container">
      <button v-if="!isAnswered && hasSelectedAnswer" class="submit-button" @click="submitAnswer">Ответить</button>
      <button v-if="isAnswered" class="next-button" @click="nextQuestion">Следующий вопрос</button>
      <button v-if="!isAnswered" class="skip-button" @click="skipQuestion">Пропустить</button>
      <button class="back-home-button" @click="goHome">На главную</button>
    </div>
  </div>

  <div v-else class="loading-container">
    <p class="loading-text">Идет загрузка вопросов...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { questions as allQuestions } from '../data/questions'
import { Question } from "../interfaces/question.interface.ts"

import funnyImage from '../assets/answers/funny.svg'
import sadImage from '../assets/answers/sad.svg'

const route = useRoute()
const router = useRouter()
const currentIndex = ref(0)
const correctAnswers = ref(0)
const questions = ref<Question[]>([])
const userAnswers = ref<(number[])[]>([])
const elapsedTime = ref(0)
let timer: number | undefined

const isRandomTest = computed(() => route.query.random === 'true')
const currentQuestion = computed(() => questions.value[currentIndex.value])
const isAnswered = ref(false)
const isTestFinished = computed(() => currentIndex.value >= questions.value.length)

const progressPercentage = computed(() => ((currentIndex.value + 1) / questions.value.length) * 100)

const hasSelectedAnswer = computed(() => {
  return userAnswers.value[currentIndex.value]?.length > 0
})

const resultImage = computed(() => {
  if (!isAnswered.value) return ''
  return isCorrectAnswer(currentIndex.value) ? funnyImage : sadImage
})

const toggleAnswer = (index: number) => {
  if (isAnswered.value) {
    return
  }

  const selectedAnswers = userAnswers.value[currentIndex.value]
  const answerIndex = selectedAnswers.indexOf(index)
  if (answerIndex > -1) {
    selectedAnswers.splice(answerIndex, 1)
  } else {
    selectedAnswers.push(index)
  }
}

const submitAnswer = () => {
  if (isCorrectAnswer(currentIndex.value)) {
    correctAnswers.value++
  } else {
    saveIncorrectAnswer(currentQuestion.value.question)
  }
  isAnswered.value = true
}

const nextQuestion = () => {
  currentIndex.value++
  isAnswered.value = false
}

const getAnswerClass = (index: number) => {
  if (!currentQuestion.value || !currentQuestion.value.correctIndexes) {
    return {}
  }

  if (!isAnswered.value) {
    return {
      selected: isSelected(index),
    }
  } else {
    return {
      selected: isSelected(index),
      correct: currentQuestion.value.correctIndexes.includes(index),
      incorrect: isSelected(index) && !currentQuestion.value.correctIndexes.includes(index),
    }
  }
}

const skipQuestion = () => {
  userAnswers.value[currentIndex.value] = []
  nextQuestion()
}

const restartTest = () => {
  currentIndex.value = 0
  correctAnswers.value = 0
  userAnswers.value = Array(questions.value.length).fill([]).map(() => [])
  elapsedTime.value = 0
  startTimer()
}

const goHome = () => {
  router.push('/')
}

const isCorrectAnswer = (index: number) => {
  const selectedAnswers = userAnswers.value[index]
  const correctIndexes = questions.value[index].correctIndexes
  return (
    correctIndexes &&
    selectedAnswers.length === correctIndexes.length &&
    selectedAnswers.every((answer) => correctIndexes.includes(answer))
  )
}

const isSelected = (index: number) => {
  return userAnswers.value[currentIndex.value]?.includes(index)
}

const saveIncorrectAnswer = (questionText: string) => {
  const incorrectAnswers = JSON.parse(localStorage.getItem('incorrectAnswers') || '{}')
  incorrectAnswers[questionText] = (incorrectAnswers[questionText] || 0) + 1
  localStorage.setItem('incorrectAnswers', JSON.stringify(incorrectAnswers))
}

const startTimer = () => {
  timer = setInterval(() => {
    elapsedTime.value++
  }, 1000)
}

const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
  }
}

onMounted(() => {
  if (isRandomTest.value) {
    questions.value = allQuestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 50)
  } else {
    questions.value = allQuestions
  }
  userAnswers.value = Array(questions.value.length).fill([]).map(() => [])
  startTimer()
})

onUnmounted(() => {
  stopTimer()
})

watch(isTestFinished, (newValue) => {
  if (newValue) {
    stopTimer()
  }
})
</script>

<style lang="scss" scoped>
$background-color: #121212;
$text-color: #e0e0e0;
$primary-color: #48a2ec;
$secondary-color: #03badade;
$progress-color: #4caf50;
$button-hover-color: darken($primary-color, 10%);
$correct-color: #4caf50;
$incorrect-color: #f44336;
$skip-color: #ff9800;

.test-finished-container {
  background-color: $background-color;
  color: $text-color;
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.test-finished-title, .results-title, .question-title, .question-category {
  color: $text-color;
}

.test-summary, .answer-status, .loading-text {
  color: $text-color;

  .skip-res {
    color: $skip-color;
  }

  .correct-res {
    color: $correct-color;
  }

  .incorrect-res {
    color: $incorrect-color;
  }
}

.test-time {
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.results-list, .answers-list {
  list-style-type: none;
  padding: 0;
}

.result-item, .answer-option {
  margin-bottom: 10px;
  color: $text-color;
  border: 1px solid $text-color;
  padding: 10px;
  border-radius: 10px;
}

.answer-option {
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &.selected {
    background-color: $secondary-color;
  }

  &.correct {
    background-color: lighten($correct-color, 20%);
  }

  &.incorrect {
    background-color: darken($incorrect-color, 20%);
  }
}

.progress-bar {
  width: 100%;
  background-color: lighten($background-color, 10%);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 20px;
}

.progress {
  height: 10px;
  background-color: $progress-color;
  transition: width 0.3s ease;
}

button {
  padding: 5px 10px;
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

.buttons-container {
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

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.questions-container {
  background-color: $background-color;
  color: $text-color;
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

.question-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.question-text {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.question-category {
  font-size: 0.8rem;
  font-style: italic;
}

.answers-list {
  list-style-type: none;
  padding: 0;
}

.answer-option {
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &.selected {
    background-color: $secondary-color;
  }

  &.correct {
    background-color: lighten($correct-color, 20%);
  }

  &.incorrect {
    background-color: darken($incorrect-color, 20%);
  }
}

.result-image {
  display: block;
  margin: 20px auto;
  max-width: 100px;
  height: auto;
  background-color: $text-color;
  border-radius: 50%;
}
</style>


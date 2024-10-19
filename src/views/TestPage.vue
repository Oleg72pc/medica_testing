<template>
  <div v-if="currentQuestion">
    <h2>{{ currentQuestion.question }}</h2>
    <ul>
      <li v-for="(answer, index) in currentQuestion.answers"
          :key="index"
          @click="selectAnswer(index)"
          :class="{ correct: isAnswered && currentQuestion.correctIndexes.includes(index), incorrect: isAnswered && selectedAnswer === index && !currentQuestion.correctIndexes.includes(index) }">
        {{ answer }}
      </li>
    </ul>
    <button v-if="isAnswered"
            @click="nextQuestion">Следующий вопрос</button>
    <button v-else
            @click="skipQuestion">Пропустить</button>
  </div>
  <div v-else>
    <h2>Тест завершен!</h2>
    <p>Вы ответили на {{ correctAnswers }} из {{ questions.length }} вопросов.</p>
  </div>
</template>

<script setup
        lang="ts">
import { questions } from '../data/questions'
import { computed, ref } from "vue"


const currentIndex = ref( 0 )
const selectedAnswer = ref<number | null>( null )
const correctAnswers = ref( 0 )

const currentQuestion = computed( () => questions[ currentIndex.value ] )
const isAnswered = computed( () => selectedAnswer.value !== null )

const selectAnswer = ( index: number ) => {
  if ( !isAnswered.value ) {
    selectedAnswer.value = index
    // Проверяем, если выбранный индекс присутствует в массиве правильных ответов
    if ( currentQuestion.value.correctIndexes.includes( index ) ) {
      correctAnswers.value++
    }
  }
}

const nextQuestion = () => {
  selectedAnswer.value = null
  currentIndex.value++
}

const skipQuestion = () => {
  nextQuestion()
}

</script>

<style scoped>
.correct {
  color: green;
}

.incorrect {
  color: red;
}
</style>

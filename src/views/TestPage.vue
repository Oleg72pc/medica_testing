<template>
  <div v-if="isTestFinished">
    <h2>Тест завершен!</h2>
    <p>Вы ответили на {{ correctAnswers }} из {{ questions.length }} вопросов.</p>
    <h3>Результаты:</h3>
    <ul>
      <li v-for="(question, index) in questions"
          :key="index">
        <p>{{ question.question }}</p>
        <p>
          <span v-if="userAnswers[index] === null">Пропущено</span>
          <span v-else-if="question.correctIndexes.includes(userAnswers[index])">Правильно</span>
          <span v-else>Неправильно</span>
        </p>
        <ul>
          <li v-for="(answer, answerIndex) in question.answers"
              :key="answerIndex"
              :class="{
              correct: question.correctIndexes.includes(answerIndex),
              selected: userAnswers[index] === answerIndex
            }">
            {{ answer }}
          </li>
        </ul>
      </li>
    </ul>
    <button @click="restartTest">Начать заново</button>
    <button @click="goHome">На главную</button>
  </div>

  <div v-else-if="currentQuestion">
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
    <button @click="goHome">На главную</button>
  </div>
  <div v-else>
    <p>Идет загрузка вопросов...</p>
  </div>
</template>

<script setup
        lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { questions as allQuestions } from '../data/questions'

const route = useRoute()
const router = useRouter()
const currentIndex = ref( 0 )
const selectedAnswer = ref<number | null>( null )
const correctAnswers = ref( 0 )
const questions = ref( [] )
const userAnswers = ref<( number | null )[]>( [] )

const isRandomTest = computed( () => route.query.random === 'true' )
const currentQuestion = computed( () => questions.value[ currentIndex.value ] )
const isAnswered = computed( () => selectedAnswer.value !== null )
const isTestFinished = computed( () => currentIndex.value >= questions.value.length )

const selectAnswer = ( index: number ) => {
  if ( !isAnswered.value ) {
    selectedAnswer.value = index
    userAnswers.value[ currentIndex.value ] = index
    const isCorrect = currentQuestion.value.correctIndexes.includes( index )

    if ( isCorrect ) {
      correctAnswers.value++
    } else {
      saveIncorrectAnswer( currentQuestion.value.question )
    }
  }
}

const nextQuestion = () => {
  selectedAnswer.value = null
  currentIndex.value++
}

const skipQuestion = () => {
  userAnswers.value[ currentIndex.value ] = null
  nextQuestion()
}

const restartTest = () => {
  currentIndex.value = 0
  selectedAnswer.value = null
  correctAnswers.value = 0
  userAnswers.value = Array( questions.value.length ).fill( null )
}

const goHome = () => {
  router.push( '/' )
}

const saveIncorrectAnswer = ( questionText: string ) => {
  const incorrectAnswers = JSON.parse( localStorage.getItem( 'incorrectAnswers' ) || '{}' )
  incorrectAnswers[ questionText ] = ( incorrectAnswers[ questionText ] || 0 ) + 1
  localStorage.setItem( 'incorrectAnswers', JSON.stringify( incorrectAnswers ) )
}

onMounted( () => {
  if ( isRandomTest.value ) {
    questions.value = allQuestions
        .sort( () => Math.random() - 0.5 )
        .slice( 0, 10 )
  } else {
    questions.value = allQuestions
  }
  userAnswers.value = Array( questions.value.length ).fill( null )
} )

</script>

<style lang="scss"
       scoped>
.correct {
  color: green;
}

.incorrect {
  color: red;
}

.selected {
  font-weight: bold;
  text-decoration: underline;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

button {
  margin-top: 20px;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}
</style>

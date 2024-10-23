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
          <span class="skip-res" v-if="userAnswers[index].length === 0">Пропущено</span>
          <span class="correct-res" v-else-if="isCorrectAnswer(index)">Правильно</span>
          <span class="incorrect-res" v-else>Неправильно</span>
        </p>
        <ul>
          <li v-for="(answer, answerIndex) in question.answers"
              :key="answerIndex"
              class="answer-option"
              :class="{
              correct: question.correctIndexes?.includes(answerIndex),
              selected: userAnswers[index]?.includes(answerIndex)
            }">
            {{ answer }}
          </li>
        </ul>
      </li>
    </ul>
    <button @click="restartTest">Начать заново</button>
    <button class="back-home"
            @click="goHome">На главную</button>
  </div>

  <div class="questions-container" v-else-if="currentQuestion">
    <h2>Вопрос {{ currentIndex + 1 }} из {{ questions.length }}</h2>
    <h3 class="question">{{ currentQuestion.question }}</h3>
    <h4>Категория вопроса: {{ currentQuestion.category }}</h4>
    <ul>
      <li v-for="(answer, index) in currentQuestion.answers"
          :key="index"
          @click="toggleAnswer(index)"
          class="answer-option"
          :class="getAnswerClass(index)">
        {{ answer }}
      </li>
    </ul>
    <div>
      <button v-if="!isAnswered"
              @click="submitAnswer">Ответить</button>
      <button v-else
              @click="nextQuestion">Следующий вопрос</button>
      <button @click="skipQuestion">Пропустить</button>
      <button @click="goHome">На главную</button>
    </div>
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
import { Question } from "../interfaces/question.interface.ts"

const route = useRoute()
const router = useRouter()
const currentIndex = ref( 0 )
const correctAnswers = ref( 0 )
const questions = ref<Question[]>( [] )
const userAnswers = ref<( number[] )[]>( [] )

const isRandomTest = computed( () => route.query.random === 'true' )
const currentQuestion = computed( () => questions.value[ currentIndex.value ] )
const isAnswered = ref( false )
const isTestFinished = computed( () => currentIndex.value >= questions.value.length )

// Логика выбора ответа остаётся той же
const toggleAnswer = ( index: number ) => {
  if ( isAnswered.value ) {
    return // Блокируем выбор, если вопрос уже отвечен
  }

  const selectedAnswers = userAnswers.value[ currentIndex.value ]
  const answerIndex = selectedAnswers.indexOf( index )
  if ( answerIndex > -1 ) {
    selectedAnswers.splice( answerIndex, 1 ) // Удалить ответ, если уже выбран
  } else {
    selectedAnswers.push( index ) // Добавить ответ в выбранные
  }
}

// Логика проверки ответа
const submitAnswer = () => {
  // Проверяем правильность ответа
  if ( isCorrectAnswer( currentIndex.value ) ) {
    correctAnswers.value++
  } else {
    saveIncorrectAnswer( currentQuestion.value.question )
  }
  isAnswered.value = true // Пользователь ответил на вопрос
}

// Переход к следующему вопросу
const nextQuestion = () => {
  currentIndex.value++
  isAnswered.value = false // Сбрасываем состояние ответа для следующего вопроса
}

const getAnswerClass = ( index: number ) => {
  // Проверяем, существует ли текущий вопрос и его правильные ответы
  if ( !currentQuestion.value || !currentQuestion.value.correctIndexes ) {
    return {} // Возвращаем пустой объект, если данных нет
  }

  if ( !isAnswered.value ) {
    return {
      selected: isSelected( index ),
    }
  } else {
    return {
      selected: isSelected( index ),
      correct: currentQuestion.value.correctIndexes.includes( index ), // Подсвечиваем правильный ответ
      incorrect: isSelected( index ) && !currentQuestion.value.correctIndexes.includes( index ), // Подсвечиваем неправильный ответ
    }
  }
}

const skipQuestion = () => {
  userAnswers.value[ currentIndex.value ] = []
  nextQuestion()
}

const restartTest = () => {
  currentIndex.value = 0
  correctAnswers.value = 0
  userAnswers.value = Array( questions.value.length ).fill( [] ).map( () => [] )
}

const goHome = () => {
  router.push( '/' )
}

const isCorrectAnswer = ( index: number ) => {
  const selectedAnswers = userAnswers.value[ index ]
  const correctIndexes = questions.value[ index ].correctIndexes
  return (
      correctIndexes &&
      selectedAnswers.length === correctIndexes.length &&
      selectedAnswers.every( ( answer ) => correctIndexes.includes( answer ) )
  )
}

const isSelected = ( index: number ) => {
  return userAnswers.value[ currentIndex.value ]?.includes( index )
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
  userAnswers.value = Array( questions.value.length ).fill( [] ).map( () => [] )
} )

</script>

<style lang="scss"
       scoped>

//.selected {
//  background-color: #d3eafd; /* Голубая подсветка для выбранных */
//  color: #1a1a1a;
//}
//
//.correct {
//  background-color: #c8e6c9; /* Зелёная подсветка для правильных ответов */
//  color: #1a1a1a;
//}
//
//.incorrect {
//  background-color: #ffcdd2; /* Красная подсветка для неправильных ответов */
//  color: #1a1a1a;
//}
//
ul {
  list-style-type: none;
  padding: 0;
}

//
//li {
//  margin-bottom: 10px;
//}
//
//button {
//  margin-top: 20px;
//  padding: 10px;
//  background-color: #007bff;
//  color: #fff;
//  border: none;
//  cursor: pointer;
//}
</style>

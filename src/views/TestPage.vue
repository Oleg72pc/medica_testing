<template>
  <div v-if="currentQuestion">
    <h2>{{ currentQuestion.question }}</h2>
    <ul>
      <li
          v-for="(answer, index) in currentQuestion.answers"
          :key="index"
          @click="selectAnswer(index)"
          :class="{ correct: isAnswered && currentQuestion.correctIndexes.includes(index), incorrect: isAnswered && selectedAnswer === index && !currentQuestion.correctIndexes.includes(index) }"
      >
        {{ answer }}
      </li>
    </ul>
    <button v-if="isAnswered" @click="nextQuestion">Следующий вопрос</button>
    <button v-else @click="skipQuestion">Пропустить</button>
  </div>
  <div v-else>
    <h2>Тест завершен!</h2>
    <p>Вы ответили на {{ correctAnswers }} из {{ questions.length }} вопросов.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { questions as allQuestions } from '../data/questions';

const route = useRoute();
const currentIndex = ref(0);
const selectedAnswer = ref<number | null>(null);
const correctAnswers = ref(0);
const questions = ref([]);

const isRandomTest = computed(() => route.query.random === 'true');
const currentQuestion = computed(() => questions.value[currentIndex.value]);
const isAnswered = computed(() => selectedAnswer.value !== null);

const selectAnswer = (index: number) => {
  if (!isAnswered.value) {
    selectedAnswer.value = index;
    const isCorrect = currentQuestion.value.correctIndexes.includes(index);

    if (isCorrect) {
      correctAnswers.value++;
    } else {
      // Сохраняем информацию о неправильном ответе
      saveIncorrectAnswer(currentQuestion.value.question);
    }
  }
};

const nextQuestion = () => {
  selectedAnswer.value = null;
  currentIndex.value++;
};

const skipQuestion = () => {
  nextQuestion();
};

const saveIncorrectAnswer = (questionText: string) => {
  const incorrectAnswers = JSON.parse(localStorage.getItem('incorrectAnswers') || '{}');
  incorrectAnswers[questionText] = (incorrectAnswers[questionText] || 0) + 1;
  localStorage.setItem('incorrectAnswers', JSON.stringify(incorrectAnswers));
};

onMounted(() => {
  if (isRandomTest.value) {
    questions.value = allQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, 30);
  } else {
    questions.value = allQuestions;
  }
});

</script>

<style lang="scss" scoped>
.correct {
  color: green;
  font-weight: bold;
  animation: correctHighlight 0.5s ease-in-out;
}

.incorrect {
  color: red;
  font-weight: bold;
  animation: incorrectHighlight 0.5s ease-in-out;
}

@keyframes correctHighlight {
  from { background-color: transparent; }
  to { background-color: #c8e6c9; }
}

@keyframes incorrectHighlight {
  from { background-color: transparent; }
  to { background-color: #ffcdd2; }
}
</style>


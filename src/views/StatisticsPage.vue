<template>
  <div>
    <h2>Статистика</h2>
    <p>Список вопросов, на которые чаще всего давали неправильные ответы:</p>
    <ul>
      <li v-for="(count, question) in incorrectAnswers" :key="question">
        {{ question }} — {{ count }} раз(а) неправильно
      </li>
    </ul>
    <button @click="clearStatistics">Сбросить статистику</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const incorrectAnswers = ref<Record<string, number>>({});

onMounted(() => {
  loadStatistics();
});

const loadStatistics = () => {
  const savedIncorrectAnswers = JSON.parse(localStorage.getItem('incorrectAnswers') || '{}');
  incorrectAnswers.value = savedIncorrectAnswers;
};

const clearStatistics = () => {
  localStorage.removeItem('incorrectAnswers');
  incorrectAnswers.value = {};
};
</script>

<style lang="scss" scoped>
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
  background-color: #f00;
  color: #fff;
  border: none;
  cursor: pointer;
}
</style>

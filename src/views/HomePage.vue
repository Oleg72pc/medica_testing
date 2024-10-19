<template>
  <div>
    <h1>Добро пожаловать!</h1>
    <button @click="$router.push('/test')">Стандартный тест</button>
    <button @click="$router.push('/test')">30 случайных вопросов</button>
    <button @click="$router.push('/statistics')">Статистика</button>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
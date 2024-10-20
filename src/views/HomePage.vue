<template>
  <div class="container">
    <h2 class="title">Добро пожаловать!</h2>
    <button class="button"
            @click="startStandardTest">Стандартный тест</button>
    <button class="button"
            @click="startRandomTest">10 случайных вопросов</button>
    <button class="button"
            @click="viewStatistics">Статистика</button>
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

</script>

<template>
  <div class="home">
    <button 
      type="button"
      @click="router.push({
        name: 'Game'
      })"
    >
      Start
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

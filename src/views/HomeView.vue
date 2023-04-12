<template>
  <div class="home">
    <TheButton 
      outline
      @click="router.push({
        name: 'Game'
      })"
    >
      Играть
    </TheButton>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import TheButton from '@/components/ui/TheButton';

const router = useRouter()
</script>

<style lang="scss">
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;

  animation: scroll 70s linear infinite;
  background: url(~@/assets/background-menu.jpg);
  background-position: 300%;
  perspective: 1000px;
  perspective-origin: 50% 50%;

  &::before {
    content: '';

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;

    background: linear-gradient(-45deg, var(--blue-light), var(--green-light));
    mix-blend-mode: hard-light;
  }

  &::after {
    content: '';

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.4) inset;
    pointer-events: none;
  }
}

@keyframes scroll {
  100% {
    background-position: 0px -3000px;
  }
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>

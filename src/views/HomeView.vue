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
  background-position: 3000px;
  perspective: 1000px;
  perspective-origin: 50% 50%;

  
}

.home::before {
  content: '';

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;

  background-color: #07b107;
  mix-blend-mode: screen;
}

.home::after {
  content: '';

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;

  animation: gradient 15s ease infinite;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size:  400% 400%;
  
  mix-blend-mode: hard-light;
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

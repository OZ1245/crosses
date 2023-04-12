<template>
  <div class="game">
    <GameArea/>
  </div>
</template>

<script setup>
import GameArea from '@/components/GameArea.vue'
</script>

<style lang="scss">
.game {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(-45deg, var(--blue-light), var(--green-light));

  position: relative;

  &::after {
    content: '';

    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;

    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.4) inset;
  }
}
</style>
<template>
  <div class="game-area">
    <section class="game-area__grid">
      <template 
        v-for="(row, x) in matrix"
        :key="`row-${x}`"
      >
        <div 
          v-for="(cell, y) in row"
          :key="`cell-${y}`"
          class="game-area__cell"
        >
          <button 
            type="button"
            :disabled="currentMove === 'computer' || cell"
            :ref="`cell-${x}-${y}`"
            @click="onMark(x, y)"
          >
            {{ cell || 'ㅤ' }}
          </button>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup>
import { useSettings } from '@/libs/settings.js'
import { useMatrix } from '@/libs/matrix.js'

const { settings } = useSettings()
const {
  matrix,
  testMatrixAxis,
  testMatrixDiagonal
} = useMatrix()

let currentMove = settings.firstMove;

const onMark = (x, y) => {
  matrix[x][y] = settings.playerMark

  victoryConditionsCheck('player')
}

const victoryConditionsCheck = (mover) => {
  // 1. Победа по горизонтали
  if (testMatrixAxis({ mover })) {
    console.log('Победа по горизонтали!')
    return
  }

  // 2. Победа по вертикали
  if (testMatrixAxis({ mover, direction: 'vertical' })) {
    console.log('Победа по вертикали!')
    return
  }

  // 3. Победа по диагонали слева вниз
  if (testMatrixDiagonal({ mover })) {
    console.log('Победа по диагонали слева вниз')
    return
  }
  
  // 4. Победа по диагонали справа вниз
  if (testMatrixDiagonal({ mover, direction: 'toTop' })) {
    console.log('Победа по диагонали справа вниз!')
    return
  }

  if (mover === 'player') {
    currentMove = 'computer'
  }
}
</script>

<style lang="scss">
.game-area__grid {
  display: grid;
  grid-template-columns: repeat(var(--matrix-range), auto);
}
</style>

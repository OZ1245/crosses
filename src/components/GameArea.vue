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
            :disabled="currentMove === 'computer' && !cell"
            :ref="`cell-${x}-${y}`"
            @click="onMark(x, y)"
          >
            {{ cell || '-' }}
          </button>
        </div>
      </template>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const rules = {
  range: 3,
  playerMark: 'x',
  computerMark: 'o',
  difficulty: 0,
  firstMove: 'player',
}

// FIXME: Перенести в use создания и преобразований матрицы
const matrix = reactive(
  Array(rules.range)
  .fill()
  .map(() => Array(rules.range).fill())
); 

let currentMove = rules.firstMove;

const documentRoot = document.documentElement;
documentRoot.style.setProperty(
  "--matrix-range", 
  rules.range
);

const onMark = (x, y) => {
  matrix[x][y] = rules.playerMark

  checkWinnerCondition('player')
}

const checkWinnerCondition = (mover) => {
  // Проверка по осям
  const isWinnerViaLine = (m) => {
    const result = m.map(row => {
      return (row.filter(item => {
        if (mover === 'player') {
          return item === rules.playerMark
        }
        if (mover === 'computer') {
          return item === rules.computerMark
        }
      }).length === rules.range)
    })
    if (result.some(item => item)) {
      return true
    }
  }

  // Проверка по диагонали
  const isWinnerViaDiagonal = (m) => {
    let flags = []
    m.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (mover === 'player') {
          if (i === j && cell === rules.playerMark) {
            flags.push(true)
          }
        }
      })
    })
    if (flags.length === rules.range) {
      return true
    }
  }

  // FIXME: Перенести в use создания и преобразований матрицы
  // Траспонирование матрицы
  const transposedMatrix = () => {
    return matrix[0]
      .map((_, i) => matrix.map(row => row[i]))
  }

  // Отзеркаливание матрицы
  const mirroredMatrix = () => {
    return matrix
      .map(row => row.slice().reverse())
  }

  // 1. Победа по горизонтали
  if (isWinnerViaLine(matrix)) {
    console.log('Победа по горизонтали!')
    return
  }

  // 2. Победа по вертикали
  if (isWinnerViaLine(transposedMatrix())) {
    console.log('Победа по вертикали!')
    return
  }

  // 3. Победа по диагонали слева вниз
  if (isWinnerViaDiagonal(matrix)) {
    console.log('Победа по диагонали слева вниз')
    return
  }
  
  // 4. Победа по диагонали справа вниз
  if (isWinnerViaDiagonal(mirroredMatrix())) {
    console.log('Победа по диагонали справа вниз!')
    return
  }
}
</script>

<style lang="scss">
.game-area__grid {
  display: grid;
  grid-template-columns: repeat(var(--matrix-range), auto);
}
</style>

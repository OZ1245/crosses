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
            @click="debugMode && db__allowMoverPopup ? db__fShowCellPopup(x, y) : onMark(x, y)"
          >
            {{ cell || 'ㅤ' }}
          </button>

          <ul
            v-if="debugMode && db__allowMoverPopup"
            v-show="db__showCellPopup && (x === db__x && y === db__y)" 
            class="game-area__cell-popup"
          >
            <li 
              class="game-area__item"
              @click="db__onMark({
                coords: { x, y },
                mover: 'player'
              })"
            >
              player
            </li>
            <li 
              class="game-area__item"
              @click="db__onMark({
                coords: { x, y },
                mover: 'computer'
              })"
            >
              computer
            </li>
          </ul>
        </div>
      </template>
    </section>

    <section 
      v-if="debugMode"
      class="game-area__debug-actions-panel"
    >
      <button @click="db__onAllowMoverPopup()">
        Выбор хода: {{ db__allowMoverPopup ? 'вкл' : 'выкл' }}
      </button>

      <button @click="db__onResetGame()">
        Сброс
      </button>
    </section>
  </div>
</template>

<script setup>
import { watch, computed, ref } from 'vue'
import { useSettings } from '@/libs/settings.js'
import { useDebug } from '@/libs/debug.js'
import { useMatrix } from '@/libs/matrix.js'
import { useComputer } from '@/libs/computer.js'
import { useGameplay } from '@/libs/gameplay.js'

const { settings } = useSettings()
const { getMatrix } = useMatrix()
const { computerMove } = useComputer()
const gameplay = useGameplay()
const debug = useDebug()

// [DEBUG values]
const debugMode = debug.debugMode
let db__showCellPopup = ref(false)
let db__x = ref(0)
let db__y = ref(0)
let db__allowMoverPopup = computed(() => debug.getAllowMoverPopup())
// END [DEBUG values]

// Получение собранной матрицы для отрисовки
let matrix = computed(() => getMatrix())

// Наблюдатель передает ход компьютеру
let currentMove = computed(() => gameplay.getCurrentMove())
watch(currentMove, (val, old) => {
  if (val !== old && val === 'computer') {
    computerMove()
  }
})

// Инициализация педаставления первого хода
gameplay.changeMove(settings.firstMove)

// Метод установки маркера игроком
const onMark = (x, y) => {
  gameplay.setMark({
    mover: 'player',
    coords: { x, y }
  })
}

// [DEBUG methods]
// Показывает попап выбора, за кого ходить
const db__fShowCellPopup = (x, y) => {
  console.log('[debug] db__fShowCellPopup method | x:', x)
  console.log('[debug] db__fShowCellPopup method | y:', y)
  db__x.value = x
  db__y.value = y
  db__showCellPopup.value = true
}

// Метод установки маркера в дебаг-режиме
const db__onMark = ({ coords, mover }) => {
  console.log('[debug] db__onMark method | mover:', mover)
  console.log('[debug] db__onMark method | settings.computerMark:', settings.computerMark)
  db__showCellPopup.value = false

  gameplay.setMark({
    mover: mover,
    coords: coords
  })
}

// Проверка разрешения показывать дебаг-попап
const db__onAllowMoverPopup = () => {
  debug.allowMoverPopup(!db__allowMoverPopup.value)
}

// Сброс игры в дебг-режиме
const db__onResetGame = () => {
  console.log('[debug] Сброс игры')

  gameplay.resetGame()
}
// END [DEBUG methods]
</script>

<style lang="scss">
.game-area__grid {
  display: grid;
  grid-template-columns: repeat(var(--matrix-range), auto);
}

.game-area__cell {
  position: relative;
}

.game-area__cell-popup {
  display: block;
  width: auto;
  margin: 0;
  padding: 10px;
  list-style: none;

  background-color: white;
  border: 1px solid gray;

  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
  transform: translateY(100%);
}

.game-area__item {
  cursor: pointer;

  &:not(:last-child) {
    margin-bottom: 5px;
  }

  &:hover {
    color: red
  }
}
</style>

<template>
  <div class="game-area">
    <div class="game-area__wrapper">
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
              class="game-area__cell-button"

              @click="debugMode && db__allowMoverPopup ? db__fShowCellPopup($event, x, y) : onMark(x, y)"
            >
              {{ cell || 'ㅤ' }}
            </button>
          </div>
        </template>
      </section>

      <section 
        v-if="debugMode"
        class="game-area__debug-actions-panel"
      >
        <TheButton 
          @click="db__onResetGame()"
        >
          Сброс
        </TheButton>

        <TheButton 
          toggler
          :toggle-value="db__allowMoverPopup"
          outline
          @click="db__onAllowMoverPopup()"
        >
          Выбор хода
        </TheButton>

        <!-- Popup menu -->
        <PopupMenu
          v-if="debugMode && db__allowMoverPopup"
          v-model="db__showCellPopup"
          :coords="{
            x: db__popupX,
            y: db__popupY
          }"
          :menu-list="moverPopupMenuList"
        ></PopupMenu>
      </section>
    </div>
  </div>
</template>

<script setup>
import { watch, computed, ref } from 'vue'
import { useSettings } from '@/libs/settings.js'
import { useDebug } from '@/libs/debug.js'
import { useMatrix } from '@/libs/matrix.js'
import { useComputer } from '@/libs/computer.js'
import { useGameplay } from '@/libs/gameplay.js'

import TheButton from '@/components/ui/TheButton';
import PopupMenu from '@/components/ui/PopupMenu'

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
let db__popupX = ref(0)
let db__popupY = ref(0)
let db__allowMoverPopup = computed(() => debug.getAllowMoverPopup())
const moverPopupMenuList = [
  {
    title: 'Игрок',
    handler: () => {
      db__onMark({
        coords: { x: db__x.value, y: db__y.value },
        mover: 'player'
      }) 
    }
  },
  {
    title: 'Компьютер',
    handler: () => {
      db__onMark({
        coords: { x: db__x.value, y: db__y.value },
        mover: 'computer'
      })
    }
  }
]
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
const db__fShowCellPopup = ($event, x, y) => {
  console.log('[debug] db__fShowCellPopup method | x:', x)
  console.log('[debug] db__fShowCellPopup method | y:', y)
  db__x.value = x
  db__y.value = y
  db__popupX.value = $event.x
  db__popupY.value = $event.y
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
.game-area {
  width: 80%;
  height: 90%;
}
.game-area__wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.game-area__grid {
  display: grid;
  grid-template-columns: repeat(var(--matrix-range), auto);
  gap: 3%;
  height: 100%;
  aspect-ratio: 1;
}

.game-area__cell {
  aspect-ratio: 1/1;
}
.game-area__cell-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0;
  
  background-color: rgba(var(--white-rgb), .5);
  
  border-width: 3px;
  border-style: solid;
  border-color: transparent;
  border-radius: 4px;

  transition: border-color .3s;
  
  &:hover:not(:disabled) {
    border-color: var(--white);
    transition: border-color .15s;
    cursor: pointer;
  }

  &:disabled {
    background-color: transparent;
  }
}

// DEBUG
.game-area__debug-actions-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
}
</style>

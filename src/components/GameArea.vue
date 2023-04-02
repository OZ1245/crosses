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
            @click="route.query.debug && db__allowMoverPopup ? db__fShowCellPopup(x, y) : onMark(x, y)"
          >
            {{ cell || 'ㅤ' }}
          </button>

          <ul
            v-if="route.query.debug && db__allowMoverPopup"
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
      v-if="route.query.debug"
      class="game-area__debug-actions-panel"
    >
      <button @click="db__allowMoverPopup = !db__allowMoverPopup">
        Выбор хода: {{ db__allowMoverPopup ? 'вкл' : 'выкл' }}
      </button>

      <button @click="db__fResetGame()">
        Сброс
      </button>
    </section>
  </div>
</template>

<script setup>
import { watch, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useSettings } from '@/libs/settings.js'
import { useMatrix } from '@/libs/matrix.js'
import { useComputer } from '@/libs/computer.js'
import { useGameplay } from '@/libs/gameplay.js'

const route = useRoute()
const store = useStore()
const { settings } = useSettings()
const { 
  markCell,
  getMatrix
} = useMatrix()
const { computerMove } = useComputer()
const gameplay = useGameplay()

// [DEBUG values]
let db__showCellPopup = ref(false)
let db__x = ref(0)
let db__y = ref(0)
let db__allowMoverPopup = ref(false)
// END [DEBUG values]

let matrix = computed(() => getMatrix())

let currentMove = computed(() => store.getters['getCurrentMove'])
watch(currentMove, (val, old) => {
  if (val !== old && val === 'computer') {
    computerMove()
  }
})

store.dispatch('changeMove', settings.firstMove)
if (route.query.debug) {
  console.log('[debug] db__fShowCellPopup method | route:', route)
}

const onMark = (x, y) => {
  markCell({
    mark: settings.playerMark,
    coords: { x, y }
  })

  const result = gameplay.victoryConditionsCheck('player');
  if (result.victory) {
    gameplay.declareWinner('player')
  } else {
    store.dispatch('changeMove', 'computer')
  }
}

// [DEBUG methods]
const db__fShowCellPopup = (x, y) => {
  console.log('[debug] db__fShowCellPopup method | x:', x)
  console.log('[debug] db__fShowCellPopup method | y:', y)
  db__x.value = x
  db__y.value = y
  db__showCellPopup.value = true
}

const db__onMark = ({ coords, mover }) => {
  console.log('[debug] db__onMark method | mover:', mover)
  console.log('[debug] db__onMark method | settings.computerMark:', settings.computerMark)
  db__showCellPopup.value = false
  
  markCell({
    mark: (mover === 'player') ? settings.playerMark : settings.computerMark,
    coords: coords
  })

  const result = gameplay.victoryConditionsCheck(mover);
  if (result.victory) {
    gameplay.declareWinner(mover)
    console.warn(result.message)
  } else {
    if (route.query.dontPassMoveToComputer) {
      return
    }

    store.dispatch('changeMove', 'computer')
  }
}

const db__fResetGame = () => {
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

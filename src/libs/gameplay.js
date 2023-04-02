import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useMatrix } from '@/libs/matrix.js'

export function useGameplay() {
  const store = useStore()
  const route = useRoute()
  const {
    setMatrix,
    testMatrixAxis,
    testMatrixDiagonal,
  } = useMatrix()

  setMatrix()

  const victoryConditionsCheck = (mover) => {
    // 1. Победа по горизонтали
    if (testMatrixAxis({ mover })) {
      return {
        victory: true,
        message: 'Победа по горизонтали'
      }
    }

    // 2. Победа по вертикали
    if (testMatrixAxis({ mover, direction: 'vertical' })) {
      return {
        victory: true,
        message: 'Победа по вертикали'
      }
    }

    // 3. Победа по диагонали слева вниз
    if (testMatrixDiagonal({ mover })) {
      return {
        victory: true,
        message: 'Победа по диагонали'
      }
    }

    // 4. Победа по диагонали справа вниз
    if (testMatrixDiagonal({ mover, direction: 'toTop' })) {
      return {
        victory: true,
        message: 'Победа по диагонали'
      }
    }

    return {
      victory: false,
      message: null
    }
  }

  const checkFreeMovies = () => {
    let result = 0;

    const matrix = computed(() => store.getters['getMatrix']).value

    matrix.map(i => {
      i.map(j => {
        if (!j) {
          result++
        }
      })
    })

    return (result > 0)
  }

  const declareDraw = () => {
    if (route.query.debug) {
      const matrix = computed(() => store.getters['getMatrix']).value
      console.log('[debug] Победитель: Ничья')
      console.log('[debug] matrix:', matrix)
    }

    store.dispatch('setDraw')
    newGame()
  }

  const declareWinner = (winner) => {
    if (route.query.debug) {
      const matrix = computed(() => store.getters['getMatrix']).value
      console.log(`[debug] Победитель: ${winner}`)
      console.log('[debug] matrix:', matrix)
    }

    store.dispatch('setVictory', winner)
    newGame()
  }

  const resetGame = () => {
    if (route.query.debug) console.log('[debug] gameplay:resetGame()')

    setMatrix()
    store.dispatch('clearCurrentGameStat')
  }

  const newGame = () => {
    const gameState = computed(() => store.getters['getGameState']).value
    if (route.query.debug) console.warn(`[debug] gameplay:newGame() gameState:`, gameState)

    if (gameState) {
      alert(`
        Игра окончена! \n
        ${gameState === 'Ничья' ? 'Ничья' : `Победитель: ${gameState.winner}`}
      `)

      resetGame()
    } else {
      if (route.query.debug) console.warn(`[debug] Ошибка: игра продолжается`)
    }
  }

  return {
    victoryConditionsCheck,
    checkFreeMovies,
    declareDraw,
    declareWinner,
    resetGame
  }
}
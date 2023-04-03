import { computed } from 'vue'
import { useStore } from 'vuex'
import { useDebug } from '@/libs/debug.js'
import { useSettings } from '@/libs/settings.js'
import { useMatrix } from '@/libs/matrix.js'

export function useGameplay() {
  const store = useStore()
  const { settings } = useSettings()
  const matrix = useMatrix()
  const debug = useDebug()
  const debugMode = debug.debugMode

  // [debug] variables
  const db__getDontPassMoveToComputer = computed(() => debug.getDontPassMoveToComputer).value
  // [END] [debug] variables

  matrix.setMatrix()

  const setMark = ({ mover, coords }) => {
    if (debugMode) {
      console.log('[debug] gameplay:setMark() | Ставит маркер:', mover)
    }

    matrix.markCell({
      mark: (mover === 'player') ? settings.playerMark : settings.computerMark,
      coords: coords
    })

    const result = victoryConditionsCheck(mover);
    if (result.victory) {
      declareWinner({
        winner: mover,
        message: result.message
      })

      if (debugMode) {
        console.log('[debug] gameplay:setMark | Условие победы: ', result.message)
      }

      return;
    }

    if (debugMode && mover === 'player' && db__getDontPassMoveToComputer) {
      return;
    }

    store.dispatch('changeMove', mover === 'player' ? 'computer' : 'player')
  }

  const victoryConditionsCheck = (mover) => {
    // 1. Победа по горизонтали
    if (matrix.testMatrixAxis({ mover })) {
      return {
        victory: true,
        message: 'Победа по горизонтали'
      }
    }

    // 2. Победа по вертикали
    if (matrix.testMatrixAxis({ mover, direction: 'vertical' })) {
      return {
        victory: true,
        message: 'Победа по вертикали'
      }
    }

    // 3. Победа по диагонали слева вниз
    if (matrix.testMatrixDiagonal({ mover })) {
      return {
        victory: true,
        message: 'Победа по диагонали'
      }
    }

    // 4. Победа по диагонали справа вниз
    if (matrix.testMatrixDiagonal({ mover, direction: 'toTop' })) {
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
    if (debugMode) {
      const matrix = computed(() => store.getters['getMatrix']).value
      console.log('[debug] Победитель: Ничья')
      console.log('[debug] matrix:', matrix)
    }

    store.dispatch('setDraw')
    gameOver()
  }

  const declareWinner = (victory) => {
    if (debugMode) {
      const matrix = computed(() => store.getters['getMatrix']).value
      console.log(`[debug] Победитель: ${victory.mover}`)
      console.log('[debug] matrix:', matrix)
    }

    store.dispatch('setVictory', victory)
    gameOver()
  }

  const resetGame = () => {
    if (debugMode) console.log('[debug] gameplay:resetGame()')

    matrix.setMatrix()
    store.dispatch('clearCurrentGameStat')
  }

  const gameOver = () => {
    const gameState = computed(() => store.getters['getGameState']).value
    if (debugMode) console.log(`[debug] gameplay:newGame() gameState:`, gameState)

    if (gameState) {
      alert(`
        Игра окончена! \n
        ${gameState === 'Ничья' ? 'Ничья' : `Победитель: ${gameState.winner}`}
      `)

      resetGame()
    } else {
      if (debugMode) console.log(`[debug] Ошибка: игра продолжается`)
    }
  }

  return {
    setMark,
    victoryConditionsCheck,
    checkFreeMovies,
    declareDraw,
    declareWinner,
    resetGame
  }
}
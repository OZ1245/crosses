import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { useSettings } from '@/libs/settings.js'
import { useMatrix } from '@/libs/matrix.js'

export function useGameplay() {
  const store = useStore()
  const route = useRoute()
  const { settings } = useSettings()
  const matrix = useMatrix()
  const debug = route.query.debug

  matrix.setMatrix()

  const setMark = ({ mover, coords }) => {
    if (debug) {
      console.log('[debug] gameplay:setMark() | Ставит маркер:', mover)
    }

    matrix.markCell({
      mark: (mover === 'player') ? settings.playerMark : settings.computerMark,
      coords: coords
    })

    const result = victoryConditionsCheck(mover);
    if (result.victory) {
      declareWinner('player')

      if (debug) {
        console.log('[debug] gameplay:setMark | ', result.message)
      }
    } else {
      store.dispatch('changeMove', mover === 'player' ? 'computer' : mover)
    }

    // const result = gameplay.victoryConditionsCheck(mover);
    // if (result.victory) {
    //   gameplay.declareWinner(mover)
    //   console.warn(result.message)
    // } else {
    //   if (route.query.dontPassMoveToComputer) {
    //     return
    //   }

    //   store.dispatch('changeMove', 'computer')
    // }
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
    if (debug) {
      const matrix = computed(() => store.getters['getMatrix']).value
      console.log('[debug] Победитель: Ничья')
      console.log('[debug] matrix:', matrix)
    }

    store.dispatch('setDraw')
    newGame()
  }

  const declareWinner = (winner) => {
    if (debug) {
      const matrix = computed(() => store.getters['getMatrix']).value
      console.log(`[debug] Победитель: ${winner}`)
      console.log('[debug] matrix:', matrix)
    }

    store.dispatch('setVictory', winner)
    newGame()
  }

  const resetGame = () => {
    if (debug) console.log('[debug] gameplay:resetGame()')

    matrix.setMatrix()
    store.dispatch('clearCurrentGameStat')
  }

  const newGame = () => {
    const gameState = computed(() => store.getters['getGameState']).value
    if (debug) console.log(`[debug] gameplay:newGame() gameState:`, gameState)

    if (gameState) {
      alert(`
        Игра окончена! \n
        ${gameState === 'Ничья' ? 'Ничья' : `Победитель: ${gameState.winner}`}
      `)

      resetGame()
    } else {
      if (debug) console.log(`[debug] Ошибка: игра продолжается`)
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
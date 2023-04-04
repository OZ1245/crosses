import { computed } from 'vue'
import { useStore } from 'vuex'
import { useDebug } from '@/libs/debug.js'
import { useSettings } from '@/libs/settings.js'
import { useMatrix } from '@/libs/matrix.js'

/**
 * Библиотека управления геймплеем
 * @returns {Object} Публичные методы
 */
export function useGameplay() {
  const store = useStore()
  const { settings } = useSettings()
  const matrix = useMatrix()
  const debug = useDebug()
  
  // [debug] variables
  const debugMode = debug.debugMode
  const db__getDontPassMoveToComputer = computed(() => debug.getDontPassMoveToComputer).value
  // [END] [debug] variables

  /**
   * Проверка условий победы
   * @private
   * @param {String} mover Кто ходил
   * @returns {Object} Кто победил и как
   */
  const $_gameplay_victoryConditionsCheck = (mover) => {
    // Победа по горизонтали
    if (matrix.testMatrixAxis({ mover })) {
      return {
        victory: true,
        message: 'Победа по горизонтали'
      }
    }

    // Победа по вертикали
    if (matrix.testMatrixAxis({ mover, direction: 'vertical' })) {
      return {
        victory: true,
        message: 'Победа по вертикали'
      }
    }

    // Победа по диагонали слева вниз
    if (matrix.testMatrixDiagonal({ mover })) {
      return {
        victory: true,
        message: 'Победа по диагонали'
      }
    }

    // Победа по диагонали справа вниз
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

  // Инициализация матрицы
  matrix.setMatrix()

  // Получить, кто сейчас ходит
  const getCurrentMove = () => computed(() => store.getters['getCurrentMove']).value

  /**
   * Сменить того, кто ходит
   * @param {String} mover Кто ходит
   */
  const changeMove = (mover) => {
    store.dispatch('changeMove', mover)
  }

  /**
   * Установка маркера в ячейку
   * @param {String} mover Кто ходит 
   * @param {Object} coords Координаты { x, y } 
   */
  const setMark = ({ mover, coords }) => {
    if (debugMode) {
      console.log('[debug] gameplay:setMark() | Ставит маркер:', mover)
    }

    matrix.markCell({
      mark: (mover === 'player') ? settings.playerMark : settings.computerMark,
      coords: coords
    })

    const result = $_gameplay_victoryConditionsCheck(mover);
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

  /**
   * Проверка свободных ячеек
   * @returns {Boolean}
   */
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

  /**
   * Объявить ничью
   */
  const declareDraw = () => {
    if (debugMode) {
      const matrix = computed(() => store.getters['getMatrix']).value
      console.log('[debug] Победитель: Ничья')
      console.log('[debug] matrix:', matrix)
    }

    store.dispatch('setDraw')
    gameOver()
  }

  /**
   * Объявить победителя
   * @param {Object} victory Описание победителя 
   */
  const declareWinner = (victory) => {
    if (debugMode) {
      const matrix = computed(() => store.getters['getMatrix']).value
      console.log(`[debug] Победитель: ${victory.mover}`)
      console.log('[debug] matrix:', matrix)
    }

    store.dispatch('setVictory', victory)
    gameOver()
  }

  /**
   * Сброс игры
   */
  const resetGame = () => {
    if (debugMode) console.log('[debug] gameplay:resetGame()')

    matrix.setMatrix()
    store.dispatch('clearCurrentGameStat')
  }

  /**
   * Окончание игры
   */
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
    getCurrentMove,
    changeMove,
    setMark,
    checkFreeMovies,
    declareDraw,
    declareWinner,
    resetGame
  }
}
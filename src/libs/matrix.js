import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useDebug } from '@/libs/debug.js'
import { useSettings } from '@/libs/settings.js'

export function useMatrix() {
  const store = useStore()
  const { settings } = useSettings()
  const { debugMode } = useDebug()

  const documentRoot = document.documentElement
  documentRoot.style.setProperty(
    "--matrix-range",
    settings.range
  )

  // Траспонирование матрицы
  const $_matrix_transposedMatrix = () => {
    const matrix = computed(() => store.getters['getMatrix']).value

    return matrix[0]
      .map((_, i) => matrix.map(row => row[i]))
  }

  // Отзеркаливание матрицы
  const $_matrix_mirroredMatrix = () => {
    const matrix = computed(() => store.getters['getMatrix']).value

    return matrix
      .map(row => row.slice().reverse())
  }

  // Проверка по осям
  const testAxis = ({ mover, direction = 'horizontal' }) => {
    const matrix = computed(() => store.getters['getMatrix']).value

    const m = (direction === 'vertical') ? $_matrix_transposedMatrix() : matrix
    const mark = (mover === 'player') ? settings.playerMark : settings.computerMark

    const result = m.map(row => {
      return (row.filter(item => {
        return item === mark
      }).length === settings.range)
    })

    if (result.some(item => item)) {
      return true
    }
  }

  // Проверка по диагонали
  const testDiagonal = ({ mover, direction = 'toBottom' }) => {
    const matrix = computed(() => store.getters['getMatrix']).value

    const m = (direction === 'toTop') ? $_matrix_mirroredMatrix() : matrix
    const mark = (mover === 'player') ? settings.playerMark : settings.computerMark

    let flags = []
    m.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (i === j && cell === mark) {
          flags.push(true)
        }
      })
    })
    if (flags.length === settings.range) {
      return true
    }
  }

  const setMatrix = () => {
    const matrix = reactive(
      Array(settings.range)
        .fill()
        .map(() => Array(settings.range).fill())
    )
    
    store.dispatch('setMatrix', matrix)
  }

  const getMatrix = () => computed(() => store.getters['getMatrix']).value

  const markCell = ({ mark, coords }) => {
    store.dispatch('markCell', { mark, coords })
  }
  
  const checkCell = ({ x, y }) => {
    if (debugMode) console.log('[debug] matrix():checkCell coords:', { x, y })

    const matrix = computed(() => store.getters['getMatrix']).value

    if (debugMode) console.log('[debug] matrix():checkCell matrix[x][y]:', matrix[x][y])

    return !matrix[x][y]
  }

  return {
    setMatrix,
    getMatrix,
    markCell,
    testMatrixAxis: testAxis,
    testMatrixDiagonal: testDiagonal,
    checkMatrixCell: checkCell
  }
}
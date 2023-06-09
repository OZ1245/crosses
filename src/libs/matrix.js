import { reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useDebug } from '@/libs/debug.js'
import { useSettings } from '@/libs/settings.js'

/**
 * Библиотека управления матрицей (поля игры)
 * @returns {Object} Публичные методы
 */
export function useMatrix() {
  const store = useStore()
  const { settings } = useSettings()
  const { debugMode } = useDebug()

  // Инициализация css-переменных необходимых для отрисовки матрицы
  const documentRoot = document.documentElement
  documentRoot.style.setProperty(
    "--matrix-range",
    settings.range
  )

  /**
   * Траспонирование матрицы
   * @returns {Array} Повернутая матрица
   */
  const $_matrix_transposedMatrix = () => {
    const matrix = computed(() => store.getters['getMatrix']).value

    return matrix[0]
      .map((_, i) => matrix.map(row => row[i]))
  }

  /**
   * Отзеркаливание матрицы
   * @returns {Array} Перевернутая матрица
   */
  const $_matrix_mirroredMatrix = () => {
    const matrix = computed(() => store.getters['getMatrix']).value

    return matrix
      .map(row => row.slice().reverse())
  }

  /**
   * Проверка заполнености по осям
   * @param {String} mover Кто ходит
   * @param {String} direction В каком направлении проверять: horizontal, vertical 
   * @returns {Boolean} результат проверки
   */
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

  /**
   * Проверка по диагонали
   * @param {String} mover Кто ходит 
   * @param {String} direction В каком направлении проверять: toBottom, toTop 
   * @returns {Boolean} Результат проверки
   */
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

  /**
   * Инициализация пустой матрицы на остнове настроек
   */
  const setMatrix = () => {
    const matrix = reactive(
      Array(settings.range)
        .fill()
        .map(() => Array(settings.range).fill())
    )
    
    store.dispatch('setMatrix', matrix)
  }

  // Получить сгененрированную матрицу
  const getMatrix = () => computed(() => store.getters['getMatrix']).value

  /**
   * Установить маркер в ячейку
   * @param {String} mark Маркер
   * @param {Object} coords Координаты { x, y }
   */
  const markCell = ({ mark, coords }) => {
    store.dispatch('markCell', { mark, coords })
  }
  
  /**
   * Проверить ячейку
   * @param {Integer} Координата x 
   * @param {Integer} Координата y 
   * @returns {Boolean} Результат проверки 
   */
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
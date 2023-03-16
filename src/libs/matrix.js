import { reactive } from 'vue'
import { useSettings } from '@/libs/settings.js'

export function useMatrix() {
  const { settings } = useSettings()

  const documentRoot = document.documentElement
  documentRoot.style.setProperty(
    "--matrix-range",
    settings.range
  )

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

  // Проверка по осям
  const testMatrixAxis = ({ mover, direction = 'horizontal' }) => {
    const m = (direction === 'vertical') ? transposedMatrix() : matrix
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
  const testMatrixDiagonal = ({ mover, direction = 'toBottom' }) => {
    const m = (direction === 'toTop') ? mirroredMatrix() : matrix
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

  const matrix = reactive(
    Array(settings.range)
      .fill()
      .map(() => Array(settings.range).fill())
  );

  return {
    matrix,
    testMatrixAxis,
    testMatrixDiagonal
  }
}
import { useSettings } from '@/libs/settings.js'
import { useMatrix } from '@/libs/matrix.js'
import { useGameplay } from '@/libs/gameplay.js'

/**
 * Библиотека управления компьютерным соперником
 * @returns {Object} Публичные методы
 */
export function useComputer() {
  // const store = useStore()
  const { settings } = useSettings()
  const matrix = useMatrix()
  const gameplay = useGameplay()

  /**
   * Рандомайзер целых чисел на основе настроек матрицы
   * @private
   * @returns {Integer}
   */
  const $_computer_rand = () => {
    let r = 0 + Math.random() * (settings.range - 0)
    return Math.floor(r)
  }

  /**
   * Компьютер делает ход на основе настроек сложности:
   * 0 - Рандомные доступные ячейки
   * 1 - Ставить метку, чтобы победить
   * 2 - Ставит метку блокируя игрока
   */
  const move = () => {
    // Если есть свободные ходы
    if (gameplay.checkFreeMovies()) {
      // Задержка для того, чтобы игрок успел понять, что компьютер сходил
      setTimeout(() => {
        if (settings.difficulty === 0) {
          let x = $_computer_rand()
          let y = $_computer_rand()

          const result = matrix.checkMatrixCell({ x, y })
          if (result) {
            gameplay.setMark({
              mover: 'computer',
              coords: { x, y }
            })
          } else {
            move()
          }
        }
      }, 500)
    } else {
      // Если свободных ходов нет, объявить ничью
      gameplay.declareDraw()
    }
  }

  return {
    computerMove: move
  }
}
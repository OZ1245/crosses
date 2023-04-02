// import { nextTick } from 'vue'
// import { useStore } from 'vuex'
import { useSettings } from '@/libs/settings.js'
import { useMatrix } from '@/libs/matrix.js'
import { useGameplay } from '@/libs/gameplay.js'

export function useComputer() {
  // const store = useStore()
  const { settings } = useSettings()
  const matrix = useMatrix()
  const gameplay = useGameplay()

  const rand = () => {
    let r = 0 + Math.random() * (settings.range - 0)
    return Math.floor(r)
  }

  const move = () => {
    if (gameplay.checkFreeMovies()) {
      setTimeout(() => {
        if (settings.difficulty === 0) {
          let x = rand()
          let y = rand()

          const result = matrix.checkMatrixCell({ x, y })
          if (result) {
            gameplay.setMark({
              mover: settings.computerMark,
              coords: { x, y }
            })
          } else {
            move()
          }
        }
      }, 1000)
    } else {
      gameplay.declareDraw()
    }
  }

  return {
    computerMove: move
  }
}
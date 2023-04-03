import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export function useDebug() {
  const store = useStore()
  const route = useRoute()
  
  const debugMode = route.query.debug

  // Разрешить попап выбора хода
  const getAllowMoverPopup = () => computed(() => store.getters['debug/allowMoverPopup']).value

  const allowMoverPopup = (value) => {
    store.dispatch('debug/allowMoverPopup', value)
  }
  // [END] Разрешить попап выбора хода

  // Не передавать ход компьютеру
  const getDontPassMoveToComputer = computed(() => store.getters['debug/dontPassMoveToComputer']).value
  
  const dontPassMoveToComputer = (value) => {
    store.dispatch('debug/dontPassMoveToComputer', value)
  }
  // [END] Не передавать ход компьютеру
  
  return {
    debugMode,
    getAllowMoverPopup,
    allowMoverPopup,
    getDontPassMoveToComputer,
    dontPassMoveToComputer
  }
}
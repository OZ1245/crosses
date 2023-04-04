import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

/**
 * Библиотека управления дебаг-режимом
 * @returns {Object} Публичные методы
 */
export function useDebug() {
  const store = useStore()
  const route = useRoute()
  
  const debugMode = route.query.debug

  // Разрешить попап выбора хода
  const getAllowMoverPopup = () => computed(() => store.getters['debug/allowMoverPopup']).value

  const allowMoverPopup = (value) => {
    store.dispatch('debug/allowMoverPopup', value)
  }

  // Не передавать ход компьютеру
  const getDontPassMoveToComputer = computed(() => store.getters['debug/dontPassMoveToComputer']).value
  
  const dontPassMoveToComputer = (value) => {
    store.dispatch('debug/dontPassMoveToComputer', value)
  }
  
  return {
    debugMode,
    getAllowMoverPopup,
    allowMoverPopup,
    getDontPassMoveToComputer,
    dontPassMoveToComputer
  }
}
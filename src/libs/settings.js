import { computed } from 'vue'
import { useStore } from 'vuex'

/**
 * Библиотека управления настройками
 * @returns {Object} Публичные методы
 */
export function useSettings() {
  const store = useStore()

  // Настройки
  const settings = computed(() => store.getters['getSettings']).value

  return {
    settings
  }
}
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

export function useDebug() {
  const store = useStore()
  const route = useRoute()
  
  const debugMode = route.query.debug

  const getAllowMoverPopup = () => (
    computed(() => store.getters['debug/allowMoverPopup']).value
  )

  const allowMoverPopup = (value) => {
    store.dispatch('debug/allowMoverPopup', value)
  }
  
  return {
    debugMode,
    getAllowMoverPopup,
    allowMoverPopup
  }
}
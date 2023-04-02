export default ({
  state: () => ({
    allowMoverPopup: false
  }),
  getters: {
    allowMoverPopup: ({ allowMoverPopup }) => (
      allowMoverPopup || false
    )
  },
  mutations: {
    SET_ALLOW_MOVER_POPUP(state, data) {
      state.matrix = data
    },
  },
  actions: {
    allowMoverPopup({ commit }, value) {
      commit('SET_ALLOW_MOVER_POPUP', value)
    }
  },
})

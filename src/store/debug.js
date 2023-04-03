export default ({
  state: () => ({
    allowMoverPopup: false,
    dontPassMoveToComputer: false,
  }),
  getters: {
    allowMoverPopup: ({ allowMoverPopup }) => (
      allowMoverPopup || false
    ),

    dontPassMoveToComputer: ({ dontPassMoveToComputer }) => (
      dontPassMoveToComputer || false
    )
  },
  mutations: {
    SET_ALLOW_MOVER_POPUP(state, data) {
      state.allowMoverPopup = data
    },

    SET_DONT_PASS_MOVE_TO_COMPUTER(state, data) {
      state.dontPassMoveToComputer = data
    }
  },
  actions: {
    allowMoverPopup({ commit }, value) {
      commit('SET_ALLOW_MOVER_POPUP', value)
    },

    dontPassMoveToComputer({ commit }, value) {
      commit('SET_DONT_PASS_MOVE_TO_COMPUTER', value)
    }
  },
})

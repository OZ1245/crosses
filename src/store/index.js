import { createStore } from 'vuex'

export default createStore({
  state: () => ({
    settings: {
      range: 3,
      playerMark: 'x',
      computerMark: 'o',
      difficulty: 0,
      firstMove: 'player',
    }
  }),
  getters: {
    getSettings: ({ settings }) => (
      settings || null
    )
  },
  mutations: {
    // TODO:
  },
  actions: {
  },
  modules: {
  }
})

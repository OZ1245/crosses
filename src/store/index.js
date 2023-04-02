import { createStore } from 'vuex'

export default createStore({
  state: () => ({
    settings: {
      range: 3,
      playerMark: 'x',
      computerMark: 'o',
      difficulty: 0,
      firstMove: 'player',
    },
    matrix: [],
    currentMove: '',
    victory: null,
    isDraw: false
  }),
  getters: {
    getSettings: ({ settings }) => (
      settings || null
    ),

    getMatrix: ({ matrix }) => (
      matrix || []
    ),

    getCurrentMove: ({ currentMove }) => (
      currentMove || ''
    ),

    getGameState: ({ isDraw, victory }) => (
      // isDraw || victory || null
      isDraw ? 'Ничья' : victory || null
    )
  },
  mutations: {
    SET_MATRIX(state, data) {
      state.matrix = data
    },

    SET_MARK(state, { mark, coords }) {
      const { x, y } = coords
      state.matrix[x][y] = mark
    },

    SET_CURRENT_MOVE(state, data) {
      state.currentMove = data
    },

    SET_VICTORY(state, data) {
      state.victory = data
    },

    SET_DRAW(state) {
      state.isDraw = true
    },

    CLEAR_VICTORY(state) {
      state.victory = null
    },

    CLEAR_DRAW(state) {
      state.isDraw = false
    }
  },
  actions: {
    setMatrix({ commit }, matrix) {
      commit('SET_MATRIX', matrix)
    },

    markCell({ commit }, { mark, coords }) {
      commit('SET_MARK', { mark, coords })
    },

    changeMove({ commit }, mover) {
      commit('SET_CURRENT_MOVE', mover)
    },

    setVictory({ commit }, winner) {
      commit('SET_VICTORY', { winner })
    },

    setDraw({ commit }) {
      commit('SET_DRAW')
    },

    clearCurrentGameStat({ commit, getters }) {
      commit('CLEAR_VICTORY')
      commit('CLEAR_DRAW')
      commit('SET_CURRENT_MOVE', getters.getSettings.firstMove)
    }
  },
  modules: {
  }
})

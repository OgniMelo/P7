import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    apiURL: process.env.VUE_APP_API,
    games: process.env.VUE_APP_GAMES.split(';'),
    user: {},
    upvotes: [],
    usersList: [],
    search: ''
  },
  getters: {
  },
  mutations: {
    SET_LOGIN_STATE(state, newLoginState) {
      state.isLoggedIn = newLoginState
    },
    SET_USER(state, user) {
      state.user = user
    },
    SET_UPVOTES(state, upvotes) {
      state.upvotes = upvotes
    },
    ADD_UPVOTE(state, postid) {
      state.upvotes.push({ postid })
    },
    DELETE_UPVOTE(state, postid) {
      state.upvotes.splice(state.upvotes.findIndex(elem => elem.id === postid), 1)
    },
    SET_USERS_LIST(state, usersList) {
      state.usersList = usersList
    },
    SET_SEARCH(state, search) {
      state.search = search
    }
  },
  actions: {
    changeLoginState({ commit }, newLoginState) {
      commit('SET_LOGIN_STATE', newLoginState)
    },
    setUser({ commit }, user) {
      commit('SET_USER', user)
    },
    setUpvotes({ commit }, upvotes) {
      commit('SET_UPVOTES', upvotes)
    },
    addUpvote({ commit }, postid) {
      commit('ADD_UPVOTE', postid)
    },
    deleteUpvote({ commit }, postid) {
      commit('DELETE_UPVOTE', postid)
    },
    setUserList({ commit }, userList) {
      commit('SET_USERS_LIST', userList)
    },
    setSearch({ commit }, search) {
      commit('SET_SEARCH', search)
    }
  },
  modules: {
  }
})
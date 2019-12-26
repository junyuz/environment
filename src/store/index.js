import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: sessionStorage.getItem("user")
      ? JSON.parse(sessionStorage.getItem("user"))
      : null || "",
    mapObj: {},
    isPark: false
  },
  mutations: {
    LOGIN(state, payload) {
      state.user = payload;
    },
    LOGOUT() {
      sessionStorage.removeItem("user");
    },
    STORAGE(state, payload) {
      state.mapObj = payload;
    },
    CHANGE(state) {
      state.isPark = !state.isPark;
    }
  },
  getters: {
    getCurrentUser(state) {
      return state.user;
    }
  },
  actions: {},
  modules: {}
});

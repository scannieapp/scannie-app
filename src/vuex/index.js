import Vue from "vue";
import Vuex from "vuex";

import UserStore from "./stores/user_store";
import DocumentStore from "./stores/document_store";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    UserStore,
    DocumentStore
  }
});

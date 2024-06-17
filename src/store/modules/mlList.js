import Cookies from "js-cookie";
const state = {
    mlList:[],
}
const mutations = {
    SET_ML_LIST: (state, list) => {
        state.mlList = list
    },
}

const actions = {
    setMlList({
        commit,
    }, list) {
        commit('SET_ML_LIST', list);
        // Cookies.set('imgList', list)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
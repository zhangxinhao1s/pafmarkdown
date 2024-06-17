import Cookies from "js-cookie";
const state = {
    sbNode:'',
}
const mutations = {
    SET_SB_NODE: (state, val) => {
        state.sbNode = val
    },
}

const actions = {
    setSbNode({
        commit,
    }, val) {
        commit('SET_SB_NODE', val);
        // Cookies.set('imgList', list)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
import Cookies from "js-cookie";
const state = {
    wjscFlag:'',
}
const mutations = {
    SET_WJSC_FLAG: (state, val) => {
        state.wjscFlag = val
    },
}

const actions = {
    setWjscFlag({
        commit,
    }, val) {
        commit('SET_WJSC_FLAG', val);
        // Cookies.set('imgList', list)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
import Cookies from "js-cookie";
const state = {
    clFlag:'',
}
const mutations = {
    SET_CL_FLAG: (state, val) => {
        state.clFlag = val
    },
}

const actions = {
    setClFlag({
        commit,
    }, val) {
        commit('SET_CL_FLAG', val);
        // Cookies.set('imgList', list)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
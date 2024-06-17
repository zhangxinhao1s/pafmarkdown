import Cookies from "js-cookie";
const state = {
    imgList: [],
}
const mutations = {
    SET_IMG_LIST: (state, list) => {
        state.imgList = list
    },
}

const actions = {
    setImgList({
        commit,
    }, list) {
        commit('SET_IMG_LIST', list);
        // Cookies.set('imgList', list)
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
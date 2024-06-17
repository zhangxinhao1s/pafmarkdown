import Cookies from 'js-cookie';

const state = {
    headImg: sessionStorage.getItem('headImgId') || '',
    undoTotal: 0,
    doneClueId: '',
};

const mutations = {
    SET_HEAD_IMG: (state, head) => {
        state.headImg = head;
    },
    setUndoTotal: (state, data) => {
        state.undoTotal = data;
    },
    plusUndoTotal: (state, data) => {
        state.undoTotal += data;
    },
    reduceUndoTotal: (state, data) => {
        state.undoTotal -= 1;
    },
    setDoneClueId: (state, data) => {
        state.doneClueId = data;
    },
};
const actions = {
    setHeadImg({
        commit,
    }, head) {
        commit('SET_HEAD_IMG', head);
        Cookies.set('headImg', head);
        sessionStorage.setItem('headImg', head);
    },
};
export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
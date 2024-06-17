import Cookies from "js-cookie";
const state = {
    userInfo: Cookies.get('userInfo') || '',
    qyInfo: Cookies.get('qyInfo') || '',
    tokenInfo: Cookies.get('tokenInfo') || '',
    aesKeyInfo: Cookies.get('aesKeyInfo') || ''
}
const mutations = {
    SET_USER_INFO: (state, user) => {
        state.userInfo = user
    },
    CLEAR_USER_INFO: (state, user) => {
        state.userInfo = user
    },
    SET_QY_INFO: (state, qy) => {
        state.qyInfo = qy
    },
    CLEAR_QY_INFO: (state, qy) => {
        state.qyInfo = qy
    },
    SET_TOKEN_INFO: (state, token) => {
        state.tokenInfo = token
    },
    CLEAR_TOKEN_INFO: (state, token) => {
        state.tokenInfo = token
    },
    SET_AESKEY_INFO: (state, aesKey) => {
        state.aesKeyInfo = aesKey
    },
    CLEAR_AESKEY_INFO: (state, aesKey) => {
        state.aesKeyInfo = aesKey
    },
}

const actions = {
    setUserIfo({
        commit,
    }, user) {
        commit('SET_USER_INFO', user);
        Cookies.set('userInfo', user)
    },
    clearUserInfo({
        commit,
    }) {
        commit('CLEAR_USER_INFO');
        Cookies.set('userInfo', '')
    },
    setQyIfo({
        commit,
    }, qy) {
        commit('SET_QY_INFO', qy);
        Cookies.set('qyInfo', qy)
    },
    clearQyIfo({
        commit,
    }) {
        commit('CLEAR_QY_INFO');
        Cookies.set('QyIfo', '')
    },
    setTokenInfo({
        commit,
    }, token) {
        commit('SET_TOKEN_INFO', token)
        Cookies.set('tokenInfo', token)
        sessionStorage.setItem('tokenInfo', token)
    },
    clearTokenInfo({
        commit,
    }) {
        commit('CLEAR_TOKEN_INFO')
        Cookies.set('tokenInfo', '')
        sessionStorage.removeItem('tokenInfo')
    },
    setAesKeyInfo({
        commit,
    }, aesKey) {
        commit('SET_AESKEY_INFO', aesKey)
        Cookies.set('aesKeyInfo', aesKey)
        sessionStorage.setItem('aesKeyInfo', aesKey)
    },
    clearAesKeyInfo({
        commit,
    }) {
        commit('CLEAR_AESKEY_INFO')
        Cookies.set('aesKeyInfo', '')
        sessionStorage.removeItem('aesKeyInfo')
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
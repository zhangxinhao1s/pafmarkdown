const state = {
    fullscreenLodaing: false,  // 设置loading是否显示
    neddloading: 0,  // 分局是否为0来判断是否关闭loading
};

const mutations = {
    gbfullscreenLodaing(state) {
        state.fullscreenLodaing = true; //loading显示
    },
    gbfullscreenLodainga(state) {
        state.fullscreenLodaing = false; //loading关闭
    },
    show(state) { // 每请求一次加一
        state.neddloading++;
    },
    hide(state) { // 每完成请求一次减一
        state.neddloading--
    },
};

export default {
    namespaced: true,
    state,
    mutations,
};
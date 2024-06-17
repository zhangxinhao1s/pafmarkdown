import Cookies from 'js-cookie';

const state = {
    needTagView: false,
    fixedHeader: true,
    menuBarMode: 'vertical',
    menuBgStyle: 'light',
    showSettings: false,
    themeColor: '',
    sidebar: {
        opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : false, //sidebarStatus 1:true, 0:false
        withoutAnimation: false,
    },
    isLogin:false,
    isAddRouter:false,
};

const mutations = {
    TOGGLE_SIDEBAR: (state) => {
        state.sidebar.opened = !state.sidebar.opened;
        state.sidebar.withoutAnimation = false;
        if (state.sidebar.opened) {
            Cookies.set('sidebarStatus', 1);
        } else {
            Cookies.set('sidebarStatus', 0);
        }
    },
    TOGGLE_MENU_MODE: (state, mode) => {
        state.menuBarMode = mode;
    },
    TOGGLE_MENU_STYLE: (state, style) => {
        state.menuBgStyle = style;
    },
    CHANGE_THEME: (state, theme) => {
        state.themeColor = theme;
    },
    CHANGE_IS_ADD_ROUTER:(state,isAddRouter) => {
        state.isAddRouter = isAddRouter;
    },
    CHANGE_IS_LOGIN:(state,isLogin) => {
        state.isLogin = isLogin;
    },
    // SET_ROUTERS:(state,routers) => {
    //     state.routers = routers;
    // }
};

const actions = {
    toggleSideBar({
        commit
    }) {
        commit('TOGGLE_SIDEBAR');
    },
    toggleMenuMode({
        commit
    }, mode) {
        commit('TOGGLE_MENU_MODE', mode);
    },
    toggleMenuStyle({
        commit
    }, style) {
        commit('TOGGLE_MENU_STYLE', style);
    },
    changeTheme({
        commit
    }, theme) {
        commit('CHANGE_THEME', theme);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
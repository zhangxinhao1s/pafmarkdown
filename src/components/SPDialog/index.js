import spDiaolog from "./SPDialog.vue"
const diaologPlugin = {
    install(vue) {
        // 注册全局组件
        vue.component(spDiaolog.name, spDiaolog)
    }
}

export default diaologPlugin;
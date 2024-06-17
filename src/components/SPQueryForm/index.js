import searchForm from "./searchForm.vue";
const searchFormPlugin = {
    install(vue) {
        // 注册全局组件
        vue.component(searchForm.name, searchForm)
    }
}

export default searchFormPlugin;
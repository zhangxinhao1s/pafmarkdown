import SPPagination from './SPPaginationSize.vue'

const paginationPlugin = {
    install(vue) {
        // 注册全局组件
        vue.component(SPPagination.name, SPPagination)
    }
}

export default paginationPlugin;
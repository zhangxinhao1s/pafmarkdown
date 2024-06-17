
import CLTree from './CLTree.vue'

const treePlugin = {
    install(vue) {
        // 注册全局组件
        vue.component(CLTree.name, CLTree)
    }
}

export default treePlugin;

import hoverTree from './hoverTree'

const treePlugin = {
    install(vue) {
        // 注册全局组件
        vue.component(hoverTree.name, hoverTree)
    }
}

export default treePlugin;

import CDTree from './CDTree'

const treePlugin = {
    install(vue) {
        // 注册全局组件
        vue.component(CDTree.name, CDTree)
    }
}

export default treePlugin;
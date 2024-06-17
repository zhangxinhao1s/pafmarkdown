
import SPTree from './SPTree'

const treePlugin = {
  install (vue) {
    // 注册全局组件
    vue.component(SPTree.name,SPTree)
  }
}

export default treePlugin;
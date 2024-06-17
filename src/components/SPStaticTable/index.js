
import SPStaticTable from './SPStaticTable'

const staticTablePlugin = {
  install (vue) {
    // 注册全局组件
    vue.component(SPStaticTable.name,SPStaticTable)
  }
}

export default staticTablePlugin;
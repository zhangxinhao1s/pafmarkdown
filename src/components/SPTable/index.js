
import SPTableColumn from './sp-table-column'
import SPTable from './sp-table'

const tablePlugin = {
  install (vue) {
    // 注册全局组件
    vue.component(SPTable.name,SPTable)
    vue.component(SPTableColumn.name,SPTableColumn)
  }
}

export default tablePlugin;
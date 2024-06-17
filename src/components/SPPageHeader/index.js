
import SPPageHeader from './SPPageHeader'

const pageHeaderPlugin = {
  install (vue) {
    // 注册全局组件
    vue.component(SPPageHeader.name,SPPageHeader)
  }
}

export default pageHeaderPlugin;
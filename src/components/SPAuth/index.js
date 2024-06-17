
import SPAuth from './SPAuth'

const authPlugin = {
  install (vue) {
    // 注册全局组件
    vue.component(SPAuth.name,SPAuth)
  }
}

export default authPlugin;
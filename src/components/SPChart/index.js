
import SPChart from './SPChart'

const chartPlugin = {
  install (vue) {
    // 注册全局组件
    vue.component(SPChart.name,SPChart)
  }
}

export default chartPlugin;
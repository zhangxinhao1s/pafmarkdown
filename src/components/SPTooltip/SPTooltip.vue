<template>
    <el-tooltip
      class="item"
      effect="light"
      :disabled="!isShowTooltip"
      :content="content"
      placement="top"
    >
      <div class="over-flow text-over" :class="className" @mouseover="onMouseover(refName)">
        <span :ref="refName">{{ content || "" }}</span>
      </div>
    </el-tooltip>
</template>

<script>
export default {
  name: "SPTooltip",
  props: {
    content: {
      type: String,
      default: () => {
        return "";
      },
    },
    className: { //内容的父级需要指定一个宽度，当内容大于等于此宽度是则显示tooltip
      type: String,
      default: () => {
        return "";
      },
    },
    refName: { //需要指定唯一一个引用
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {
      isShowTooltip: false,
    };
  },
  methods: {
    onMouseover(str) {
      let parentWidth = this.$refs[str].parentNode.offsetWidth;
      let contentWidth = this.$refs[str].offsetWidth;
      // console.log('parentWidth==',parentWidth);
      // console.log('contentWidth==',contentWidth);
      this.isShowTooltip = contentWidth >= parentWidth;
    },
  },
};
</script>

<style lang="less" scoped>
.over-flow {
  
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
}

</style>
<template>
  <div class="content">
    <div class="left" :class="{ 'active': putleftTrue, 'isactive': putrightTrue }">
      <div class="putaway" v-if="putleftTrue">
        <div class="putawayl" @click="putleftTrue = false">
          <img src="../../../assets/icons/putitAwayrig.png" alt="">展开
        </div>
        <ul>
          <li v-for="(item, index) in editableTabs" :key="item.name" @click="open(item)">
            {{ item.title }}
          </li>
        </ul>
      </div>
      <div class="custom-icons" v-show="!putleftTrue">
        <div class="custom-icon" @click="moveTab('left')">
          <img src="../../../assets/icons/leftmove.png" alt="">移动
        </div>
        <div class="custom-icon" @click="putAwayTab('left')">
          <img src="../../../assets/icons/putitAwayle.png" alt="">收起
        </div>
      </div>
      <el-tabs v-show="!putleftTrue" v-model="editableTabsValue" @tab-remove="removeTab">
        <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="item.name"
          :label="item.title"
          :closable="item.closable"
          :name="item.name"
        >
          <electronicFile v-if="item.value === 'electronicFile'" :title="item.title" :content="item.content"></electronicFile>
          <documentFile v-if="item.value === 'documentFile'" :title="item.title" :content="item.content"></documentFile>
          <markingRecord v-if="item.value === 'markingRecord'" :title="item.title" :content="item.content"></markingRecord>
          <caseReview v-if="item.value === 'caseReview'" :title="item.title" :content="item.content"></caseReview>
          <intelligentQuestion v-if="item.value === 'intelligentQuestion'" :title="item.title" :content="item.content"></intelligentQuestion>
          <caseCard v-if="item.value === 'caseCard'" :title="item.title" :content="item.content"></caseCard>
          <document v-if="item.value === 'document'" :title="item.title" :content="item.content"></document>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="center"></div>
    <div class="right" :class="{ 'active': putrightTrue, 'isactive': putleftTrue }">
      <div class="putaway" v-if="putrightTrue">
        <div class="putawayl" @click="putrightTrue = false">
          <img src="../../../assets/icons/putitAwayle.png" alt="">展开
        </div>
        <ul>
          <li v-for="(item, index) in editableTabt" :key="item.name" @click="open(item)">
            {{ item.title }}
          </li>
        </ul>
      </div>
      <div class="custom-icons" v-show="!putrightTrue">
        <div class="custom-icon" @click="moveTab('right')">
          <img src="../../../assets/icons/rightmove.png" alt="">移动
        </div>
        <div class="custom-icon" @click="putAwayTab('right')">
          <img src="../../../assets/icons/putitAwayrig.png" alt="">收起
        </div>
      </div>
      <el-tabs v-show="!putrightTrue" v-model="editableTabsValuet"  @tab-remove="removeTabs">
        <el-tab-pane
          v-for="(item, index) in editableTabt"
          :key="item.name"
          :label="item.title"
          :name="item.name"
          :closable="item.closable"
        >
          <electronicFile v-if="item.value === 'electronicFile'" :title="item.title" :content="item.content"></electronicFile>
          <documentFile v-if="item.value === 'documentFile'" :title="item.title" :content="item.content"></documentFile>
          <markingRecord v-if="item.value === 'markingRecord'" :title="item.title" :content="item.content"></markingRecord>
          <caseReview v-if="item.value === 'caseReview'" :title="item.title" :content="item.content"></caseReview>
          <intelligentQuestion v-if="item.value === 'intelligentQuestion'" :title="item.title" :content="item.content"></intelligentQuestion>
          <caseCard v-if="item.value === 'caseCard'" :title="item.title" :content="item.content"></caseCard>
          <document v-if="item.value === 'document'" :title="item.title" :content="item.content"></document>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import electronicFile from '../../components/electronicFile.vue'
import documentFile from '../../components/documentFile.vue'
import markingRecord from '../../components/markingRecord.vue'
import caseReview from '../../components/caseReview.vue'
import intelligentQuestion from '../../components/intelligentQuestion.vue'
import caseCard from '../../components/caseCard.vue'
import document from '../../components/document.vue'

export default {
  name: 'MainLayout',
  components: {
    electronicFile,
    documentFile,
    markingRecord,
    caseReview,
    intelligentQuestion,
    caseCard,
    document,
  },
  props: {
    titileName: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    titileName: function(newVal, oldVal) {
      this.addTab(newVal);
    }
  },
  data() {
    return {
      editableTabsValue: '1',
      editableTabsValuet: '1',
      putleftTrue: false,
      putrightTrue: false,
      editableTabs: [
        {
          title: '电子卷宗',
          name: '1',
          content: 'electronicFile',
          value: 'electronicFile',
          closable: false
        },
        {
          title: '文书卷宗',
          name: '2',
          content: 'documentFile',
          value: 'documentFile',
          closable: false
        }
      ],
      editableTabt: [
        {
          title: '阅卷笔录',
          name: '1',
          content: 'markingRecord',
          value: 'markingRecord',
          closable: true
        }
      ],
      tabIndex: 2,
      tabIndexs: 3,
    }
  },
  methods: {
    // 添加标签
    addTab(val) {
      if (this.editableTabs.some(item => {
        if (item.value === val.value) {
          this.editableTabsValue = item.name;
        }
        return item.title === val.name;
      })) {
        return;
      }
      if (this.editableTabt.some(item => {
        if (item.value === val.value) {
          this.editableTabsValuet = item.name;
        }
        return item.title === val.name;
      })) {
        return;
      }
      let newTabName = ++this.tabIndexs + '';
      this.editableTabt.push({
        title: val.name,
        name: newTabName,
        closable: true,
        value: val.value
      });
      this.editableTabsValuet = newTabName;
    },
    // 移动标签
    moveTab(val) {
      if (val === 'left') {
        // 从左侧标签列表移动到右侧标签列表
        const tab = this.editableTabs.find(item => item.name === this.editableTabsValue);
        if (tab) {
          this.editableTabs = this.editableTabs.filter(item => item.name !== tab.name);
          // 确保移动后的标签名称唯一
          tab.name = ++this.tabIndexs + '';
          this.editableTabt.push(tab);
          this.editableTabsValuet = tab.name;
          this.editableTabsValue = this.editableTabs[0].name;
        }
      } else {
        // 从右侧标签列表移动到左侧标签列表
        const tab = this.editableTabt.find(item => item.name === this.editableTabsValuet);
        if (tab) {
          this.editableTabt = this.editableTabt.filter(item => item.name !== tab.name);
          // 确保移动后的标签名称唯一
          tab.name = ++this.tabIndex + '';
          this.editableTabs.push(tab);
          this.editableTabsValue = tab.name;
          this.editableTabsValuet = this.editableTabt[0].name;
        }
      }
    },
    // 收起标签
    putAwayTab(val) {
      val === 'left' ? this.putleftTrue = true : this.putrightTrue = true;
    },
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    },
    removeTabs(targetName) {
      let tabs = this.editableTabt;
      let activeName = this.editableTabsValuet;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.editableTabsValuet = activeName;
      this.editableTabt = tabs.filter(tab => tab.name !== targetName);
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100%;
  display: flex;
  .left, .right {
    width: 50%;
    height: 100%;
    position: relative;
    padding: 15px;
    .putaway {
      width: 30px;
      height: 100%;
      text-align: center;
      line-height: 20px;
      font-size: 15px;
      color: #096DD9;
      border-right: 1px solid #409EFF;
      background: #fff;
      .putawayl {
        cursor: pointer;
        border-bottom: 1px solid #409EFF;
        padding-bottom: 10px;
      }
      ul {
        width: 30px;
        padding: 0;
        li {
          width: 30px;
          padding: 5px;
          text-align: center;
          border-bottom: 1px solid #eee;
          cursor: pointer;
        }
      }
    }
    .putawayr {
      position: absolute;
      right: -30px;
      width: 40px;
      top: 20px;
      margin: auto;
      height: 20px;
      text-align: center;
      border-radius: 0px 10px 10px 0px;
      line-height: 20px;
      font-size: 13px;
      background: #999;
      left: -30px;
    }
    .custom-icons {
      position: absolute;
      right: 10px;
      top: 26px;
      font-size: 13px;
      display: flex;
      z-index: 10;
      justify-content: flex-end;
      margin-bottom: 10px;
      .custom-icon {
        display: inline-block;
        cursor: pointer;
        margin-right: 10px;
        display: flex;
        align-items: center;
        img {
          width: 14px;
          height: 14px;
          margin-right: 3px;
        }
        color: #409EFF; /* 自定义图标颜色 */
      }
    }
  }
  .center {
    height: 100%;
    width: 1px;
    border-left: 1px solid rgb(166, 166, 253);
  }
  /deep/.el-tabs,/deep/.el-tabs__content,/deep/.el-tab-pane{
  height: 100%;
 }
 /deep/.el-tabs__header{
  margin: 0;
 }
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item .el-icon-close {
    width: 14px;
  }
  /deep/ .el-tabs--card > .el-tabs__header .el-tabs__item.is-closable:hover {
    padding: 0 20px;
  }
  .active {
    width: 30px !important;
    padding: 0 !important;
  }
  .isactive {
    width: calc(100% - 30px) !important;
  }
}
/deep/.el-tabs__nav-wrap{
  padding: 0 115px 0px 20px;
}
/deep/.el-tabs__nav-next{
  right: 100px;
}
</style>

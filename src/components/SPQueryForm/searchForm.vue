<template>
  <div class="search-form">
    <div class="search-page">
      <el-form
        :size="size"
        inline
        class="input-form"
        :class="isShow ? '' : 'list-from'"
      >
        <el-form-item
          v-for="item in searchForm"
          :key="item.label"
          :label="item.label"
          :label-width="item.labelWidth"
        >
          <el-input
            v-if="item.type === 'input'"
            v-model.trim="searchData[item.prop]"
            :size="size || item.size"
            :style="{ width: item.width }"
            :placeholder="item.placeholder"
            @change="item.change && item.change(that, searchData[item.prop])"
            :disabled="item.disabled && item.disabled(searchData[item.prop])"
            clearable
          ></el-input>
          <el-select
            v-if="item.type === 'select'"
            v-model="searchData[item.prop]"
            :size="size || item.size"
            :style="{ width: item.width }"
            :placeholder="item.placeholder"
            @change="item.change && item.change(that, searchData[item.prop])"
            :disabled="item.disabled && item.disabled(searchData[item.prop])"
            clearable
          >
            <el-option
              v-for="op in item.options"
              :key="op.dictCode"
              :disabled="op.status === '03'"
              :label="op.dictName"
              :value="op.dictCode"
            ></el-option>
          </el-select>
          <el-select
            v-if="item.type === 'selectLabel'"
            v-model="searchData[item.prop]"
            :size="size || item.size"
            :style="{ width: item.width }"
            :placeholder="item.placeholder"
            @change="item.change && item.change(that, searchData[item.prop])"
            :disabled="item.disabled && item.disabled(searchData)"
            clearable
          >
            <el-option
              v-for="op in item.options"
              :key="op.value"
              :label="op.label"
              :value="op.value"
            ></el-option>
          </el-select>
          <!-- 单选 -->
          <el-radio-group
            v-if="item.type === 'radio'"
            v-model="searchData[item.prop]"
            :size="size || item.size"
            :style="{ width: item.width }"
            @change="item.change(that, searchData[item.prop])"
            :disabled="item.disabled && item.disabled(searchData[item.prop])"
          >
            <el-radio
              v-for="ra in item.radios"
              :label="ra.value"
              :key="ra.value"
            >
              {{ ra.label }}
            </el-radio>
          </el-radio-group>
          <!-- 单选按钮 -->
          <el-radio-group
            v-if="item.type === 'radioButton'"
            v-model="searchData[item.prop]"
            :size="size || item.size"
            :style="{ width: item.width }"
            @change="item.change(that, searchData[item.prop])"
            :disabled="item.disabled && item.disabled(searchData[item.prop])"
          >
            <el-radio-button
              v-for="ra in item.radios"
              :label="ra.value"
              :key="ra.value"
            >
              {{ ra.label }}
            </el-radio-button>
          </el-radio-group>
          <!-- 复选框 -->
          <el-checkbox-group
            v-if="item.type === 'checkbox'"
            v-model="searchData[item.prop]"
            :size="size || item.size"
            :style="{ width: item.width }"
            @change="item.change(that, searchData[item.prop])"
            :disabled="item.disabled && item.disabled(searchData[item.prop])"
          >
            <el-checkbox
              v-for="ch in item.checkboxs"
              :label="ch.value"
              :key="ch.value"
            >
              {{ ch.label }}
            </el-checkbox>
          </el-checkbox-group>
          <!-- 日期 -->
          <el-data-picker
            v-if="item.type === 'date'"
            v-model="searchData[item.prop]"
            :size="size || item.size"
            :style="{ width: item.width }"
            :disabled="item.disabled && item.disabled(searchData[item.prop])"
            :placeholder="item.placeholder"
            value-format="yyyy-MM-dd"
            :picker-options="item.pickerOptions"
            :clearable="item.clearable"
          >
          </el-data-picker>
          <!-- 时间 -->
          <el-time-select
            v-if="item.type === 'time'"
            v-model="searchData[item.prop]"
            type
            :size="size || item.size"
            @change="item.change(that, searchData[item.prop])"
            :style="{ width: item.width }"
            :disabled="item.disabled && item.disabled(searchData[item.prop])"
            :placeholder="item.placeholder"
          ></el-time-select>
          <!-- 日期时间 -->
          <el-date-picker
            v-if="item.type === 'dateTime'"
            v-model="searchData[item.prop]"
            type="datetime"
            :size="size || item.size"
            @change="item.change(that, searchData[item.prop])"
            :style="{ width: item.width }"
            :disabled="item.disabled && item.disabled(searchData[item.prop])"
            :placeholder="item.placeholder"
          ></el-date-picker>
          <el-date-picker
            v-if="item.type === 'dateSection'"
            v-model="searchData[item.prop]"
            :type="item.showType"
            class="selectHeader"
            :size="size || item.size"
            :range-separator="item.range || '-'"
            :start-placeholde="item.startPlaceholder"
            :end-placeholde="item.endPlaceholder"
            :picker-options="item.pickerOptions"
            :format="item.showFormat"
            :value-format="item.valFormat"
            :unlink-panels="item.unlink"
            :style="{ width: item.width }"
            :clearable="item.clearable"
          ></el-date-picker>
          <el-switch
            v-if="item.type === 'switch'"
            v-model="searchData[item.prop]"
            :size="size || item.size"
            @change="item.change(that, searchData[item.prop])"
            :style="{ width: item.width }"
            :disabled="item.disabled && item.disabled(searchData[item.prop])"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div class="button-list">
        <el-button
          v-for="(item, idx) in searchHandle"
          :key="item.label"
          :class="idx === 0 ? 'q_btn' : 'ml_12'"
          :type="item.type || type"
          :size="item.size || size"
          @click="item.handle(that)"
          >{{ item.label }}</el-button
        >
        <span
          class="high-search"
          @click="isShow = !isShow"
          v-show="searchForm.length > 3"
          >更多</span
        >
        <i
          v-show="searchForm.length > 3"
          class="el-icon-d-arrow-left icon-search"
          @click="isShow = !isShow"
          :class="isShow ? '' : 'icon-rotate'"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SP-QueryForm",
  props: {
    that: {
      type: Object,
      default: this,
    },
    isHandle: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "small",
    },
    searchForm: {
      type: Array,
      default: () => [],
    },
    searchHandle: {
      type: Array,
      default: () => [],
    },
    searchData: {
      type: Array,
      default: () => {},
    },
  },
  data() {
    return {
      isShow: false,
    };
  },
};
</script>

<style lang="less" scoped>
.search-form {
  background: #fff;
  position: relative;
  &::after {
    content: " ";
    display: block;
    width: 100%;
    height: 16px;
    background-color: @nav-bgc;
  }
  .search-page {
    display: flex;
    padding: 16px 24px 0px 24px;
  }
  .input-form {
    flex: 1;
    overflow: hidden;
    /deep/.el-form-item {
      margin-bottom: 16px;
    }
  }
  .list-from {
    /deep/.el-form-item:nth-child(n + 4) {
      display: none;
    }
  }
  .button-list {
    .high-search {
      color: #3581fd;
      margin-left: 16px;
      cursor: pointer;
      font-size: 14px;
    }
    .icon-search {
      color: #3581fd;
      margin-left: 6px;
      transform: rotate(90deg);
      cursor: pointer;
      font-size: 14px;
    }
    .icon-rotate {
      transform: rotate(270deg);
    }
  }
}
// 表单中查询按钮
/deep/.el-button.el-button--small.el-button--primary.q_btn {
  min-width: 65px;
  height: 32px;
}
</style>
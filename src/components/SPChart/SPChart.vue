<template>
  <div ref="chart" :style="{ height: height, width: width }" />
</template>

<script>
import * as echarts from "echarts/core";
import { GridComponent, TooltipComponent,LegendComponent,TitleComponent} from "echarts/components";
import { LineChart, BarChart, PieChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  GridComponent,
  TooltipComponent,
  LineChart,
  BarChart,
  PieChart,
  CanvasRenderer,
  UniversalTransition,
  LegendComponent,
  TitleComponent,
]);

import resize from "@/utils/mixins/resize";
export default {
  name: "SPChart",
  mixins: [resize],
  props: {
    height: {
      type: String,
      default: "280px",
    },
    width: {
      type: String,
      default: "100%",
    },
    option: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  watch: {
    option: {
      deep: true,
      handler(newVal) {
        this.setOption(newVal);
      },
    },
  },
  mounted() {
    this.initEcharts();
  },
  methods: {
    initEcharts() {
      this.chart = echarts.init(this.$refs.chart);
      this.chart.setOption(this.option);
      this.chart.on("click", this.handleClick);
    },
    handleClick(params) {
      this.$emit("click", params);
    },
    setOption(option) {
      this.clearChart();
      if (this.chart) {
        this.chart.setOption(option);
      }
    },
    refresh() {
      this.setOption(this.option);
    },
    clearChart() {
      this.chart && this.chart.clear();
    },
  },
};
</script>

<style>
</style>
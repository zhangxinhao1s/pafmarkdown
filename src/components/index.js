import Vue from 'vue';
import SPDialog from './SPDialog';
import SPPagination from './SPPagination';
import SPQueryForm from './SPQueryForm';
import SPUpload from './SPUpload';
import SPTable from './SPTable'
import SPTree from './SPTree'
import CDTree from './CDTree'
import SPStaticTable from './SPStaticTable'
import SPPageHeader from './SPPageHeader'
import SPChart from './SPChart'
import SPAuth from './SPAuth'
import CLTree from './CLTree'
const GlobalComponents = [
  SPDialog,
  SPPagination,
  SPQueryForm,
  SPUpload,
  SPTable,
  SPTree,
  CDTree,
  SPStaticTable,
  SPPageHeader,
  SPChart,
  SPAuth,
  CLTree
];

GlobalComponents.forEach((item) => {
  Vue.use(item);
});
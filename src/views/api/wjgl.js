import { get, post } from '@/network/request'
// import { upload } from '@/network/http'
const SERVE = '/szjz'
const SERVE2 = '/fzba'
const biz = '/base'
// 获取数字卷宗目录和文件
export const cataloguefile = data => post(`${SERVE}/open/get/szjzMlwj`, data);
// 获取数字卷宗目录结构
export const catalogueTree = data => post(`${SERVE}/open/get/szjzTree`, data);
// 获取数字卷宗目录文件的PDF
export const cataloguePdf = data => post(`${SERVE}/open/get/jzmlwjPdf`, data);


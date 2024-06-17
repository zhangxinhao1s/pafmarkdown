import { get, post, upload, download } from '@/network/request'

const SERVE = '/wjgl-service'
const SERVE2 = '/szjz'
// 字典下拉值
export const dictgetDictOptions
    = data => get(`${SERVE}/dict/getDictOptions`, data);
//  根据单位id或编码查询对应组织机构树
export const orggetOrgDeptTree = data => get(`${SERVE}/org/getOrgDeptTree`, data);
//  获取单位列表
export const getListOrg = data => get(`${SERVE}/org/listOrg`, data);
//文件上传
export const uploadFile = (data, callback) => upload(`${SERVE2}/wj/wjsc`, data, callback);

//图片视频文件上传
export const imgOrViduploadFile = (data, callback) => upload(`${SERVE}/file/imageUpload`, data, callback);

//文件下载
export const downloadFle = (data) => download(`${SERVE}/file/download`, data);
//  查询单位下部门的技术调查官
export const getSurveyTechUserList = data => get(`${SERVE}/dept/getSurveyTechUserList`, data);

// 根据父编码查询字典值
export const getDictByParDictCode = data => get(`${SERVE}/dict/getDictByParDictCode`, data);
// 根据字典分类列表
export const getDictTypeList = data => get(`${SERVE}/dictType/list`, data);

//根据流程类型及流程类别查询流程节点集合
export const qyhgGetflowNodes = data => get(`${SERVE}/flowNode/listNode`, data);

import { get, post } from '@/network/request';
const SERVE='/hlw-base'

// 文书历史版本列表
export const docVersionList = param => get(`${SERVE}/doc/version/list`, param); 

// 文书历史版本回滚
export const docVersionRollback = param => post(`${SERVE}/doc/version/rollback`, param); 

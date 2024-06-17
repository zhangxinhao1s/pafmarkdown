import { get, post } from '@/network/request';
const SERVE='/hlw-base'
//  
export const getFileToken = param => get(`${SERVE}/file/getFileToken`, param); 
//  登录
export const login = param => post(`${SERVE}/sso/login`, param); 
//  登出
export const loginOut = param => post(`${SERVE}/sso/logout`, param); 
//  获取配置信息 
export const getConfigInfo = param => get(`${SERVE}/sso/getConfigInfo`, param);
//  资源树查询 
export const getResTree = param => get(`${SERVE}/res/getResTree`, param); 
//  根据token获取用户信息 
export const getLoginUserInfo = param => post(`${SERVE}/sso/getLoginUserInfo`, param);
//  获取验证码
export const getPicCode = param => post(`${SERVE}/sso/getPicCode`, param); 
//  获取登录选择机构 
export const getListOrg = param => get(`${SERVE}/org/listOrg`, param); 
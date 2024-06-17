import { get, post } from '@/network/request'
//查询用户信息
const SERVE = '/szjz'
export const getUserInfo = data => post(`${SERVE}/tyyw/getUserInfo`, data);
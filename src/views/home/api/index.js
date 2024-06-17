// import request from "@/utils/request.js";
import { get, post } from '@/network/request'
// import {get,post} from '@/utils/request.js'
// import request from "@/network/request.js";
// import { get,get1,get2, post,post1,post2 } from '@/network/request';
//查询单位信息
export const getDwbmList=(data={}) => {
    return post("/szjz/tyyw/getDwbmInfo", data)
}
//查询用户信息
export const getUserInfo=(data={}) => {
    return post("/szjz/tyyw/getUserInfo", data)
}
//查询案件类别
export const getDzjzAjlb=(data={}) => {
    return post("/szjz/tyyw/getDzjzAjlb", data)
}
//查询卷宗列表
export const getDzzjzList=(data={}) => {
    return post("/szjz/tyyw/getDzzjzList", data)
}
//分页查询电子卷宗
export const pageJzjbxx=(data={}) => {
    return post("/szjz/szjzgl/jzjbxx/pageJzjbxx", data)
}
//添加2.0卷宗
export const batchAddJzjbxx=(data={}) => {
    return post("/szjz/szjzgl/jzjbxx/batchAddJzjbxx", data)
}
///tyyw/getBdajList查询待绑定列表
export const getBdajList=(data={}) => {
    return post("/szjz/tyyw/getBdajList", data)
}
//绑定卷宗/szjzgl/jzjbxx/bdJzjbxx
export const bdJzjbxx=(data={}) => {
    return post("/szjz/szjzgl/jzjbxx/bdJzjbxx", data)
}
//删除卷宗​/szjzgl​/jzjbxx​/deleteJzjbxx
export const deleteJzjbxx=(data={}) => {
    return post("/szjz/szjzgl/jzjbxx/deleteJzjbxx", data)
}
//编辑卷宗/szjzgl/jzjbxx/updateJzjbxx
export const updateJzjbxx=(data={}) => {
    return post("/szjz/szjzgl/jzjbxx/updateJzjbxx", data)
}
//编辑卷宗/szjzgl/jzjbxx/updateJzjbxx
export const jzjbxxJcsd=(data={}) => {
    return post("/szjz/szjzgl/jzjbxx/jcsd", data)
}
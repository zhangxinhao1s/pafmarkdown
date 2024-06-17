import axios from "axios";
import Qs from "qs";
const baseUrl = 'http://143.146.56.142:20851'
const service = axios.create({})

export const get = (url, data = {}) => {
    return new Promise((resolve, reject) => {
        service.get(baseUrl + url, {
            params: data
        }).then(({
            data
        }) => {
            resolve(data)
        }).catch((err) => {
            reject(err)
        })
    })
}

export const upload = (url, data = {}, json = false) => {
    // json格式请求头
    const headerJSON = {
        "Content-Type": "application/json"
    };
    // FormData格式请求头
    const headerFormData = {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    };
    return new Promise((resolve, reject) => {
        service
            .post(baseUrl + url, json ? JSON.stringify(data) : Qs.stringify(data), {
                headers: json ? headerJSON : headerFormData
            })
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(err.data);
            });
    })
}
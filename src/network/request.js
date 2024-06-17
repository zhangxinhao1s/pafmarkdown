// 接口加密请求处理
import axios from 'axios';
import { Message } from 'element-ui';
import { MessageBox } from 'element-ui';
import qs from 'qs';
// import { debounce } from 'lodash';
import {
  ENV, API_BASEURL, API_BASEURL_DEV, TIMEOUT, NO_AUTH_URL, SYS_ID, APP_SECRET, API_GW_PREFIX,
} from './constant';
import crypto from '@/utils/crypto-util';
import storage from '@/utils/storage/storage';
import { getFileToken } from '@/views/common/api/user';
import {
  encryptString,

} from '@/utils/encrypt'
// const sysId = SYS_ID; // 应用id。 由服务端提供
const appSecret = APP_SECRET; // 应用密钥。由服务端提供
const appGwPrefix = API_GW_PREFIX;//后台服务网关前缀

/**
 * 公用post请求
 * @param url      接口地址
 * @param data     接口参数
 * @param headers  接口所需header配置
 * */

function globalParams() {
  const userToken = storage.getItem('tokenInfo');
  const refreshToken = storage.getItem('refreshToken');
  // return {
  //   // sysId, // 应用id。 由服务端提供
  //   // timestamp: +new Date(), // 当前时间戳
  //   // // clientPubKey: crypto.CLIENT_PUBLIC_KEY,//客户端公钥
  //   // nonce: crypto.random(), // 至少8位随机整数 ////todo:未找到random方法，暂时注释掉
  //   // userToken,
  //   // refreshToken

  // };
  return {
    // sysId, // 应用id。 由服务端提供
    // timestamp: +new Date(), // 当前时间戳
    // clientPubKey: crypto.CLIENT_PUBLIC_KEY,//客户端公钥
    // nonce: crypto.random(), // 至少8位随机整数 ////todo:未找到random方法，暂时注释掉
    // userToken,
  };
}

/**
 * 公用get请求
 * @param url      接口地址
 * @param msg      接口异常提示
 * @param headers  接口所需header配置
 * */
//   let key=""
//   console.log('sessionStorage-----------------1',sessionStorage.getItem('rymc'))
//   if(sessionStorage.getItem('rymc')&&sessionStorage.getItem('dwmc')){
//     let data={
//         rymc:sessionStorage.getItem('rymc'),
//         rybm:sessionStorage.getItem('rybm'),
//         dwmc:sessionStorage.getItem('dwmc'),
//         dwbm:sessionStorage.getItem('dwbm')
//     }
//     console.log('keydata---',encryptString(JSON.stringify(data)))
//     key=encryptString(JSON.stringify(data))
// }
let key = ""
if (sessionStorage.getItem('rymc') && sessionStorage.getItem('dwmc')) {
  let data = {
    rymc: sessionStorage.getItem('rymc'),
    rybm: sessionStorage.getItem('rybm'),
    dwmc: sessionStorage.getItem('dwmc'),
    dwbm: sessionStorage.getItem('dwbm')
  }
  key = encryptString(JSON.stringify(data))
}
export const get = (
  url,
  data = {},
  isProxy = false,
  headers = {
    // requestId: crypto.uuid(),//todo:未找到uuid方法，暂时注释掉
    timeout: TIMEOUT,
    "X-IDENTITY": key
  },
) => {
  let baseUrl = API_BASEURL;

  // let header = headers;

  //下面这段代码是否有必要，要改baseUrl的话，直接在.env.development文件中改就行************************
  // if (process.env.NODE_ENV === 'development' && (url === '/upms/sso/login' || url === 'upms/sso/logout')) {
  //   baseUrl = API_BASEURL_DEV;
  // }
  // 加密
  const params = encryptionFunc(data, url, 'GET');
  // console.log(${url}, params)
  // header = {
  //   headers: {
  //     "X-IDENTITY":key
  //   },
  //   ...headers,
  // };
  return axios.get(baseUrl + url, {
    params,
    headers,
  });
};

export const post = (
  url,
  data = {},
  isProxy = false,
  // type = 'qs',
  type = 'json',
  headers = {
    // requestId: crypto.uuid(),//todo:未找到uuid方法，暂时注释掉
    timeout: TIMEOUT,
  },
) => {
  let baseUrl = API_BASEURL;

  //下面这段代码是否有必要，要改baseUrl的话，直接在.env.development文件中改就行************************
  // if (process.env.NODE_ENV === 'development' && (url === '/upms/sso/login' || url === '/upms/sso/inTranetlogin' || url === 'upms/sso/logout')) {
  //   baseUrl = API_BASEURL_DEV;
  // }
  // 加密
  let params = encryptionFunc(data, url, 'POST');
  // let params = (data, url, 'POST');
  if (type === 'qs') {
    params = qs.stringify(params);
  }
  let key = ""
  if (sessionStorage.getItem('rymc') && sessionStorage.getItem('dwmc')) {
    let data = {
      rymc: sessionStorage.getItem('rymc'),
      rybm: sessionStorage.getItem('rybm'),
      dwmc: sessionStorage.getItem('dwmc'),
      dwbm: sessionStorage.getItem('dwbm')
    }
    key = encryptString(JSON.stringify(data))
  }
  let header = headers;
  if (type === 'json') {
    params = JSON.stringify(params);
    header = {
      headers: {
        'Content-type': 'application/json;charset=UTF-8',
        "X-IDENTITY": key
      },
      ...headers,
    };
  }
  if (type === 'formData') {
    header = {
      headers: {
        'Content-type': 'multipart/form-data',
        "X-IDENTITY": key
      },
      ...headers,
    };
    params = data;
  }

  if (url.indexOf('/file/upload') !== -1) {
    header.timeout = 60000; // 文件上传请求超时设置
  }
  // console.log(${url}, ${type}, params)
  return axios.post(baseUrl + url, params, header);
};
// 文件上传的请求
const { CancelToken } = axios;
export const upload = async (
  url,
  data = {},
  callback,
  // cancel,
  headers = {
    // requestId: crypto.uuid(),
    timeout: 120000,
  },
) => {
  // const date = new Date().getTime();
  // const tokenData = await getFileToken();
  // console.log('getFileToken', tokenData.data);
  // const { fileToken } = tokenData.data;
  // headers = {
  //   ...headers,
  //   fileToken,
  // };
  let key = ""
  if (sessionStorage.getItem('rymc') && sessionStorage.getItem('dwmc')) {
    let data = {
      rymc: sessionStorage.getItem('rymc'),
      rybm: sessionStorage.getItem('rybm'),
      dwmc: sessionStorage.getItem('dwmc'),
      dwbm: sessionStorage.getItem('dwbm')
    }
    key = encryptString(JSON.stringify(data))
  }
  headers["X-IDENTITY"] = key
  let baseUrl = API_BASEURL;
  return axios({
    method: 'post',
    url: baseUrl + url,
    data,
    onUploadProgress(progressEvent) {
      if (progressEvent.lengthComputable) {
        if (typeof callback === 'function') {
          callback(progressEvent);
        }
      }
    },
    // cancelToken: new CancelToken(((c) => {cancel(c);}))
    headers,
  });
};

export const download = async (url,
  data = {},
  callback,
  // cancel,
  headers = {
    // requestId: crypto.uuid(),
    timeout: TIMEOUT,
  },) => {
  const tokenData = await getFileToken();
  const { fileToken } = tokenData.data;
  headers = {
    ...headers,
    fileToken,
  };
  data.fileToken = fileToken
  let baseUrl = API_BASEURL;
  const params = encryptionFunc(data, url, 'GET');
  return axios({
    method: 'get',
    url: baseUrl + url,
    params,
    onUploadProgress(progressEvent) {
      if (progressEvent.lengthComputable) {
        if (typeof callback === 'function') {
          callback(progressEvent);
        }
      }
    },
    // cancelToken: new CancelToken(((c) => {cancel(c);}))
    headers,
  });
}

// fileUpload()
export const upload1 = (
  url,
  data = {},
  callback,
  cancel,
  header = {
    requestId: crypto.uuid(),
    timeout: TIMEOUT,
  },
) => {
  let baseUrl = API_BASEURL;
  //下面这段代码是否有必要，要改baseUrl的话，直接在.env.development文件中改就行************************
  if (process.env.NODE_ENV === 'development' && (url === '/upms/sso/login' || url === 'upms/sso/logout')) {
    baseUrl = API_BASEURL_DEV;
  }
  return axios({
    method: 'post',
    url: baseUrl + url,
    data,
    onUploadProgress(progressEvent) {
      if (progressEvent.lengthComputable) {
        if (typeof callback === 'function') {
          callback(progressEvent);
        }
      }
    },
    cancelToken: new CancelToken(((c) => {
      cancel(c);
    })),
    header,
  });
};

// 加密
function encryptionFunc(data, url, method) {
  const globalData = globalParams();
  let params = {
    ...data,
    ...globalData,
  };
  // storage.setItem("enableSignature", res.data.enableSignature);
  // const enableSignature = storage.getItem('enableSignature'); // 后台返回过滤所有接口不加签
  const enableSignature = true
  // const enableEncryption = storage.getItem('enableEncryption'); // 后台返回过滤所有接口不加密
  const enableEncryption = true
  url = `${appGwPrefix}${url}`;
  // console.log('加签前params==',params)
  let sign
  if (enableSignature) {
    sign = crypto.getSign(method, url, params, appSecret);//加签
  }
  // console.log('加签后签名sign==',sign)
  if (enableEncryption && NO_AUTH_URL.every(u => url.indexOf(u) === -1 && u !== '/*')) {
    let encryptData = null;
    // const aesKey = storage.getItem('aesKeyInfo');
    const aesKey = APP_SECRET;
    // globalData.userToken = crypto.RSAEnc(globalData.userToken);
    // globalData.userToken = crypto.AESEnc(aesKey, globalData.userToken);


    if (crypto.isPlainObject(data)) {
      // encryptData = crypto.AESEnc(aesKey,JSON.stringify(data));
      encryptData = JSON.stringify(data);
    } else if (data) {
      // encryptData = crypto.AESEnc(aesKey,data);
      encryptData = data;
    }
    // if (crypto.isPlainObject(data)) {
    //   encryptData = crypto.RSAEnc("",JSON.stringify(data));
    // } else if (data) {
    //   encryptData = crypto.RSAEnc("",data);
    // }
    params = {
      encryptData,
      // sign,
      ...globalData,
    };
  } else {
    params = {
      ...data,
      // sign,
      ...globalData,
    };
  }
  let test = JSON.parse(params.encryptData)
  // return params;
  return test;
}

// 请求拦截器
axios.interceptors.request.use(
  config => config,
  (error) => {
    console.log(error);
    return Promise.reject(error);
  },
);

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (!res || typeof res.code === 'undefined') {
      return response;
    }
    if (res.code != 0 && res.code != '6005') { //如果不是成功返回,6005为第三方登录未绑定的用户，也抛出去到业务层处理
      if (res.code == '3002') {
        MessageBox.alert(res.msg, '消息提示', {
          confirmButtonText: '重新制作',
          callback: action => {

          }
        });
      } else {
        Message({
          message: res.msg || 'Error',
          type: 'error',
          duration: 2 * 1000
        })
      }
      if (res.code === '2002' && res.msg.indexOf('userToken已过期') !== -1) {
        // 清空登录信息
        // const userName = storage.getItem('userName');
        storage.clear();
        // storage.setItem('userNameFlag', userName);
        //window.location.href = process.env.NODE_ENV === 'development' ? '/login' : `${LOGIN_URL}/gzw/login`;
        window.location.href = `${LOGIN_URL}`;
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    }
    res.code = +res.code; // 有的接口返回是字符串
    const { url } = response.config;
    const enableEncryption = storage.getItem('enableEncryption'); // 后台返回过滤所有接口不加密
    if (enableEncryption && NO_AUTH_URL.every(u => url.indexOf
      (u) === -1 && u !== '/*')) {
      let aesKey = storage.getItem('aesKeyInfo');
      let { data } = res;
      if (typeof data === 'string') {
        if (aesKey) {
          if (url.indexOf('/fileRest/uploadFile') !== -1) {
            data = crypto.AESDec(appSecret, data);
          } else {
            data = crypto.AESDec(aesKey, data);
          }
          // 判断单独的data为一个字符串
          try {
            res.data = JSON.parse(data);
          } catch {
            res.data = data;
          }
        } else {
          res.data = JSON.parse(crypto.RSADec(data));
        }
      } else if (data) {
        const keyList = Object.keys(data);
        if (data.aesKey) {
          aesKey = data.aesKey = crypto.RSADec(data.aesKey); // 用客户端私钥解密返回数据
        }
        if (data.userToken) {
          data.userToken = crypto.RSADec(data.userToken); // 用客户端私钥解密返回数据
        }
        if (data.refreshToken) {
          data.userToken = crypto.RSADec(data.refreshToken); // 用客户端私钥解密返回数据
        }
        if (aesKey) {
          for (let i = 0; i < keyList.length; i += 1) { // 对所有的请求参数值进行加密
            const key = keyList[i];
            const val = data[key];
            if (!val) {
              continue;
            }
            if (key !== 'aesKey' && key !== 'userToken' && key !== 'refreshToken' && key !== 'captchaId' && key !== 'picCode') {
              // 使用AES对称加密参数值
              if (crypto.isPlainObject(val)) {
                data[key] = crypto.AESDec(aesKey, JSON.stringify(val));
              } else {
                data[key] = crypto.AESDec(aesKey, val);
              }
              try {
                const oldVal = data[key];
                const newVal = JSON.parse(oldVal);
                if (crypto.isPlainObject(newVal)) {
                  data[key] = newVal;
                } else {
                  data[key] = oldVal;
                }
              } catch (e) {
              }
            }
          }
        }
      }
    } else {
      // console.log()
    }
    return res;
  },
  (error) => {
    if (error === undefined) {
      return;
    }
    if (error.message.indexOf('timeout') !== -1) {
      Message.error('请求超时！');
    } else if (error.response === undefined) {
      Message.error('请求出错！请确认请求方式')
    } else if (error.response !== undefined) {
      if (error.response.data !== undefined) {
        Message.error(`请求错误，错误码：${error.response.data.msg}, ${error.response.data.data}, ${error.response.data.code}`);
      } else if (error.response.status !== undefined) {
        const httpErrorCode = error.response.status;
        Message.error(`请求错误，错误码：${httpErrorCode}`);
      }
    }
    return Promise.reject(error);
  },
);

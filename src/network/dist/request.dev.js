"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upload1 = exports.download = exports.upload = exports.post = exports.get = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _elementUi = require("element-ui");

var _qs = _interopRequireDefault(require("qs"));

var _constant = require("./constant");

var _cryptoUtil = _interopRequireDefault(require("@/utils/crypto-util"));

var _storage = _interopRequireDefault(require("@/utils/storage/storage"));

var _user = require("@/views/common/api/user");

var _encrypt = require("@/utils/encrypt");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var appSecret = _constant.APP_SECRET; // 应用密钥。由服务端提供

var appGwPrefix = _constant.API_GW_PREFIX; //后台服务网关前缀

/**
 * 公用post请求
 * @param url      接口地址
 * @param data     接口参数
 * @param headers  接口所需header配置
 * */

function globalParams() {
  var userToken = _storage["default"].getItem('tokenInfo');

  var refreshToken = _storage["default"].getItem('refreshToken'); // return {
  //   // sysId, // 应用id。 由服务端提供
  //   // timestamp: +new Date(), // 当前时间戳
  //   // // clientPubKey: crypto.CLIENT_PUBLIC_KEY,//客户端公钥
  //   // nonce: crypto.random(), // 至少8位随机整数 ////todo:未找到random方法，暂时注释掉
  //   // userToken,
  //   // refreshToken
  // };


  return {// sysId, // 应用id。 由服务端提供
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


var key = "";

if (sessionStorage.getItem('rymc') && sessionStorage.getItem('dwmc')) {
  var data = {
    rymc: sessionStorage.getItem('rymc'),
    rybm: sessionStorage.getItem('rybm'),
    dwmc: sessionStorage.getItem('dwmc'),
    dwbm: sessionStorage.getItem('dwbm')
  };
  key = (0, _encrypt.encryptString)(JSON.stringify(data));
}

var get = function get(url) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var isProxy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var headers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {
    // requestId: crypto.uuid(),//todo:未找到uuid方法，暂时注释掉
    timeout: _constant.TIMEOUT,
    "X-IDENTITY": key
  };
  var baseUrl = _constant.API_BASEURL; // let header = headers;
  //下面这段代码是否有必要，要改baseUrl的话，直接在.env.development文件中改就行************************
  // if (process.env.NODE_ENV === 'development' && (url === '/upms/sso/login' || url === 'upms/sso/logout')) {
  //   baseUrl = API_BASEURL_DEV;
  // }
  // 加密

  var params = encryptionFunc(data, url, 'GET'); // console.log(${url}, params)
  // header = {
  //   headers: {
  //     "X-IDENTITY":key
  //   },
  //   ...headers,
  // };

  return _axios["default"].get(baseUrl + url, {
    params: params,
    headers: headers
  });
};

exports.get = get;

var post = function post(url) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var isProxy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'json';
  var headers = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
    // requestId: crypto.uuid(),//todo:未找到uuid方法，暂时注释掉
    timeout: _constant.TIMEOUT
  };
  var baseUrl = _constant.API_BASEURL; //下面这段代码是否有必要，要改baseUrl的话，直接在.env.development文件中改就行************************
  // if (process.env.NODE_ENV === 'development' && (url === '/upms/sso/login' || url === '/upms/sso/inTranetlogin' || url === 'upms/sso/logout')) {
  //   baseUrl = API_BASEURL_DEV;
  // }
  // 加密

  var params = encryptionFunc(data, url, 'POST'); // let params = (data, url, 'POST');

  if (type === 'qs') {
    params = _qs["default"].stringify(params);
  }

  var key = "";

  if (sessionStorage.getItem('rymc') && sessionStorage.getItem('dwmc')) {
    var _data = {
      rymc: sessionStorage.getItem('rymc'),
      rybm: sessionStorage.getItem('rybm'),
      dwmc: sessionStorage.getItem('dwmc'),
      dwbm: sessionStorage.getItem('dwbm')
    };
    key = (0, _encrypt.encryptString)(JSON.stringify(_data));
  }

  var header = headers;

  if (type === 'json') {
    params = JSON.stringify(params);
    header = _objectSpread({
      headers: {
        'Content-type': 'application/json;charset=UTF-8',
        "X-IDENTITY": key
      }
    }, headers);
  }

  if (type === 'formData') {
    header = _objectSpread({
      headers: {
        'Content-type': 'multipart/form-data',
        "X-IDENTITY": key
      }
    }, headers);
    params = data;
  }

  if (url.indexOf('/file/upload') !== -1) {
    header.timeout = 60000; // 文件上传请求超时设置
  } // console.log(${url}, ${type}, params)


  return _axios["default"].post(baseUrl + url, params, header);
}; // 文件上传的请求


exports.post = post;
var CancelToken = _axios["default"].CancelToken;

var upload = function upload(url) {
  var data,
      callback,
      headers,
      key,
      _data2,
      baseUrl,
      _args = arguments;

  return regeneratorRuntime.async(function upload$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          data = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          callback = _args.length > 2 ? _args[2] : undefined;
          headers = _args.length > 3 && _args[3] !== undefined ? _args[3] : {
            // requestId: crypto.uuid(),
            timeout: 120000
          };
          // const date = new Date().getTime();
          // const tokenData = await getFileToken();
          // console.log('getFileToken', tokenData.data);
          // const { fileToken } = tokenData.data;
          // headers = {
          //   ...headers,
          //   fileToken,
          // };
          key = "";

          if (sessionStorage.getItem('rymc') && sessionStorage.getItem('dwmc')) {
            _data2 = {
              rymc: sessionStorage.getItem('rymc'),
              rybm: sessionStorage.getItem('rybm'),
              dwmc: sessionStorage.getItem('dwmc'),
              dwbm: sessionStorage.getItem('dwbm')
            };
            key = (0, _encrypt.encryptString)(JSON.stringify(_data2));
          }

          headers["X-IDENTITY"] = key;
          baseUrl = _constant.API_BASEURL;
          return _context.abrupt("return", (0, _axios["default"])({
            method: 'post',
            url: baseUrl + url,
            data: data,
            onUploadProgress: function onUploadProgress(progressEvent) {
              if (progressEvent.lengthComputable) {
                if (typeof callback === 'function') {
                  callback(progressEvent);
                }
              }
            },
            // cancelToken: new CancelToken(((c) => {cancel(c);}))
            headers: headers
          }));

        case 8:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.upload = upload;

var download = function download(url) {
  var data,
      callback,
      headers,
      tokenData,
      fileToken,
      baseUrl,
      params,
      _args2 = arguments;
  return regeneratorRuntime.async(function download$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          data = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
          callback = _args2.length > 2 ? _args2[2] : undefined;
          headers = _args2.length > 3 && _args2[3] !== undefined ? _args2[3] : {
            // requestId: crypto.uuid(),
            timeout: _constant.TIMEOUT
          };
          _context2.next = 5;
          return regeneratorRuntime.awrap((0, _user.getFileToken)());

        case 5:
          tokenData = _context2.sent;
          fileToken = tokenData.data.fileToken;
          headers = _objectSpread({}, headers, {
            fileToken: fileToken
          });
          data.fileToken = fileToken;
          baseUrl = _constant.API_BASEURL;
          params = encryptionFunc(data, url, 'GET');
          return _context2.abrupt("return", (0, _axios["default"])({
            method: 'get',
            url: baseUrl + url,
            params: params,
            onUploadProgress: function onUploadProgress(progressEvent) {
              if (progressEvent.lengthComputable) {
                if (typeof callback === 'function') {
                  callback(progressEvent);
                }
              }
            },
            // cancelToken: new CancelToken(((c) => {cancel(c);}))
            headers: headers
          }));

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  });
}; // fileUpload()


exports.download = download;

var upload1 = function upload1(url) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var callback = arguments.length > 2 ? arguments[2] : undefined;
  var cancel = arguments.length > 3 ? arguments[3] : undefined;
  var header = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
    requestId: _cryptoUtil["default"].uuid(),
    timeout: _constant.TIMEOUT
  };
  var baseUrl = _constant.API_BASEURL; //下面这段代码是否有必要，要改baseUrl的话，直接在.env.development文件中改就行************************

  if (process.env.NODE_ENV === 'development' && (url === '/upms/sso/login' || url === 'upms/sso/logout')) {
    baseUrl = _constant.API_BASEURL_DEV;
  }

  return (0, _axios["default"])({
    method: 'post',
    url: baseUrl + url,
    data: data,
    onUploadProgress: function onUploadProgress(progressEvent) {
      if (progressEvent.lengthComputable) {
        if (typeof callback === 'function') {
          callback(progressEvent);
        }
      }
    },
    cancelToken: new CancelToken(function (c) {
      cancel(c);
    }),
    header: header
  });
}; // 加密


exports.upload1 = upload1;

function encryptionFunc(data, url, method) {
  var globalData = globalParams();

  var params = _objectSpread({}, data, {}, globalData); // storage.setItem("enableSignature", res.data.enableSignature);
  // const enableSignature = storage.getItem('enableSignature'); // 后台返回过滤所有接口不加签


  var enableSignature = true; // const enableEncryption = storage.getItem('enableEncryption'); // 后台返回过滤所有接口不加密

  var enableEncryption = true;
  url = "".concat(appGwPrefix).concat(url); // console.log('加签前params==',params)

  var sign;

  if (enableSignature) {
    sign = _cryptoUtil["default"].getSign(method, url, params, appSecret); //加签
  } // console.log('加签后签名sign==',sign)


  if (enableEncryption && _constant.NO_AUTH_URL.every(function (u) {
    return url.indexOf(u) === -1 && u !== '/*';
  })) {
    var encryptData = null; // const aesKey = storage.getItem('aesKeyInfo');

    var aesKey = _constant.APP_SECRET; // globalData.userToken = crypto.RSAEnc(globalData.userToken);
    // globalData.userToken = crypto.AESEnc(aesKey, globalData.userToken);

    if (_cryptoUtil["default"].isPlainObject(data)) {
      // encryptData = crypto.AESEnc(aesKey,JSON.stringify(data));
      encryptData = JSON.stringify(data);
    } else if (data) {
      // encryptData = crypto.AESEnc(aesKey,data);
      encryptData = data;
    } // if (crypto.isPlainObject(data)) {
    //   encryptData = crypto.RSAEnc("",JSON.stringify(data));
    // } else if (data) {
    //   encryptData = crypto.RSAEnc("",data);
    // }


    params = _objectSpread({
      encryptData: encryptData
    }, globalData);
  } else {
    params = _objectSpread({}, data, {}, globalData);
  }

  var test = JSON.parse(params.encryptData); // return params;

  return test;
} // 请求拦截器


_axios["default"].interceptors.request.use(function (config) {
  return config;
}, function (error) {
  console.log(error);
  return Promise.reject(error);
}); // 响应拦截器


_axios["default"].interceptors.response.use(function (response) {
  var res = response.data;

  if (!res || typeof res.code === 'undefined') {
    return response;
  }

  if (res.code != 0 && res.code != '6005') {
    //如果不是成功返回,6005为第三方登录未绑定的用户，也抛出去到业务层处理
    if (res.code == '3002') {
      _elementUi.MessageBox.alert(res.msg, '消息提示', {
        confirmButtonText: '重新制作',
        callback: function callback(action) {}
      });
    } else {
      (0, _elementUi.Message)({
        message: res.msg || 'Error',
        type: 'error',
        duration: 2 * 1000
      });
    }

    if (res.code === '2002' && res.msg.indexOf('userToken已过期') !== -1) {
      // 清空登录信息
      // const userName = storage.getItem('userName');
      _storage["default"].clear(); // storage.setItem('userNameFlag', userName);
      //window.location.href = process.env.NODE_ENV === 'development' ? '/login' : `${LOGIN_URL}/gzw/login`;


      window.location.href = "".concat(LOGIN_URL);
    }

    return Promise.reject(new Error(res.msg || 'Error'));
  }

  res.code = +res.code; // 有的接口返回是字符串

  var url = response.config.url;

  var enableEncryption = _storage["default"].getItem('enableEncryption'); // 后台返回过滤所有接口不加密


  if (enableEncryption && _constant.NO_AUTH_URL.every(function (u) {
    return url.indexOf(u) === -1 && u !== '/*';
  })) {
    var aesKey = _storage["default"].getItem('aesKeyInfo');

    var _data3 = res.data;

    if (typeof _data3 === 'string') {
      if (aesKey) {
        if (url.indexOf('/fileRest/uploadFile') !== -1) {
          _data3 = _cryptoUtil["default"].AESDec(appSecret, _data3);
        } else {
          _data3 = _cryptoUtil["default"].AESDec(aesKey, _data3);
        } // 判断单独的data为一个字符串


        try {
          res.data = JSON.parse(_data3);
        } catch (_unused) {
          res.data = _data3;
        }
      } else {
        res.data = JSON.parse(_cryptoUtil["default"].RSADec(_data3));
      }
    } else if (_data3) {
      var keyList = Object.keys(_data3);

      if (_data3.aesKey) {
        aesKey = _data3.aesKey = _cryptoUtil["default"].RSADec(_data3.aesKey); // 用客户端私钥解密返回数据
      }

      if (_data3.userToken) {
        _data3.userToken = _cryptoUtil["default"].RSADec(_data3.userToken); // 用客户端私钥解密返回数据
      }

      if (_data3.refreshToken) {
        _data3.userToken = _cryptoUtil["default"].RSADec(_data3.refreshToken); // 用客户端私钥解密返回数据
      }

      if (aesKey) {
        for (var i = 0; i < keyList.length; i += 1) {
          // 对所有的请求参数值进行加密
          var _key = keyList[i];
          var val = _data3[_key];

          if (!val) {
            continue;
          }

          if (_key !== 'aesKey' && _key !== 'userToken' && _key !== 'refreshToken' && _key !== 'captchaId' && _key !== 'picCode') {
            // 使用AES对称加密参数值
            if (_cryptoUtil["default"].isPlainObject(val)) {
              _data3[_key] = _cryptoUtil["default"].AESDec(aesKey, JSON.stringify(val));
            } else {
              _data3[_key] = _cryptoUtil["default"].AESDec(aesKey, val);
            }

            try {
              var oldVal = _data3[_key];
              var newVal = JSON.parse(oldVal);

              if (_cryptoUtil["default"].isPlainObject(newVal)) {
                _data3[_key] = newVal;
              } else {
                _data3[_key] = oldVal;
              }
            } catch (e) {}
          }
        }
      }
    }
  } else {// console.log()
  }

  return res;
}, function (error) {
  if (error === undefined) {
    return;
  }

  if (error.message.indexOf('timeout') !== -1) {
    _elementUi.Message.error('请求超时！');
  } else if (error.response === undefined) {
    _elementUi.Message.error('请求出错！请确认请求方式');
  } else if (error.response !== undefined) {
    if (error.response.data !== undefined) {
      _elementUi.Message.error("\u8BF7\u6C42\u9519\u8BEF\uFF0C\u9519\u8BEF\u7801\uFF1A".concat(error.response.data.msg, ", ").concat(error.response.data.data, ", ").concat(error.response.data.code));
    } else if (error.response.status !== undefined) {
      var httpErrorCode = error.response.status;

      _elementUi.Message.error("\u8BF7\u6C42\u9519\u8BEF\uFF0C\u9519\u8BEF\u7801\uFF1A".concat(httpErrorCode));
    }
  }

  return Promise.reject(error);
});
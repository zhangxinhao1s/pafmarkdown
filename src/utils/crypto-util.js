import crypto from 'crypto-js'
import JSEncrypt from 'jsencrypt'
import { uniqueId } from 'underscore';
/** 
 * 在进行RSA（非对称加密算法）加密前，先要准备好私钥和公钥。
 * 1.在命令行执行一下命令已生成一个RAS密钥：
 * openssl genrsa -out rsa-prv.pem 1024
 * openssl随机生成了一份私钥，加密长度是1024位。加密长度是指理论上最大允许“被加密的信息”长度的限制，也就是明文的长度限制。
 * 随着这个参数的增大（比方说2048），语序的明文长度也要增加，但同时也要造成计算复杂度的极速增长，一般推荐的长度就是1024位（加密的明文不能超过128字节）
 * 2.接下来根据私钥生成公钥：
 * openssl rsa -in rsa-prv.pem -out rsa-pub.pem -pubout
 * 3.生成PKCS#8编码格式密钥（注：第一步生成的是PKCS#1编码格式，已经过时）
 * openssl pkcs8 -topk8 -in rsa-pub.pem -out rsa-prv-pkcs8.pem -nocrypt
 * 4.这样就准备好了私钥文件rsa-prv=pkcs8.pem和公钥文件rsa-pub.pem 编码格式均为PEM
 * 数据通过私钥加密，公钥解密。注意公钥可以公开私钥必须保密
 * 
*/

let INIT_SEED = 0;

export default {

  // 服务端公钥，服务端提供
  SERVER_PUBLIC_KEY: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAg31+CFOuODcj52WVOhFthnJJNQsTzq9gQ83g9X5aMeHAEbJZBlvZEUmBpWDH6LdGjpL8rWU2Zozj7LCjgPLuGTdWr/apt1LFBnBJXLYvOjigtP2NFZH1ughTAZDtZ0vWt+d8eNHV15ZG1iK3aonpnBYacclhuWKWeXZ3nU57od/zT/YrYaVMPRO7oGIBAN/v8hl7USIJ3rj28C9VuZk5kIp+NjKdeM+t3dO/V28SWr0PZTkXL7UC0Mo6A9Wrc5niEyWd47RsoNL59P+PFxz1S1sQhSwyhpZ6oeO9/5XEO7EdZdux/26WjeP6PNMKkoB+oX5AuQ1RZAVz2pRnwjzjIwIDAQAB',

  // 客户端公钥和私钥，由客户端生成及维护，登录时把客户端公钥传递给服务端，最好从后端获取
  CLIENT_PUBLIC_KEY: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxAallNnueVSve9whhX6jzPh/I8NZy0QaIBkrDLJAW7E95QC1dhSvrFWJuH2B4N9i+ci9PihbY5mE4TBxMlT6FYrnrwxL9vbD/6N2cXtKxQeHEFm6oR9SyfxIkvqjIZkfFwMuoNGaix0fDIWF/hdCoDBn++TG2D9RfDkMgn3c1BQFxSe3RqmBp9KOq12/LReTRC8MZsEns7nlSuiIr9iepgvBYLhVctZOIFbCr/QFy75T5GSFCvtboVmodmoleZCc4btunhXAaEeBTgCo7UesNWxsK27TOH5hjkcU7TknllwyMGKV93uk0gumk/qD+1QhayCyfkVyMxecoG6GQeAZcQIDAQAB',

  CLIENT_PRIVATE_KEY: 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDEBqWU2e55VK973CGFfqPM+H8jw1nLRBogGSsMskBbsT3lALV2FK+sVYm4fYHg32L5yL0+KFtjmYThMHEyVPoViuevDEv29sP/o3Zxe0rFB4cQWbqhH1LJ/EiS+qMhmR8XAy6g0ZqLHR8MhYX+F0KgMGf75MbYP1F8OQyCfdzUFAXFJ7dGqYGn0o6rXb8tF5NELwxmwSezueVK6Iiv2J6mC8FguFVy1k4gVsKv9AXLvlPkZIUK+1uhWah2aiV5kJzhu26eFcBoR4FOAKjtR6w1bGwrbtM4fmGORxTtOSeWXDIwYpX3e6TSC6aT+oP7VCFrILJ+RXIzF5ygboZB4BlxAgMBAAECggEBAKq03x1xa6tdhDRozwhh8GNfQ9jxFhFdjSLGyCaWVFWFVFFI/L2H5jQ9iWGQarpZzueXWLX4jx19Y6p3dRxPxDlebcSTANRgsO6+ezb4F3TdyVED0vLdREuB1/GnMsjff6OasdB6uArNoWxWGwnbV7oIbYV/BWrsORnk1HAPC2/jONNypiSG14fdi9I5tX/DhztncsFXm+/MLby6yX21MrJ7aOCjze92MS5hyJWo51+JUnJs65vJ8P2WY8/x73/O4rWzK+/QQ/l+Dvzb0YDQEi9Z/YwYnNCcUmgNdWrygeJsmFcsgnFltDIEaG3A7OUhPhB27CVNQBylhs6FdTx4rAECgYEA77Wyx7GJBbG4zP+5m+5AFW8aFLH43zQx5KXQEz9q+5coJeERbub9ADNtZ0iqoy0G1pV9tto3PoGene75U18TJ5xUdZlBXM2DH59CGFZvqOwKL1zULoiA5crCvrkPVnRFrw2OUnFoPfJ7tFwpmUUDdaRtUndW8r+KC6l3QX88xokCgYEA0Vj38WqU1uYAZ9EUa+eseHRX3VPZBH/s67hc+GEluPwqdten1wePYSOWEuImBDS1+TNYWlD3J+1jMInIhmEeNZdoZpjDOCP69bFsUyuKxqT6ZtYcuHRPJJ3WvSeRdy86ffOnuU5YtKLg/46vtjjMrGoYqAc/kpG+EQ3ggD+GgakCgYEAutXLYBx/aUHJgXb8q436wvoSwPiquwZKsSWQVcBDWY/KiiOv29oMboCnEC6yWXb58n0YPFI/ZufOwtiF2rarDl+p8PMf3/6K6jXOZXvRkj9P/PSEqTRaC0GLou5JByCfQ770JEwibM44Hy8KeV0yQhqD3xgHXDNwnIBc5F8Q9skCgYADfPwEpcX9Hq/7CtzQP3f8OdQM+AyxqoAEHXpPGS9LucfrWwSM7K9S6wjhH6uKfmZZ1KUwPBEiNS5l7KXOt2eNdQxkST9XfCH+Xgp0CFGzpaQWepLX7/gxn/+n/zTJS5wp5RlyWP/ZYq1lFLeQzbl7Vfk7M4O3qX4FQrnu6SAQoQKBgBQAA78BGRLXzgGR/JFgh2gI0nUiRqTlXqlqcYew7cBag+yr4+WEhAzrgF5xqb49Xk+Ub/O7t9Mgjvw7urX4yz0NhInXIO+PymK8/+n8OmVHxIFncV2K2pKPXoxSsUNlQhkeSSFpihXpdZHEQEMgK8TbAZVJbl63NokScPVYtjlN',

  isPlainObject (obj) {
    return this.getType(obj) === 'object' || this.getType(obj) === 'array';
  },

  /**
   * 获取对象的数据类型：小写的类型名
   */
  getType (obj) {
    const proto = Object.prototype;
    const serialize = proto.toString;
    const class2type = {};
    const tt = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'];
    let i = 0;
    for (i = 0; i < tt.length; i++) {
      class2type[`[object${tt[i]}]`] = tt[i].toLowerCase();
    }
    if (obj == null) {
      return String(obj);
    }
    return typeof obj === 'object' || typeof obj === 'function' ? class2type[serialize.call(obj)] || 'object' : typeof obj;
  },
  // 对参赛生成签名串
  getSign (method, url, params, appSecret) {
    let kv = '';
    const keyList = Object.keys(params).sort(); // 把key按ascii升序排序
    for (let i = 0; i < keyList.length; i++) { // 拼接请求串
      const key = keyList[i].replace(/_/g, '.'); // key中包含下划线，则需要将其转化为“.”
      if (this.isPlainObject(params[keyList[i]])) {
        if (this.getType(params[keyList[i]]) === 'array' && params[keyList[i]].length === 0||this.getType(params[keyList[i]]) === 'object'&& params[keyList[i]].length === 0) {
          continue; // 去掉空数组
        }
        kv += `&${key}=${JSON.stringify(params[keyList[i]])}`;
      } else if (params[keyList[i]] !== null && params[keyList[i]] !== '' && params[keyList[i]] !== undefined && params[keyList[i]] !== 'null' && params[keyList[i]] !== 'undefined' && String(params[keyList[i]]).trim() != '') {
        kv += `&${key}=${params[keyList[i]]}`;
      }
    }
    // 拼接签名原文字符串：请求方法+请求路径+？+请求字符串+应用密钥（从应用管理中分配）
    let str = `${method + url}?${kv.substring(1)}${appSecret}`;
    // console.log(str)
    // md5生成签名窜，然后讲生成的签名串使用Base64进行编码
    str = crypto.MD5(str);
    // 编码
    str = crypto.enc.Utf8.parse(str);
    str = crypto.enc.Base64.stringify(str);
    return str;
  },
  //  生成8位随机数
  random(){
    let rand='';
    for(var i=0;i<8;i++){
      rand+=Math.floor(Math.random()*10);
    }
    return rand
  },
  // 生成md5
  md5 (data) {
    return crypto.MD5(data).toString();
  },
  // RSA公钥加密方法
  RSAEnc (pubKey, content) {
    if (arguments.length === 1) {
      content = pubKey;
      pubKey = false;
    }
    if (content === null || content === '') {
      return null;
    }
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(pubKey || this.SERVER_PUBLIC_KEY);
    const encrypted = encryptor.encrypt(content);
    return encrypted;
  },
  // RSA私钥解密方法
  RSADec (priKey, content) {
    if (arguments.length === 1) {
      content = priKey;
      priKey = false;
    }
    if (content === null || content === '') {
      return null;
    }
    const decryptor = new JSEncrypt();
    decryptor.setPublicKey(priKey || this.CLIENT_PRIVATE_KEY);
    const decrypred = decryptor.decrypt(content);
    return decrypred;
  },
  // AES加密
  AESEnc (key, content) {
    key = crypto.enc.Utf8.parse(key); // 加密密钥
    const srcs = crypto.enc.Utf8.parse(content);
    const encrypted = crypto.AES.encrypt(srcs, key, { iv: key, mode: crypto.mode.CBC });
    return encrypted.toString();
  },
  // AES解密
  AESDec (key, content) {
    key = crypto.enc.Utf8.parse(key); // 解密密钥
    const decrypted = crypto.AES.decrypt(content, key, { iv: key, mode: crypto.mode.CBC });
    return decrypted.toString(crypto.enc.Utf8);
  },
  getKey () {
    return unid(16, 16);
  },
}
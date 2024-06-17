export const ENV = process.env.ENV; //development本机/ci开发/test测试/production生产 配置部署环境
//export const ENV = 'loc'; //development本机/ci开发/test测试/production生产 配置部署环境

let vueRootUrl = process.env.VUE_APP_ROOT_URL;//vue前端页面根目录地址，例如：http://143.146.57.154:8089
let apiBaseUrl = process.env.VUE_APP_BASE_API;//api接口根URL，例如：http://143.146.57.154:20831/gw/api/v1
let apiBaseUrlDev = '';
let imageBaseUrl = `${vueRootUrl}/nas/static/wjgl`;//图片接口根URL
let videoBaseUrl = `${vueRootUrl}/nas/static/video`;//视频接口根URL
let fileServer = `${apiBaseUrl}/gw/api/v1/base/file/upload`; //文件服务器上传地址
let fileServerDownload = `${apiBaseUrl}/gw/api/v1/base/file/download`; //文件服务器下载地址
const timeout = 10000; //设置请求超时时间
let authMenu = true; //动态权限菜单控制，true:动态菜单，false:静态菜单
const noAuthUrl = [ //接口白名单，不需要加签加密的接口地址清单
    '/base/sso/getConfigInfo',
    // '/base/org/listOrg',
    '/base/file/getFileToken',
    '/base/file/upload',
    '/base/file/download',
    '/biz/volume/file/upload',
];
// console.log('process.env.NODE_ENV', process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') { //本机调试环境
    apiBaseUrlDev = '/devApi'; //只用于 登录与登出的接口地址（本机联调时需要借助开发环境的登录地址）
    // noAuthUrl.push('/*'); //本机环境与后台人员联调时，所有业务接口不加签加密
    authMenu = false; //本机环境不使用动态权限菜单
    imageBaseUrl='http://143.146.57.154:8091/nas/static/images'
    videoBaseUrl='http://143.146.57.154:8091/nas/static/video'
}

//以下代码进行注释，重构后的代码在上方
// if (process.env.NODE_ENV === 'development') { //本机环境
//     apiBaseUrl = process.env.VUE_APP_BASE_API; //本机环境接口调试地址（此处使用后台联调人员的本机IP:PORT）
//     apiBaseUrlDev = '/devApi'; //只用于 登录与登出的接口地址（本机联调时需要借助开发环境的登录地址）
//     loginUrl = '/login'; //统一登录地址
//     if (apiBaseUrl !== '/devApi') {
//         noAuthUrl.push('/*'); //本机环境与后台人员联调时，所有业务接口不加签加密
//         authMenu = false; //本机环境不使用动态权限菜单
//     }
//     fileServer = `${apiBaseUrl}/gw/api/v1/base/file/upload`; //文件服务器上传地址
//     fileServerDownload = `${apiBaseUrl}/gw/api/v1/base/file/download`; //文件服务器下载地址
//     sqlFileDownload = `${apiBaseUrl}/gw/api/v1/dataManage/table/getSqFile`; //sql文件下载地址
// } else if (process.env.NODE_ENV === 'test') { //测试环境
//     apiBaseUrl = process.env.VUE_APP_BASE_API;
//     loginUrl = `${apiBaseUrl}/pnweb/login`; //统一登录地址
//     fileServer = `${apiBaseUrl}/gw/api/v1/base/file/upload`; //文件服务器上传地址
//     fileServerDownload = `${apiBaseUrl}/gw/api/v1/base/file/download`; //文件服务器下载地址
//     sqlFileDownload = `${apiBaseUrl}/gw/api/v1/dataManage/table/getSqFile`; //sql文件下载地址
// } else if (process.env.NODE_ENV === 'production') { //生产环境
//     apiBaseUrl = process.env.VUE_APP_BASE_API;
//     loginUrl = `${apiBaseUrl}/pnweb/login`; //统一登录地址
//     fileServer = `${apiBaseUrl}/gw/api/v1/base/file/upload`; //文件服务器上传地址
//     fileServerDownload = `${apiBaseUrl}/gw/api/v1/base/file/download`; //文件服务器下载地址
//     sqlFileDownload = `${apiBaseUrl}/gw/api/v1/dataManage/table/getSqFile`; //sql文件下载地址
// }


export const TIMEOUT = timeout;
export const API_BASEURL = apiBaseUrl;//API接口根URL
export const IMAGE_BASEURL = imageBaseUrl;//图片拼接根URL
export const VIDEO_BASEURL = videoBaseUrl;//视频拼接根URL
export const API_BASEURL_DEV = apiBaseUrlDev;//待核查后废弃掉该变量
export const API_GW_PREFIX = process.env.VUE_APP_GW_PREFIX;//网关前缀
export const NO_AUTH_URL = noAuthUrl;//白名单数组
export const AUTH_MENU = authMenu;//菜单模式，动态或者静态
export const FILE_SERVER = fileServer; //文件通用上传地址
export const FILE_SERVER_DOWLOAD = fileServerDownload; //文件通用下载地址
//export const SQL_FILE_DOWLOAD = sqlFileDownload; //sql文件下载地址,该功能已经废弃

export const SYS_ID = '8e7d8077a22c42ab9300db6e38ebeb81';//应用ID,由服务端提供
export const APP_SECRET = '0fa2c8962bd5465b';//敏感字段加密key,由服务端提供
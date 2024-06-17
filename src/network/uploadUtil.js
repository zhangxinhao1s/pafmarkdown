import {
    uploadFile,
    imgOrViduploadFile
} from '@/views/common/api/common'
import {
    getFileToken
} from '@/views/common/api/user';
import {
    API_BASEURL
} from '@/network/constant';
import { Message } from 'element-ui';
/**
 * 文件上传
 * @param {*} file 要上传的文件
 */
export const upload = (
    form, callback,
    needSyncFlag = 0,
    storeType = true
) => {
    return new Promise((resolve, reject) => {
        const data = new FormData()
        console.log('form------',form)
        data.append("file", form.file);
        data.append("identifier", form.identifier);
        data.append("totalchunks", form.totalchunks);
        data.append("chunksize", form.chunksize);
        data.append("chunkIndex", form.chunkIndex);
        data.append("wjdx", form.wjdx);
        data.append("wjlx", form.wjlx);
        data.append("wjmc", form.wjmc);
        data.append("jzbh", form.jzbh);
        data.append("dwbm", form.dwbm);
        uploadFile(data, callback).then(resp => {
            resolve(resp)
        }).catch((e) => {
            reject(e)
        })
    })
}

export const imgOrVidupload = ({
    file,
    fileType,
    needSyncFlag = 0,
    storeType = true
}, callback) => {
    return new Promise((resolve, reject) => {
        const data = new FormData()
        data.append('file', file)
        data.append('fileType', fileType)
        data.append('uploadUserId', 1)
        storeType ? data.append('storeType', 'OBS') : data.append('storeType', 'NAS')
        data.append('needSyncFlag', needSyncFlag)
        imgOrViduploadFile(data, callback).then(resp => {
            resolve(resp)
        }).catch((e) => {
            reject(e)
        })
    })
}
/**
 * 文件下载，传入文件名和下载参数
 * @param {*文件名} fileName 
 * @param {*其他参数} params 
 */
export const download = async (fileName, params) => {
    const tokenData = await getFileToken();
    console.log('getFileToken', tokenData.data);
    const {
        fileToken
    } = tokenData.data;
    const elink = document.createElement('a')
    elink.download = fileName;
    elink.style.display = 'none'
    // elink.href = `${API_BASEURL}/base/file/download?id=${data.bizPkId}&isWpsDownload=1&fileToken=${fileToken}`
    elink.href = `${API_BASEURL}/hlw-base/file/download?fileToken=${fileToken}`
    Object.keys(params).forEach(key => {
        elink.href = elink.href + '&' + key + '=' + params[key]
    })
    console.log('elink.href===', elink.href)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href)
    document.body.removeChild(elink)
}
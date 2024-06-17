/**
 * localStorage and sessionStorage basic operation
 * 公用缓存 目前只支持存取object 对象
 */
const cache = {};
const cid = 'rs2019-';

const storageObj = {
    1: localStorage,
    0: sessionStorage,
};
/** 
 *  目前已有key值维护
 *  userInfo:用户登录信息
 *  openInfo:用户开户绑卡信息
 *  userInfoForLogin : 用于登录的信息（包括userType）
 */
/**
 *  获取缓存
 *  @param type 1=session 0=local
 */
export default {
    getItem(key, type = '0') {
        key = cid + key;
        let result = cache[key];
        if (!result) {
            result = storageObj[type].getItem(key);
            // debugger
            if (result) {
                result = JSON.parse(result);
                if (result && result.__storageType === 'string') {
                    result = result.value;
                }
            } else {
                result = '';
            }
            cache[key] = result;
        }
        return result;
    },
    /**
     * 设置缓存
     * @param value 目前支持字符串跟对象
     */
    setItem(key, value = {}, type = '0') {
        key = cid + key;
        cache[key] = value;
        if (typeof value === 'string') {
            value = {
                __storageType: 'string',
                value,
            };
        }
        const str = JSON.stringify(value);
        storageObj[type].setItem(key, str);
    },

    //删除值
    removeItem(key, type = '0') {
        key = cid + key;
        cache[key] = '';
        storageObj[type].removeItem(key);
    },

    clear(type = '0') {
        for (const key in cache) {
            delete cache[key];
        }
        storageObj[type].clear();
    },

    setString(key, value = '', type = '0') {
        key = cid + key;
        cache[key] = value;
        const str = value;
        storageObj[type].setItem(key, str);
    },
    getString(key, type = '0') {
        key = cid + key;
        let result = cache[key];
        if (!result) {
            result = storageObj[type].getItem(key);
            cache[key] = result;
        }
        return result;
    },
};
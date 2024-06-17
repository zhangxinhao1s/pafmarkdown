
import store from '../store'

/**
 * 缓存页面资源
 */
const RES_CACHE = {}


/**
 * 页面元素显示权限判断
 * @param {} eleCode 
 */
export function checkAuth(eleCode){

    const index = eleCode.lastIndexOf('_')
    const resCode = eleCode.substring(0,index)
   //  console.log('当前页面资源编码：',resCode)
     const curRes = getCurAuthRes(resCode)
   //  console.log('当前页面元素curRes===',curRes)
     if(!curRes){ //如果不存在
      //   console.log('资源不存在--resCode=='.resCode)
        return false
     }
     if(curRes.elementList && curRes.elementList.length > 0){
        const eleIndex = curRes.elementList.findIndex(ele => ele.eleCode === eleCode)
        return eleIndex > -1
     }else{
      console.log('curRes.elementList为空')
     }
    return false
}


/**
 * 获取resList中当前页面的资源数据
 * @param {*} resCode 
 */
export function getCurAuthRes(resCode){
   if(RES_CACHE.hasOwnProperty(resCode)){
      // console.log('缓存中取得资源resCode==',resCode)
      return RES_CACHE[resCode]
   }else {
      // console.log('userInfo取得资源resCode==',resCode)
      const userInfo = store.state.user.userInfo
      const curRes = userInfo.resList.find(res => res.resCode === resCode)
      RES_CACHE[resCode] = curRes
      return curRes
   }
}


/**
 * 获取当前页面所有选择项
 * @param {*} resCode 
 */
export function getCurAuthData(resCode){
   const curRes = getCurAuthRes(resCode)
   return curRes.permissionVO
}



/**
 * 获取当前页面该类型的选择项
 * @param {}} resCode 
 * @param {*} typeKey 
 */
export function getCurAuthSelectorData(resCode,typeKey){
   const permissionVO = getCurAuthData(resCode)
   if(permissionVO && permissionVO.hasOwnProperty(typeKey)){
       return permissionVO[typeKey]||[]
   }
   return []
}


/**
 * 校验当前页面数据权限
 * @param {*} resCode 
 * @param {*} srcList 
 * @param {*} typeKey 目前可以传的值
 * 
 *  deptList: ["440300004", "440300005"]
    jsdcStatusList: null //技术调查状态
    jsdcTerritoryList: null  //技术调查领域
    orgList: ["440304", "440300"]
    xsTypeList: null //业务类型
    @param {*} optionCodeKey 下拉选项值的字段名
 */
export function checkDataAuth(resCode,srcList,typeKey,optionCodeKey='dictCode'){
   console.log('当前页面resCode==',resCode)
  const permissionVO = getCurAuthData(resCode)
  if(permissionVO && permissionVO.hasOwnProperty(typeKey)){
      const validCodeList = permissionVO[typeKey]
      if(typeKey === 'orgList' && validCodeList.length === 1 && validCodeList[0] === 'all'){ //如果是单位，并且是all
           return srcList
      }
      if(validCodeList && validCodeList.length > 0){
         return srcList.filter(e => validCodeList.includes(e[optionCodeKey]))
      }
  }
  console.log('未配权限编辑器resCode==',resCode,',typeKey==',typeKey)
  return srcList
}

/**
 * 针对部门的数据权限控制
 * @param {} resCode 
 * @param {*} srcList 
 * @param {*} orgCode 
 * @param {*} optionCodeKey 
 */
export function checkDeptDataAuth(resCode,srcList,orgId,optionCodeKey='dictCode'){
   const permissionVO = getCurAuthData(resCode)
   if(permissionVO && permissionVO.hasOwnProperty('deptList')){
      if(!permissionVO['deptList'] || permissionVO['deptList'].length === 0){
         return srcList
      } 
       const validCodeList = permissionVO['deptList'].filter(e => e.split(',')[0] === orgId)
       if(validCodeList.length === 0){
          return []
       }
       if(validCodeList.length === 1 && validCodeList[0].indexOf('all') > -1){
          return srcList
       }
       const tempValidCodes =  validCodeList.map(e => {
           return e.split(',')[1]
       })
       return srcList.filter(e => tempValidCodes.includes(e[optionCodeKey]))
   }
   return srcList
}

/**
 * 单位和部门数据权限控制，第一次进页面单位和部门为空时的显示或者重置为空时
 * @param {}} params 
 * @param {*} orgKey 
 * @param {*} deptKey 
 */
export function  checkOrgDeptFilter(resCode,params,orgKey='unitId',deptKey='deptId'){
   if (!params[orgKey]) {
     const orgCodes = getCurAuthSelectorData(resCode, "orgList");
     if (orgCodes && orgCodes.length > 0 && orgCodes.includes('all')) {
        params[orgKey] = "";
      } else if(orgCodes && orgCodes.length > 0){
        params[orgKey] = orgCodes.join(",");
     }
   }
   if (!params[deptKey]) {
     const deptCodes = getCurAuthSelectorData(resCode, "deptList")
     if(deptCodes && deptCodes.length > 0 && deptCodes[0].indexOf('all') > -1){
         params[deptKey] = ''
     }else if(deptCodes && deptCodes.length > 0){
         const deptSplit = deptCodes.map(e => e.split(',')[1])
         params[deptKey] = deptSplit.join(',')
     }
   }
 }


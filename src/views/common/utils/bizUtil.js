/**
 * 把字典接口返回的编码，转成map格式的，方便直接赋值使用
 * @param {} options 
 */
export function convertMap(options) {
    const resultMap = {}
    // const resultMap = options.map(e =>{
    //     return {
    //       [e.dictCode]:e.dictName,
    //     }
    //  })
    options.forEach(e =>{
        resultMap[e.dictCode] = e.dictName
    })
     return resultMap
}
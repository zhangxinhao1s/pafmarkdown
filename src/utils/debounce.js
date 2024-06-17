export const debounce = function (func, wait) {
    let timeout
    return function () {
        let context = this //传给目标函数
        clearTimeout(timeout)
        timeout = setTimeout(() => { func.apply(context, arguments) }, wait)
    }
}
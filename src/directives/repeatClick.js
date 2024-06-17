
function install(Vue,option = {}){
    Vue.directive(option.name || 'repeatClick',{
        inserted(el,binding){
            el.addEventListener('click',()=>{
                if(!el.disabled){
                    el.disabled = true
                    setTimeout(()=>{
                        el.disabled = false
                    },binding.value || 1500)
                }
            })
        }
    })
}

export default { install}
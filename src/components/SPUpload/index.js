import uploadDialog from './uploadDialog.vue'

uploadDialog.install = (Vue) => {
    Vue.component(uploadDialog.name, uploadDialog)
}

export default uploadDialog
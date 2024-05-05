import Icon from './index.vue'

//为组件单独提供install安装方法，供按需引入
Icon.install = (app: any) => {
    app.component(Icon.name, Icon)
}

export default Icon
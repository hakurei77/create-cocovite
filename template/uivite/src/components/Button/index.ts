import Button from './index.vue'

//为组件单独提供install安装方法，供按需引入
Button.install = (app: any) => {
    app.component(Button.name, Button)
}

export default Button   
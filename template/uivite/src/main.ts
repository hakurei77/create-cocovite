import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './styles/index.scss'

import Icon from '@/components/Icon/index.vue'
import Button from '@/components/Button/index.vue'

const app = createApp(App)

const componentsArr = [
    Icon,
    Button
]
componentsArr.forEach((component) => {
    app.component(component.name as string, component)
})


app.use(router)

app.mount('#app')

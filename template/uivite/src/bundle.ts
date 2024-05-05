import './styles/index.scss';

import Icon from '@/components/Icon/index.vue'
import Button from '@/components/Button/index.vue'

const componentsArr = [
    Icon,
    Button
]

const install = (app: any) => {
    componentsArr.forEach((component) => {
        app.component(component.name, component)
    })

}

export default {
    install
}

export {
    install,
    Icon,
    Button
}

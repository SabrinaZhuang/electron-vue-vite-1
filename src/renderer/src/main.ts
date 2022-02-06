import { createApp } from 'vue'
import App from './App.vue'
import element from 'element-plus'
import 'element-plus/dist/index.css'
// import './registerServiceWorker'
import router from './router'
import store from './store'
import Components from './components/global/index'
import * as icons from '@element-plus/icons-vue'

import svgIcon from './assets/icon/svgIcon.vue'

const app =createApp(App)
for (const name in icons) {
  app.component(name, (icons as any)[name])
}
app.config.globalProperties.$ELEMENT = { size: 'small', zIndex: 3000 }
app.use(element)
  .use(router)
  .use(store)
  .use(Components)
  .component('svg-icon', svgIcon)
  .mount('#app')
  .$nextTick(window.removeLoading)

console.log('fs', window.fs)
console.log('ipcRenderer', window.ipcRenderer)
console.log(Components)
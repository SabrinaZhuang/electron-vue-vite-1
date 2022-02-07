/*
 * @Description:
 * @Author: gumingchen
 * @Email: 1240235512@qq.com
 * @Date: 2021-04-29 17:23:32
 * @LastEditors: gumingchen
 * @LastEditTime: 2021-04-30 17:47:52
 */
import { createStore } from 'vuex'
// import path from 'path'

// const requireModules = require.context('./modules', true, /index\.(ts|js)$/iu)
// const modules = {}

// 使用require.context()自动获取模块


// for (const keys in moduleFiles) {
//     moduleFiles[keys]().then(res => { 
//       let name = path.resolve(keys, '..')
//       name = name.split('/').pop()
//       modules[keys]={namespaced:true, ...res.default} })
// }
// for (const keys in moduleFiles) {
//   moduleFiles[keys]().then(res => { modules.push(res.default) })
// }


// requireModules.keys().forEach(filePath => {
//   const modular = requireModules(filePath)
//   let name = path.resolve(filePath, '..')
//   name = name.split('/').pop()
//   modules[name] = {
//     namespaced: true,
//     ...modular.default
//   }
// })


// 直接引入所有的模块
const modulesFiles = import.meta.globEager('./modules/**/*.*s')
const modules = {}
for (const key in modulesFiles) {
  modules[((key.replace(/(\.\/modules\/|\.js)/g, '')).split('/')).shift()] = modulesFiles[key].default
}

Object.keys(modules).forEach(item => {
  modules[item]['namespaced'] = true
})

const store = createStore({
  modules,
})


// const store = createStore({
//   modules: {
//     ...modules
//   }
// })
// console.log('模块',modulesFiles,modules,store)
export default store

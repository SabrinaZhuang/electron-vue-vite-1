import { upperFirst, camelCase } from 'lodash'


export default {
install: function(app){
    const globalComponents=import.meta.globEager('./**/**.**')
    
    for (const key in globalComponents) {
      const component = []
    let name=key.replace(/(\.\w+|\.)/g, '')
    name=upperFirst(
      camelCase(
        name
        .split('/')
        .filter(item => item !== '')
        .shift()
        )
        )
    component[name] = globalComponents[key]
    app.component(`G${ name }`,component[name].default||component[name])
    // console.log('name:',name,'default',component[name].default,'component',component[name])
    }

  }
}



import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import echarts from 'echarts'
import type from './store/type'
import 'animate.css'

Vue.config.productionTip = false
Vue.prototype.$echarts = echarts;
Vue.use(ElementUI)

router.beforeEach((to, from, next) => {
  if (to.path != "/login") {
      if (type.getTypes(store.getters.getCurrentUser) === "Object") {
          next();
      } else {
          next("/login")
      }
  } else {
      next();
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

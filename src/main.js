// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import "./assets/index.css";
import "./assets/materialdesignicons.min.css";
import './assets/main.css';

import ElementUI from 'element-ui'
import lang from 'element-ui/lib/locale/lang/ru-RU'

Vue.config.productionTip = false

Vue.use(ElementUI, {
    size: 'mini',
    locale: lang,
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

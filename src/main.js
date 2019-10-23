import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./registerServiceWorker";
import BootstrapVue from "bootstrap-vue";

import "./components/sensors";

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

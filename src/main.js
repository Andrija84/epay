import Vue from 'vue'
import App from './App.vue'

import VueSuggestion from 'vue-suggestion';

Vue.use(VueSuggestion);

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

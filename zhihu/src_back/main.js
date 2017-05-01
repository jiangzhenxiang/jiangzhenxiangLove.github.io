// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App'
import router from './router'
// 轮播图组件
import swipe from './components/swipe/swipe.vue'
// 返回顶部组件
import backScroll from './components/backScroll.vue'
// 当拉倒页面最下方是，加载更多
import infinite from './components/infiniteScroll.vue'
Vue.use( Vuex )
Vue.use( VueRouter )
Vue.component( swipe.name, swipe )
Vue.component(backScroll.name,backScroll)
Vue.component(infinite.name,infinite)
const store = new Vuex.Store({
	state:{
		num:1,
		drawer:false,
		circleFlag:false
	},
	mutations:{
		add:(state,n) => state.num = n,
		back(state,n) {
			if(n){
				state.drawer=false
			}else{
				state.drawer=true
			}
		},
		toggle(state,n){
			if(n){
				state.circleFlag = true
			}else{
				state.circleFlag = false
			}
		}
	}
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  // components: { App }
  ...App
})
let dom = document.querySelector('.app-view');
router.beforeEach((to,from,next)=>{
	if(to.path=='/article'){
		dom=document.querySelector('.app-view');
		indexScrollTop=dom.scrollTop;
		store.commit('back');
	}else{
		store.commit('back',1);
	}
	store.commit('toggle');
	next()
})
router.afterEach( ( to, from, next ) => {
	if ( to.path == '/article' ) {
		dom.scrollTop = 0;
	} else {
		Vue.nextTick( () => {
			dom.scrollTop = indexScrollTop;
		} );
	}
} );

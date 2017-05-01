import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home/Home.vue'
import Article from '../components/Article/Article.vue'
import Theme from '../components/Theme/Theme.vue'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
    	path:'/article',
    	component:Article,
    	name:"article"
    },
    {
    	path:'/theme',
    	component: Theme,
    	name:'theme'
    },
    {
    	path:'*',
    	redirect:'/'
    }
  ]
})
export default router

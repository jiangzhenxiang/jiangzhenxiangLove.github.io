<template>
  <div id="app">
    <header class="header">
      <i v-if="!flag" @click="toggle(true)" class="iconfont icon-ic_menu"></i>
      <!-- 点击菜单按钮，弹出左侧主题列表 -->
      <i v-if="flag" @click="back()" class="iconfont icon-ic_back"></i>
    </header>
      <!-- 再次点击左侧列表列表隐藏； 
      动态绑定class样式  -->
    <aside class="aside" :class="{open:open,docked:docked}" @click="toggle()">
      <ul>
        <li :class="{chose:num ==1}" @click="change(1)">
          <span>首页</span>
          <i class="iconfont" :class="{'iconcolor icon-ic_star_black':num == 1,'icon-ic_star':num != 1}" />
        </li>
        <li :class="{chose:num==index+2}" v-for="(x,index) in list" @click="change(index+2),x.id">
          <span>{{x.name}}</span>
          <i class="iconfont" :class="{'iconcolor icon-ic_star_black':num == index+2,'icon-ic_star':num != index+2}" />
        </li>
      </ul>
      <!-- 遮罩层 -->
      <div class="cover" @touchmove="prevent"></div>
    </aside>
    <!-- 返回顶部 -->
    <div v-if="circle" class="circle" @click="top()">
      <i class="iconfont icon-ic_top"></i>
    </div>

    <transition :name="transitionName">
      <keep-alive>
        <router-view class="app-view" :class="{'app-view-hidden':docked}"></router-view>
      </keep-alive>
    </transition>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import api from './api/index.js'
export default {
  // name: 'app',
  computed:{
    ...mapState({
      num: state => state.num,
      flag: state => state.drawer,
      circle:state => state.circleFlag
    })
  },
  mounted:function(){
    let that = this;
    api.getTopics().then(function(data){
        that.list = data.data.others;
    });
  },
  data(){
    return {
      list:[],
      open:false,
      docked:false,
      transitionName:'slide-left',
    }
  },
  watch: {
    '$route' (to, from) {
      this.transitionName = to.path != "/article" ? 'slide-right' : 'slide-left';
    }
  },
  // created(){
  //   var that = this;
  //   //请求知乎数据
  //   axios.get("http://localhost:8080/api/zhihu")
  //   .then(function(response){
  //     console.log('成功获取zhihu');
  //     that.zhihu=response.data;
  //     that.stories=that.zhihu.stories;
  //     console.log(that.stories);
  //   }).catch(function(error){
  //     console.log(error)
  //   });
  // },
  methods:{
    // 返回
    back(n) {
      if (n) {
        this.$router.push({
          path: 'home'
        });
      } else {
        window.history.back()
      }
    },
    // 显示隐藏左侧边栏
    toggle(flag){
      if(!this.open){
        this.docked = true;
        this.open = true;
      }else{
        this.open = false;
        let that = this;
        setTimeout(function(){
          that.docked = false;
        },300);
      }
    },
    // 改变星星
    change(n,id){
      let path = n == 1?"home":"theme";
      this.$router.push({
        path:path,
        query:{
          id: id || ""
        }
      });
      this.$store.commit('add',n);
    },
    // 阻止默认事件
    prevent(event) {
      event.preventDefault()
      event.stopPropagation()
    },
    //返回顶部
    top() {
      let vue = this;
      let dom = document.querySelector('.app-view');
      let height = dom.scrollTop;
      let scrollTop = parseInt(height / 50);
      let time = setInterval(function() {
        height -= scrollTop;
        if (height <= 0) {
          dom.scrollTop = 0;
          vue.$store.commit('toggle');
          clearInterval(time);
        } else {
          dom.scrollTop = height;
        }
      }, 1);
    }
  }
}
</script>

<style lang="less">
.slide-left-enter,
.slide-right-leave-active{
    opacity:0;
    --webkit-transform: translate(50vw,0);
}
.slide-left-leave-active,
.slide-right-enter{
    opacity:0.1;
    --webkit-transform: translate(-50vm,0);
}
.app-view{
    z-index:1;
    width: 100vw;
    height: 100vh;
    overflow:auto;
    position: absolute;
    transition:transition 0.3s ease;
    -webkit-overflow-scrolling:touch;
}
.app-view-hidden{
    overflow:hidden;
}
.header{
  width: 100%;
  height: 1.5rem;
  z-index: 9;
  padding-left: 5%;
  position: fixed;
  background-image: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.51) 95%);
  .iconfont{
    color: #fff;
    font-size: 0.8rem;
    top: 20%;
    position: relative;
  }
}
.aside{
  z-index: 11;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  position: fixed;
  visibility: hidden;
  
  ul{
    margin: 0;
    float: left;
    width: 60%;
    height: 100%;
    padding: 1.3rem 0.5rem 0.5rem;
    overflow: auto;
    background: rgba(91, 116, 146, 0.75);
    transform:translate(-100%,0);
    transition:transform 0.3s ease;
    -webkit-overflow-scrolling:touch;
    li{
      cursor: pointer;
      font-size: 0.43rem;
      list-style: none;
      color: #fff;
      margin-top: 20px;
      .iconfont{
        float: right;
        font-size: 0.6rem;
      }
      &.chose{
        color:#ffd300;
      }
    }
  }
  .cover{
    width: 100%;
    height: 100%;
    opacity: 0;
    display: none;
    background: rgba(172, 185, 201, 0.4);
    transtion:opacity 0.3s ease;
  }
  &.open{
    ul{
      transform:translate(0);
    }
    .cover{
      opacity:1;
    }
  }
  &.docked{
    visibility:visible;
    .cover{
      display:block;
    }
  }
}

.circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255,255,255,0.80);
    box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);
    right: 5%;
    bottom: 5vw;
    position: fixed;
    z-index: 10;
    i {
        top: 50%;
        left: 50%;
        font-size: 0.6rem;
        color: #ACB9C9;
        transform: translate(-50%, -50%);
        position: absolute;
    }
}
@media screen and (min-width: 640px) {
    .app-view {
        width: 640px;
        left: 50%;
        transform: translate(-50%,0);
    }
    .aside ul {
        width: 350px;
    }
}
</style>

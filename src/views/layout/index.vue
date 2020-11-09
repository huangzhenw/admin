<template>
  <div>
    <el-container
      style="
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        overflow: hidden;
      "
    >
      <el-header class="d-flex align-items-center" style="background: #545c64">
        <a class="h5 text-light mb-0 mr-auto">{{ $conf.logo }}</a>
        <el-menu
          :default-active="navBar.active"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item
            :index="index | numToString"
            v-for="(item, index) in navBar.list"
            :key="index"
            >{{ item.name }}</el-menu-item
          >
          <el-submenu index="100">
            <template slot="title">
              <el-avatar
                size="small"
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              ></el-avatar>
              weision
            </template>
            <el-menu-item index="100-1">修改</el-menu-item>
            <el-menu-item index="100-2">推出</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <el-container style="height: 100%">
        <!-- 侧边布局 -->
        <el-aside width="200px">
          <el-menu
            :default-active="slideActive | numToString"
            @select="slideSelect"
          >
            <el-menu-item
              :index="index | numToString"
              v-for="(item, index) in slideMenus"
              :key="index"
            >
              <i class="el-icon-menu"></i>
              <span slot="title">{{ item.name }}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <!-- 主布局 -->
        <el-main
          class="bg-light"
          style="padding-bottom: 60px; position: relative"
        >
          <!-- 面包屑 -->
          <div
            class="border-bottom mb-3 bg-white"
            v-if="bran.length > 0"
            style="padding: 20px; margin: -20px"
          >
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item
                v-for="(item, index) in bran"
                :key="index"
                :to="{ path: item.path }"
              >
                {{ item.title }}</el-breadcrumb-item
              >
            </el-breadcrumb>
          </div>
          <!-- 主内容 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script >
import common from "common/mixins/common.js"
export default {
  mixins: [common],
  data() {
    return {
      bran: [],
      slideList: [],
      navBar: {}
    };
  },
  created() {
    // 获取面包屑导航
    this.getRouterBran()
    this.navBar = this.$conf.navBar
    // 初始化选中菜单
    this.__initNavBar()
  },
  computed: {
    slideMenus() {
      return this.navBar.list[this.navBar.active].submenu || []
    },
    slideActive() {
      return this.navBar.list[this.navBar.active].subActive || '0'
    }
  },
  watch: {
    '$route'(to, from) {
      // 本地存储
      localStorage.setItem('navActive', JSON.stringify({
        top: this.navBar.active || '0',
        left: this.slideMenuActive || '0'
      }))
      this.getRouterBran()
    }
  },
  methods: {
    __initNavBar() {
      let r = localStorage.getItem('navActive')
      if (r) {
        r = JSON.parse(r)
        this.navBar.active = r.top
        this.slideMenuActive = r.left
      }
    },
    // 获取面包屑导航
    getRouterBran() {
      let b = this.$route.matched.filter(v => v.name)
      let arr = []
      b.forEach((v, k) => {
        // 过滤layout和index
        if (v.name === 'index' || v.name === 'layout') return
        arr.push({
          name: v.name,
          path: v.path,
          title: v.meta.title
        })
      })
      if (arr.length > 0) {
        arr.unshift({ name: 'index', path: '/index', title: '后台首页' })
      }
      this.bran = arr
    },
    handleSelect(key, keyPath) {
      this.navBar.active = key
      this.slideMenuActive = '0'
      if (this.slideMenus.length > 0) {
        this.$router.push({
          name: this.slideMenus[this.slideMenuActive].pathname
        })
      }
    },
    slideSelect(key, keyPath) {
      this.navBar.list[this.navBar.active].subActive = key
      // 跳转到指定页面
      this.$router.push({
        name: this.slideMenus[key].pathname
      })
    },
  }
}
</script>

<style>
</style>

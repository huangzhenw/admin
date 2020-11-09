import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: 'layout/index',
    children: [
        {
            meta:{title:'后台首页'},
            component: 'index/index',
        },
        {
            meta:{title:'商品列表'},
            component: 'shop/goods/list',
        }
    ]
  },
  {
    meta:{title:'登录页'},
    component: 'login/index'
  },
  {
    path: '*',
    redirect: { name: 'index' }
  }
]

// 获取路由信息方法
let getRoutes = function() {
    createRoute(routes)
    return routes
}

// 自动生成路由方法
function  createRoute(arr) {
    for (let i = 0; i < arr.length; i++) {
        if(!arr[i].component) return
        // 去除index
        let val = getValue(arr[i].component)
        // 生成name
        arr[i].name = arr[i].name || val.replace(/\//g,'_')
        // 生成pah
        arr[i].path = arr[i].path || `/${val}`
        // 自动生成component
        let componentFun =  import(`../views/${arr[i].component}.vue`)
        arr[i].component = ()=>componentFun
        if(arr[i].children && arr[i].children.length>0){
            createRoute(arr[i].children)
        }
    }
}

// 去除index
function getValue(str) {
    // str = login/index
    // 获取最后一个/的索引
    let index = str.lastIndexOf('/')
    // 获取最后一个/后面的值
    let val = str.substring(index+1,str.length)
    if(val==='index'){
        return str.substring(index,-1)
    }
    return str
}

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes:getRoutes()
})

export default router

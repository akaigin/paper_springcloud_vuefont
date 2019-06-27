import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Dashboard from '@/components/Dashboard'
import Index from '@/components/welcome/index.vue'

import BookList from '@/components/role/list'

import TeacherList from '@/components/user/teacherList'
import StudentList from '@/components/user/studentList'
import UserList from '@/components/user/list'
import UserChangePwd from '@/components/user/changepwd'
import UserProfile from '@/components/user/profile'

import MenuList from '@/components/menu/list'

import FileList from '../components/file/List.vue'
import PlanList from '../components/file/planList.vue'
import LogList from '../components/log/List'

import ReportList from '../components/report/reportList'
import Editor from '../components/article/editorTinymce'
import CheckList from '../components/report/checkList'
import error from '../components/404.vue'
import ArticleList from '../components/article/List.vue'
import PersonalArticleList from '../components/article/personalList.vue'

import ArticleView from '../components/article/ViewArticle.vue'
// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/components/Login'], resolve)

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/index',
      name: '首页',
      component: Index
    },
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/',
      name: 'home',
      component: Home,
      redirect: '/dashboard',
      leaf: true, // 只有一个节点
      menuShow: true,
      iconCls: 'fa fa-home', // 图标样式class
      children: [
        {path: '/dashboard', component: Dashboard, name: '首页', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '用户管理',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'fa fa-user', // 图标样式class
      children: [
        {path: '/admin/user', component: UserList, name: '用户列表', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '教师信息管理',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'fa fa-user', // 图标样式class
      children: [
        {path: '/admin/teacher/info', component: TeacherList, name: '教师列表', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '学生信息管理',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'fa fa-user', // 图标样式class
      children: [
        {path: '/admin/student/info', component: StudentList, name: '学生列表', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '菜单管理',
      menuShow: true,
      leaf: true, // 只有一个节点
      iconCls: 'fa fa-server', // 图标样式class
      children: [
        {path: '/admin/menu', component: MenuList, name: '菜单列表', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '角色管理',
      menuShow: true,
      leaf: true,
      iconCls: 'fa fa-group',
      children: [
        {path: '/admin/role', component: BookList, name: '角色管理', menuShow: true},
      ]
    },

    {
      path: '/',
      component: Home,
      name: '文件管理',
      menuShow: true,
      leaf: true,
      iconCls: 'fa fa-group',
      children: [
        {path: '/cms/file', component: FileList, name: '文件管理', menuShow: true},
      ]
    },
    {
      path: '/',
      component: Home,
      name: '教学安排管理',
      menuShow: true,
      leaf: true,
      iconCls: 'fa fa-group',
      children: [
        {path: '/cms/plan', component: PlanList, name: '教学安排管理', menuShow: true},
      ]
    },
    {
      path: '/',
      component: Home,
      name: '个人报告管理',
      menuShow: true,
      leaf: true,
      iconCls: 'fa fa-group',
      children: [
        {path: '/report/personal', component: ReportList, name: '个人报告管理', menuShow: true},
      ]
    },
    {
      path: '/',
      component: Home,
      name: '审核报告',
      menuShow: true,
      leaf: true,
      iconCls: 'fa fa-group',
      children: [
        {path: '/report/check', component: CheckList, name: '审核报告', menuShow: true},
      ]
    },
    {
      path: '/',
      component: Home,
      name: '文章创作',
      menuShow: true,
      leaf: true,
      iconCls: 'fa fa-group',
      children: [
        {path: '/article/editor', component: Editor, name: '文章创作', menuShow: true},
      ]
    },
    /*{
      path: '/',
      component: Home,
      name: '创作文章',
      menuShow: true,
      leaf: true,
      iconCls: 'fa fa-group',
      children: [
        {path: '/article/create', component: ArticleDetail, name: '审核报告', menuShow: true},
      ]
    },*/
    {
      path: '/',
      component: Home,
      name: '文章列表',
      menuShow: true,
      leaf: true,
      iconCls: 'fa fa-group',
      children: [
        {path: '/article/list', component: ArticleList, name: '文章列表', menuShow: true},
      ]
    },
    {
      path: '/',
      component: Home,
      name: '个人文章列表',
      menuShow: true,
      leaf: true,
      iconCls: 'fa fa-group',
      children: [
        {path: '/article/personList', component: PersonalArticleList, name: '个人文章列表', menuShow: true},
      ]
    },
    {
      path: '/',
      component: Home,
      name: '阅读文章',
      menuShow: true,
      leaf: true,
      iconCls: 'fa fa-group',
      children: [
        {path: '/article/view', component: ArticleView, name: '阅读文章', menuShow: true},
      ]
    },
    {
      path: '/',
      component: Home,
      name: '日志管理',
      menuShow: true,
      leaf: true,
      iconCls: 'fa fa-group',
      children: [
        {path: '/base/log', component: LogList, name: '日志管理', menuShow: true},
      ]
    },
    {
      path: '/',
      component: Home,
      name: '设置',
      menuShow: true,
      iconCls: 'iconfont icon-setting1',
      children: [
        {path: '/user/profile', component: UserProfile, name: '个人信息', menuShow: true},
        {path: '/user/changepwd', component: UserChangePwd, name: '修改密码', menuShow: true}
      ]
    },

    {
      path: '/',
      component: Home,
      name: '注册服务',
      menuShow: true,
      iconCls: 'iconfont icon-setting1',
      children: [
        {path: '/service',component: UserProfile,  redirect: 'http://baidu.com',target:'_blank',name: '个人信息', menuShow: true},
      ]
    },

    {path:'*',component: error, meta: {title: '页面走丢了'}},
  ]
})

router.beforeEach((to, from, next) => {
  // console.log('to:' + to.path)
  if (to.path.startsWith('/login')) {
    window.localStorage.removeItem('access-token')
    //window.localStorage.removeItem('access-user')
    next()
  } else if (to.path.startsWith('/index')) {
    next()
  } else {
    //let user = JSON.parse(window.localStorage.getItem('access-token'))
    let user = window.localStorage.getItem('access-token');
    if (!user) {
      next({path: '/login'})
    } else {
      next()
    }
  }
})

export default router

/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  //登录
  login: params => {
    return API.POST('/api-admin/oauth/token', params)
  },
  //登出
  logout: params => {
    return API.GET('/api-admin/logout', params)
  },
  tokenUser: params =>{
    return API.GET('/api-admin/user/currentUser',params)
  },
  //查询获取user列表(通过page分页)
  findList: params => {
    return API.GET('/api-admin/user', params)
  },

  //查询获取教师列表(通过page分页)
  findTeacherList: (params,roleId) => {
    return API.GET('/api-admin/user/roleId/'+roleId, params)
  },

  //增加用户
  addUser:params =>{
    return API.POST('/api-admin/user',params)
  },
  //修改用户
  editUser:params =>{
    return API.PUT('/api-admin/user',params)
  },
  //删除用户
  removeUser:params =>{
    return API.DELETE('/api-admin/user',params)
  },

  router: params =>{
    return API.GET('/api-admin/router',params)
  },

  changePwd: params =>{
    return API.PUT('/api-admin/user/changePwd',params)
  }
}

/**
 * Created by bootdo.
 * 用户相关api
 */
import * as API from './'

export default {
  //查询获取plan列表(通过page分页)
  findList: params => {
    return API.GET('/api-admin/plan/list', params)
  },
  //增加plan
  addPlan:params =>{
    return API.POST('/api-admin/plan',params)
  },
  //修改plan
  editPlan:params =>{
    return API.PUT('/api-admin/plan',params)
  },
  //删除plan
  removePlan:params =>{
    return API.DELETE('/api-admin/plan',params)
  },

}

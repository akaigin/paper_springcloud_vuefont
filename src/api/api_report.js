/**
 * Created by bootdo.
 * 报告相关api
 */
import * as API from './'

export default {
  //查询获取report列表(通过page分页)
  findList: params => {
    return API.GET('/api-admin/report/list', params)
  },
  //增加report
  save:params =>{
    return API.POST('/api-admin/report',params)
  },
  //修改report
  update:params =>{
    return API.PUT('/api-admin/report',params)
  },
  //删除report
  remove:params =>{
    return API.DELETE('/api-admin/report',params)
  },
  getGuidance:params =>{
    return API.GET('/api-admin/report/guidance',params)
  },
  writeGuidance:params =>{
    return API.POST('/api-admin/report/guidance',params)
  },
}

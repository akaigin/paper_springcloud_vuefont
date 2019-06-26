/**
 * Created by bootdo.
 * 文章相关api
 */
import * as API from './'

export default {
  //查询获取article列表(通过page分页)
  findList: params => {
    return API.GET('/api-admin/article/list', params)
  },
  //增加article
  save:params =>{
    return API.POST('/api-admin/article',params)
  },
  //修改article
  update:params =>{
    return API.PUT('/api-admin/article',params)
  },
  //删除article
  remove:params =>{
    return API.DELETE('/api-admin/article',params)
  },
  getArticle: params => {
    return API.GET('/api-admin/article', params)
  },
  clickPlus: params => {
    return API.PUT('/api-admin/article/click',params)
  }
}

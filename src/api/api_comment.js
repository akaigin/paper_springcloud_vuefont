/**
 * Created by bootdo.
 * 评论相关api
 */
import * as API from './'

export default {
  //查询获取article列表(通过page分页)
  findList: params => {
    return API.GET('/api-admin/comment/list', params)
  },
  //增加article
  save:params =>{
    return API.POST('/api-admin/comment',params)
  },
  updateLikeNum:params =>{
    return API.PUT('/api-admin/comment/updateLikeNum',params)
  },

}

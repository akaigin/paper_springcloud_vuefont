/**
 * Created by bootdo.
 * 评论回复相关api
 */
import * as API from './'

export default {
  //查询获取article列表(通过page分页)
  findList: params => {
    return API.GET('/api-admin/article/list', params)
  },
}

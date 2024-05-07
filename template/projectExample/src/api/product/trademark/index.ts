//书写品牌管理模块接口
import request from '@/utils/request'
import type { TrademarkResData, Trademark } from './type'
enum API {
  //获取已有品牌接口
  TRADEMARK_URL = '/admin/product/baseTrademark/',
  //添加品牌
  ADDTRADEMARK_URL = '/admin/product/baseTrademark/save',
  //修改品牌
  UPDATETRADEMARK_URL = '/admin/product/baseTrademark/update',
  //删除品牌
  DELETETRADEMARK_URL = '/admin/product/baseTrademark/remove/',
}

//获取已有品牌数据的接口方法
export const reqHasTrademark = (page: number, limit: number) =>
  request.get<any, TrademarkResData>(API.TRADEMARK_URL + `${page}/${limit}`)

//添加与修改已有品牌的方法
export const reqAddOrUpdateTrademark = (data: Trademark) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATETRADEMARK_URL, data)
  } else {
    return request.post<any, any>(API.ADDTRADEMARK_URL, data)
  }
}

//删除品牌的接口方法
export const reqDeleteTrademark = (id: number) =>
  request.delete<any, any>(API.DELETETRADEMARK_URL + id)

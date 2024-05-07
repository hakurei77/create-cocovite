//书写属性相关API文件
import request from '@/utils/request'
import type { CategoryResponseData, AttrResponseData, Attr } from './type'
enum API {
  C1_URL = '/admin/product/getCategory1', //获取一级分类接口地址
  C2_URL = '/admin/product/getCategory2/',
  C3_URL = '/admin/product/getCategory3/',
  ATTR_URL = '/admin/product/attrInfoList/', //获取分类下已有属性与属性值
  ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
  DELETEATTR_URL = '/admin/product/deleteAttr/',
}

export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)
export const reqC2 = (c1Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C2_URL + c1Id)
export const reqC3 = (c2Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C3_URL + c2Id)
export const reqAttr = (
  c1Id: number | string,
  c2Id: number | string,
  c3Id: number | string,
) =>
  request.get<any, AttrResponseData>(API.ATTR_URL + `${c1Id}/${c2Id}/${c3Id}`)

export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADDORUPDATEATTR_URL, data)

export const reqDeleteAttr = (attrId: number) =>
  request.delete<any, any>(API.DELETEATTR_URL + attrId)

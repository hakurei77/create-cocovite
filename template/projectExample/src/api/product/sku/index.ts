import request from '@/utils/request'
import { SkuResponseData, SkuInfoData } from './type'

enum API {
  SKU_URL = '/admin/product/list/',
  //商品上架
  SALE_URL = '/admin/product/onSale/',
  //商品下架
  CANCELSALE_URL = '/admin/product/cancelSale/',
  //获取商品详情的接口
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  REMOVESKU_URL = '/admin/product/deleteSku/',
}

export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)

export const reqSaleSku = (skuId: number) =>
  request.get<any, any>(API.SALE_URL + skuId)

export const reqCancelSaleSku = (skuId: number) =>
  request.get<any, any>(API.CANCELSALE_URL + skuId)

export const reqSkuInfo = (skuId: number) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)

export const reqRemoveSku = (skuId: number) =>
  request.delete<any, any>(API.REMOVESKU_URL + skuId)

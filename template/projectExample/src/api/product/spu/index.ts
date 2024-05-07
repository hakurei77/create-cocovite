import request from '@/utils/request'
import type {
  HasSpuResponseData,
  AllTrademark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SpuData,
  SkuData,
  SkuInfoData,
} from './type'
enum API {
  HASSPU_URL = '/admin/product/',
  //获取全部品牌数据
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  //获取某个SPU下的全部售卖商品的图片数据
  IMAGE_URL = '/admin/product/spuImageList/',
  //获取某个SPU下全部销售属性
  SPUSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  //获取整个项目全部的销售属性
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  //追加一个新的spu
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  //更新已有的spu
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  //追加一个新的sku
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  //查看某个已有spu下全部sku
  SKUINFO_URL = '/admin/product/findBySpuId/',
  //删除一个SPU
  DELETESPU_URL = '/admin/product/deleteSpu/',
}

export const reqHasSpu = (page: number, limit: number, c3Id: string | number) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page} / ${limit}?category3Id=${c3Id}`,
  )
//获取全部的SPU的品牌数据
export const reqAllTrademark = () =>
  request.get<any, AllTrademark>(API.ALLTRADEMARK_URL)
//获取某个SPU下的全部售卖商品的图片数据
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)
//获取某个已拥有的SPU的销售属性
export const reqSpuSaleAttr = (spuId: number) =>
  request.get<any, SaleAttrResponseData>(API.SPUSALEATTR_URL + spuId)
//获取全部销售属性
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)

//添加一个新的SPU
export const reqAddOrUpdateSpu = (data: SpuData) => {
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}

//添加sku
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data)

//查看sku列表
export const reqSkuList = (spuId: number | string) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)

export const reqRemoveSpu = (spuId: number | string) =>
  request.delete<any, any>(API.DELETESPU_URL + spuId)

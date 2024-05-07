import request from '@/utils/request'
import type { PermissionResponseData, menuParams } from './type'
enum API {
  PERMISSIONLIST_URL = '/admin/acl/permission',
  ADDPERMISSION_URL = '/admin/acl/permission/save',
  UPDATEPERMISSION_URL = '/admin/acl/permission/update',
  DELETEMENU_URL = '/admin/acl/permission/remove/',
}

export const reqPermissionList = () =>
  request.get<any, PermissionResponseData>(API.PERMISSIONLIST_URL)

export const reqAddOrUpdatePermission = (data: menuParams) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEPERMISSION_URL, data)
  } else {
    return request.post<any, any>(API.ADDPERMISSION_URL, data)
  }
}

export const reqDeleteMenu = (id: number) =>
  request.delete<any, any>(API.DELETEMENU_URL + id)

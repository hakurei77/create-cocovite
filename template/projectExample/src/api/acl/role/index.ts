import request from '@/utils/request'
import { RolesResponseData, RoleData, PermissionResponseData } from './type'
enum API {
  ROLES_URL = '/admin/acl/role/',
  ADDROLE_URL = '/admin/acl/role/save',
  UPDATEROLE_URL = '/admin/acl/role/update',
  DELETEROLE_URL = '/admin/acl/role/remove/',
  GETMENU_URL = '/admin/acl/permission/toAssign/',
  SETPERMISSION_URL = '/admin/acl/permission/doAssign/?',
}

export const reqRoles = (page: number, limit: number, roleName: string) =>
  request.get<any, RolesResponseData>(
    API.ROLES_URL + `${page}/${limit}/?roleName=${roleName}`,
  )

export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}

export const reqDeleteRole = (id: number) =>
  request.delete<any, any>(API.DELETEROLE_URL + id)

export const reqAllMenuList = (id: number) =>
  request.get<any, PermissionResponseData>(API.GETMENU_URL + id)

export const reqSetPermission = (roleId: number, permissionId: number[]) =>
  request.post<any, any>(
    API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`,
  )

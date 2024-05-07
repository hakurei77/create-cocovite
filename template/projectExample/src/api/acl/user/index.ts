import request from '@/utils/request'
import type {
  UserResponseData,
  UserData,
  AllRollResponseData,
  setRoleParamsData,
} from './type'
enum API {
  ALLUSER_URL = '/admin/acl/user/',
  ADDUSER_URL = '/admin/acl/user/save',
  UPDATEUSER_URL = '/admin/acl/user/update',
  ALLROLE_URL = '/admin/acl/user/toAssign/',
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  DELETEUSER_URL = '/admin/acl/user/remove/',
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove',
}

export const reqAllUser = (page: number, limit: number, username: string) =>
  request.get<any, UserResponseData>(
    API.ALLUSER_URL + `${page}/${limit}/?username=${username}`,
  )

export const reqAddOrUpdateUser = (data: UserData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}

export const reqAllRole = (id: number) =>
  request.get<any, AllRollResponseData>(API.ALLROLE_URL + id)

export const reqSetRole = (data: setRoleParamsData) =>
  request.post<any, any>(API.SETROLE_URL, data)

export const reqRemoveUser = (id: number) =>
  request.delete<any, any>(API.DELETEUSER_URL + id)

export const reqRemoveSelectUser = (idList: number[]) =>
  request.delete<any, any>(API.DELETEALLUSER_URL, { data: idList })

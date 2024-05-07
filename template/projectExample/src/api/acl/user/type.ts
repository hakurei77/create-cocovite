export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

export interface UserData {
  id?: number
  createTime?: string
  updateTime?: string
  username: string
  password: string
  name: string
  phone?: null
  roleName?: string
}
export type Records = UserData[]

export interface UserResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}

export interface RoleData {
  createTime?: string
  id?: number
  remark: null
  roleName: string
  updateTime?: string
}

export type AllRole = RoleData[]

export interface AllRollResponseData extends ResponseData {
  data: {
    allRolesList: AllRole
    assignRoles: AllRole
  }
}

export interface setRoleParamsData {
  roleIdList: number[]
  userId: number
}

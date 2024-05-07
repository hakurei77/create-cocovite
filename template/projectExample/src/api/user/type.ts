//定义用户相关数据的ts类型
//用户登录接口携带参数的ts类型
export interface loginFormData {
  username: string
  password: string
}

//定义全部接口返回数据都拥有的ts类型
export interface responseData {
  code: number
  message: string
  ok: boolean
}

//定义登录接口返回数据类型
export interface loginResData extends responseData {
  data: string
}
//定义获取用户信息接口返回数据类型
export interface userInfoResData extends responseData {
  data: {
    routes: string[]
    buttons: string[]
    roles: string[]
    name: string
    avatar: string
  }
}

//登录接口需要携带参数ts类型
export interface loginForm {
    username: string,
    password: string
}

//登录接口返回的数据ts类型
export interface loginResponseData {
    code: number,
    message: string
    data: dataType
}


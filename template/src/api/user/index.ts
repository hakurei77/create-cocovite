//统一管理项目用户相关的接口
import request from '@/utils/request'
import type { loginForm, loginResponseData} from './type';
//统一管理接口
enum API {
    LOGIN_URL = "/user/login",
}
//暴露请求函数
//登录
export const getUserInfo = (data: loginForm) => {
    return request.post<any, loginResponseData>(API.LOGIN_URL, data).then(res => res.data);
}

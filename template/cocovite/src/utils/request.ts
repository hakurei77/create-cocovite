//进行axios的二次封装：使用请求与响应拦截器
import axios from 'axios';
import { ElMessage } from 'element-plus';

const request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API, // 设置请求的基础地址
    timeout: 5000, // 设置请求超时时间
})

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        config.headers.token = "123456"
        // 在发送请求之前做些什么
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        console.log("狗修金sama,请求报错了捏QAQ")
    }
)

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        // 对响应数据做点什么
        return response.data;
    }
    ,(error) => {
        //失败回调：处理http网络错误的
        //定义一个变量：存储网络错误信息
        let message = "";
        //http状态码
        let status = error.response.status;
        switch (status) {
            case 400:
                message = "请求错误";
                break;
            case 401:
                message = "未授权，请登录";
                break;
            case 403:
                message = "拒绝访问";
                break;
            case 404:
                message = `请求地址出错`;
                break;
            case 500:
                message = "服务器内部错误";
                break;
            default:
                message = "其他错误信息";
                break;
        }
        ElMessage({
            type:'error',
            message
        });
    }
)

//对外暴露
export default request
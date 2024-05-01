function createUserList() {
    return [
        {
            userId: 1,
            username:"admin",
            password: "123456",
            other:"我爱这个世界，正如这世界如此的爱着我。"
        },
    ]
}

//对外暴露一个数组：数组里面包含两个接口
//登录假的接口
//获取用户信息的假的接口
export default [
    {
        url: '/api/user/login',
        method: 'post',
        response: ({ body }) => {
            const { username, password } = body
            const userList = createUserList()
            const user = userList.find(item => item.username === username && item.password === password)
            if (user) {
                return {
                    code: 200,
                    message: '登录成功',
                    data: user
                    
                }
                
            } else {
                return {
                    code: 400,
                    message: '用户名或密码错误',
                    data: null
                }
            }
        }
    }
]
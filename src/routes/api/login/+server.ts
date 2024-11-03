import { json, type RequestHandler } from '@sveltejs/kit';
// 假设这是你的 API 路由处理程序 (例如, src/routes/api/login.js)

// export const GET: RequestHandler = async function ({ platform }) {
//     const queryResult = await platform?.env.DB.prepare('SELECT * FROM user LIMIT 5').run();
   
//     return json(queryResult);
//    };




interface LoginRequest {
    username: string;
    password: string;
}
export const POST: RequestHandler = async function ({ request, platform }) {
    // 从请求体中解析 JSON 参数
    const data: LoginRequest = await request.json();
    // 获取用户名和密码
    const { username, password } = data;
    // 进行用户验证（示例代码，可以根据实际需求修改）
    const queryResult = await platform?.env.DB
        .prepare('SELECT * FROM user WHERE username = ? AND password = ?')
        .bind(username, password)
        .run();
        
    // 根据查询结果返回响应
    if (queryResult["results"].length > 0) {
        // 用户存在，返回jwt
        const userid_1 = queryResult["results"][0]["id"];
        const username_1 = queryResult["results"][0]["username"];
        const userrole_1 = queryResult["results"][0]["role"];

        const payload = { userid: userid_1, username: username_1, userrole: userrole_1 };
        const token = btoa((JSON.stringify(payload)));
        
        const response = new Response(JSON.stringify({ message: 'Login successful', token }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': `beijiangcookie=${token};Max-Age=86400;Path=/` // 添加 JWT 到 Cookie
            }
        });
        return response;
    } else {
        // 用户不存在，返回错误响应
        return json({ message: "login failed"}, { status: 401 });
    }
};
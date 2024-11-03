import { json, type RequestHandler } from '@sveltejs/kit';
import { sleep } from '@svelteuidev/composables';
type AddCateLiquParm ={
    id:number;
    name: string,
    count : number,
    priceType : string,
    price: number,
};
type GetCateLiquCountParm = {
    count:number;
}
export const POST: RequestHandler = async function ({ url,request,platform }) {
    const now = new Date();
    const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 将时间加上 8 小时
    const isoString = beijingTime.toISOString();
    let cookieHeader = request.headers.get('cookie');
    let cookieValue = cookieHeader!.replace(/^beijiangcookie=/, ''); // 替换掉前缀
    const cookies = atob(cookieValue!);
    const username = JSON.parse(cookies).username;
    const userid = JSON.parse(cookies).userid;
    const data:AddCateLiquParm= await request.json();
    const type = url.searchParams.get('type');
    // 1 入库 ，2 出库
    if (type == "1"){
        const queryResult = await platform?.env.DB
        .prepare('INSERT INTO liquor_inventory (categoryId, count, pos,sellPrice,buyPrice,operTime,operUserId,operUserName) VALUES (?, ?, ?, ?,?, ?, ?, ?)')
        .bind(data.id, data.count, 1, 0,data.price,isoString,userid,username)
        .run();
        // 还需要在liquor_count 表中，增加数量
        const queryResult2 = await platform?.env.DB
        .prepare(`
            INSERT INTO liquor_count (categoryId, count, name) 
            VALUES (?, ?, ?)
            ON CONFLICT(categoryId) 
            DO UPDATE SET count = count + ?`)
        .bind(data.id, data.count,data.name,data.count)
        .run();

        return json(queryResult);
    }else{
      // 还需要减少数量，但是减少的数据必须小于等于库存
      const queryResult1 = await platform?.env.DB
      .prepare('SELECT count FROM liquor_count WHERE categoryId = ? And isDel = 0')
      .bind(data.id)
      .run();
      // 查看库存数量是否小于要减少数
      const data1:GetCateLiquCountParm =queryResult1.results[0]; 
      if (data1.count < data.count || data1.count == 0 ){
        return json({ok:false, message: "库存不足" }, { status: 400 });
      }
      // 可以进行减少
        const queryResult = await platform?.env.DB
        .prepare('INSERT INTO liquor_inventory (categoryId, count, pos,sellPrice,buyPrice,operTime,operUserId,operUserName) VALUES (?, ?, ?, ?,?, ?, ?, ?)')
        .bind(data.id, data.count, 2, data.price,0,isoString,userid,username)
        .run();
        // 还需要在liquor_count 表中，减少数量
        const queryResult2 = await platform?.env.DB
        .prepare("update liquor_count set count = count - ? where categoryId = ?")
        .bind(data.count,data.id)
        .run();
        
        return json(queryResult);   
    }

};


  
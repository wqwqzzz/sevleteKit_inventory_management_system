import { json, type RequestHandler } from '@sveltejs/kit';
import { sleep } from '@svelteuidev/composables';
type AddCateParm ={
    name: string,
    desc :string,
    sellPrice: number,
    buyPrice: number,
    pic:string,
};
type GetCateLiquCountParm = {
    count:number;
}
export const POST: RequestHandler = async function ({ request,platform }) {
    const now = new Date();
    const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000); // 将时间加上 8 小时
    const isoString = beijingTime.toISOString();
    let cookieHeader = request.headers.get('cookie');
    let cookieValue = cookieHeader!.replace(/^beijiangcookie=/, ''); // 替换掉前缀
    const cookies = atob(cookieValue!);
    const username = JSON.parse(cookies).username;
    const userid = JSON.parse(cookies).userid;
    const data:AddCateParm= await request.json();
    const queryResult = await platform?.env.DB
    .prepare('INSERT INTO liquor_category (name,describe,pic,buyPrice,sellPrice) VALUES (?, ?, ?, ?,?)')
    .bind(data.name,data.desc,data.pic,data.buyPrice,data.sellPrice)
    .run();
    const queryResult2 = await platform?.env.DB
    .prepare("select id from liquor_category where name = ? and buyPrice = ? and sellPrice = ?")
    .bind(data.name,data.buyPrice,data.sellPrice)
    .run();

    const queryResult1 = await platform?.env.DB
    .prepare('INSERT INTO liquor_count (categoryId,name,count) VALUES (?,?, ?)')
    .bind(queryResult2.results[0].id,data.name,0)
    .run();

    return json(queryResult2.results[0]);

};


  
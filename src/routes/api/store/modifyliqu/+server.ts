import { json, type RequestHandler } from '@sveltejs/kit';
type ModifyCateParm = {
    id:number;
    name: string,
    inventoryCount:number,
    buyPrice : number;
    sellPrice: number;
    describe:string,
}
export const POST: RequestHandler = async function ({ platform ,request}) {
    const data:ModifyCateParm= await request.json();
    const queryResult1 = await platform?.env.DB.prepare(`
        UPDATE liquor_category 
    SET 
      name = ?,
      describe = ?,
      buyPrice = ?,
      sellPrice = ?
    WHERE id = ?`).bind(data.name,data.describe,data.buyPrice,data.sellPrice,data.id).run();
    const queryResult2 = await platform?.env.DB.prepare(`
        UPDATE liquor_count 
    SET 
      name = ?,
      count = ?
    WHERE categoryId = ?`).bind(data.name,data.inventoryCount,data.id).run();

    return json(queryResult1.results);
};
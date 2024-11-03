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
      isDel = 1
    WHERE id = ?`).bind(data.id).run();
    const queryResult2 = await platform?.env.DB.prepare(`
        UPDATE liquor_count 
    SET 
      isDel = 1
    WHERE categoryId = ?`).bind(data.id).run();
    return json(queryResult1.results);
};
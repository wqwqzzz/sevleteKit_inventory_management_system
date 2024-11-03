import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async function ({ platform }) {
    const queryResult = await platform?.env.DB.prepare('SELECT c.*, COALESCE(i.count, 0) as inventoryCount FROM liquor_category c LEFT JOIN liquor_count i ON c.id = i.categoryId and i.isDel = 0 where c.isDel = 0').run();
    return json(queryResult.results);
};
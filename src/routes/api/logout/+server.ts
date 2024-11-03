import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async function ({ platform }) {
 const queryResult = await platform?.env.DB.prepare('SELECT * FROM user LIMIT 5').run();

 return json(queryResult);
};
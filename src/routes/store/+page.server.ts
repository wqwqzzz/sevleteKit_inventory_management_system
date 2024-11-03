// +page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const response = await fetch('/api/store/getliqu');
  const data: LiquData[] = await response.json();
  return {
    data
  };
};

// 定义你的数据类型
interface LiquData {
  id: number;
  name: string;
  describe: string;
  pic : string;
  buyPrice : number;
  sellPrice : number;
}
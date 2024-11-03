// stores/liquorStore.ts
import { writable } from 'svelte/store';
type Item = {
    id:number;
    name: string;
    describe: string;
    pic : string;
    buyPrice : number;
    sellPrice: number;
    inventoryCount : number;
};

interface LiquorState {
  items: Map<number,Item>;
  loading: boolean;
  error: null | Error;
}

const initialState: LiquorState = {
  items: new Map<number,Item>(),
  loading: false,
  error: null
};

export const liquorStore = writable<LiquorState>(initialState);

export class LiquorService {
  async fetchLiquors(): Promise<void> {
    liquorStore.update(s => ({ ...s, loading: true }));
    try {
      const response = await fetch('/api/store/getliqu');
      if (!response.ok) throw new Error('Network response was not ok');
      const data: Item[] = await response.json();
      // 将数组转换为 Map，以 id 为键
      const itemMap = data.reduce((map, item) => {
      map.set(item.id, item);
      return map;
      }, new Map<number, Item>());
      liquorStore.update(s => ({
        loading: false,
        error: null,
        items: itemMap
      }));
    } catch (error) {
      liquorStore.update(s => ({
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
        items: new Map<number, Item>(),
      }));
    }
  }
  // 更新项目
  updateItem(id: number, updatedItem: Partial<Item>): void {
    liquorStore.update(state => {
      const newItems = new Map(state.items);
      const existingItem = newItems.get(id);
      if (existingItem) {
        newItems.set(id, { ...existingItem, ...updatedItem });
      }
      return { ...state, items: newItems };
    });
  }

  // 添加新项目
  addItem(item: Item): void {
    liquorStore.update(state => {
      const newItems = new Map(state.items);
      newItems.set(item.id, item);
      return { ...state, items: newItems };
    });
  }

  // 删除项目
  deleteItem(id: number): void {
    liquorStore.update(state => {
      const newItems = new Map(state.items);
      newItems.delete(id);
      return { ...state, items: newItems };
    });
  }
}


export const liquorService = new LiquorService();
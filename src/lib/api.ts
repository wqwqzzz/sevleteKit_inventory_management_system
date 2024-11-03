// src/lib/api.ts
export interface User {
    name: string;
    role: string;
  }
  
  export interface Category {
    id: number;
    name: string;
    image: string;
    price: number;
  }
  // src/lib/api.ts
export interface InventoryRecord {
    id: number;
    categoryId: number;
    quantity: number;
    unitPrice: number;
    type: 'checkin' | 'checkout';
    date: Date;
  }
  
  // ... (其他代码保持不变)
  
  export async function fetchUserData(): Promise<User> {
    // 模拟异步获取用户信息
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ name: 'John Doe', role: 'Admin' });
      }, 1000);
    });
  }
  
  export async function fetchCategoryData(): Promise<Category[]> {
    // 模拟异步获取酒水品类数据
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          { id: 1, name: '啤酒', image: 'beer.jpg', price: 5 },
          { id: 2, name: '红酒', image: 'wine.jpg', price: 20 },
          // ...
        ]);
      }, 1000);
    });
  }
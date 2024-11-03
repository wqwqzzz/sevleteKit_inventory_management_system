// store/auth.ts
import { writable } from 'svelte/store';

export const isAuthenticated = writable(false);

export const checkAuth = () => {
    const cookies = document.cookie.split('; ');
    const tokenCookie = cookies.find(row => row.startsWith('beijiangcookie='));
    if (tokenCookie) {
        isAuthenticated.set(true); // 设定认证状态
    } else {
        isAuthenticated.set(false); // 未认证
    }
};
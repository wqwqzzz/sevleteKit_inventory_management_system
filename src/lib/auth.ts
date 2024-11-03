export function checkAuth(cookies: string) {
    return cookies
      .split('; ')
      .find(row => row.startsWith('beijiangcookie='))
      ?.split('=')[1];
  }
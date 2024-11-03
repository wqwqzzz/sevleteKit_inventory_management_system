<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    onMount(() => {
      const token = document.cookie
        .split(';')
        .find(row => row.startsWith('beijiangcookie='));
  
      // 在根路径时进行重定向
      if (window.location.pathname === '/') {
        if (token) {
          goto('/store');
        } else {
          goto('/login');
        }
      }
    });
  </script>
  
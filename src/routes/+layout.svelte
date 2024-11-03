<script lang="ts">
    import { SvelteUIProvider } from '@svelteuidev/core';
</script>

<SvelteUIProvider>
    <slot></slot> <!-- 渲染子路由的内容 -->
</SvelteUIProvider>
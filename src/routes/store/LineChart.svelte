<script lang="ts">
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    
    // 接收数据作为 props
    export let labels: string[] = [];
    export let data: number[] = [];
    
    let canvas: HTMLCanvasElement;
    let chart: Chart;
  
    // 当组件挂载或数据变化时更新图表
    $: if (canvas && data) {
      if (chart) chart.destroy(); // 如果图表已存在，先销毁
      
      chart = new Chart(canvas, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: '销量统计',
            data,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  
    // 组件销毁时清理图表
    onMount(() => {
      return () => {
        if (chart) chart.destroy();
      };
    });
  </script>
  
  <canvas bind:this={canvas}></canvas>
  
  <style>
    canvas {
      width: 100% !important;
      height: 400px !important;
    }
  </style>
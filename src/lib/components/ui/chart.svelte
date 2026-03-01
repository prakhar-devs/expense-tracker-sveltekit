<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import { Chart, type ChartConfiguration } from "chart.js/auto";

    let canvas: HTMLCanvasElement;
    let chart: Chart;

    // Instead of deeply typing the generic, we'll accept any valid config for now
    let { type, data, options } = $props<{
        type: string;
        data: any;
        options?: any;
    }>();

    onMount(() => {
        if (canvas) {
            chart = new Chart(canvas, {
                type: type as any,
                data,
                options,
            });
        }
    });

    $effect(() => {
        if (chart && data) {
            chart.data = data;
            chart.options = options || {};
            chart.update();
        }
    });

    onDestroy(() => {
        if (chart) {
            chart.destroy();
        }
    });
</script>

<canvas bind:this={canvas}></canvas>

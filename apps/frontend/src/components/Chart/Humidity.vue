<script setup>
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const props = defineProps(["data"]);

const chartData = computed(() => ({
  labels: props.data.map((d) => d.week_number),
  datasets: [
    {
      label: "Humidity (%)",
      data: props.data.map((d) => d.humidity),
      borderColor: "rgb(54, 162, 235)", // Blue
      fill: false,
    },
  ],
}));

const chartOptions = { responsive: true, maintainAspectRatio: false };
</script>

<template>
  <div class="h-80">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

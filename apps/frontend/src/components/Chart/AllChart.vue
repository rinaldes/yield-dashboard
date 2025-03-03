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
      label: "Strawberry Yield (kg)",
      data: props.data.map((d) => d.strawberry_yield),
      borderColor: "rgb(255, 99, 132)", // Red
      fill: false,
    },
    {
      label: "Humidity (%)",
      data: props.data.map((d) => d.humidity),
      borderColor: "rgb(54, 162, 235)", // Blue
      fill: false,
    },
    {
      label: "Rainfall (mm)",
      data: props.data.map((d) => d.rainfall),
      borderColor: "rgb(75, 192, 192)", // Teal
      fill: false,
    },
    {
      label: "Temperature (°C)",
      data: props.data.map((d) => d.temperature),
      borderColor: "rgb(255, 159, 64)", // Orange
      fill: false,
    },
    {
      label: "Pest Rejection (kg)",
      data: props.data.map((d) => d.reject_due_to_pest),
      borderColor: "rgb(153, 102, 255)", // Purple
      fill: false,
    },
    {
      label: "Disease Rejection (kg)",
      data: props.data.map((d) => d.reject_due_to_disease),
      borderColor: "rgb(255, 205, 86)", // Yellow
      fill: false,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
</script>

<template>
  <div class="h-96">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

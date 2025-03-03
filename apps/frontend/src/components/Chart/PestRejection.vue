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
      label: "Pest Rejection (kg)",
      data: props.data.map((d) => d.reject_due_to_pest),
      borderColor: "rgb(255, 99, 132)", // Red
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

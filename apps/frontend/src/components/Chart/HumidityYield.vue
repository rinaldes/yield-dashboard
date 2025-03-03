<script setup lang="ts">
import { computed } from "vue";
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

type Data = {
  summary: {
    avg_yield_by_humidity: {
      humidity: number;
      avg_strawberry_yield: number;
    }[];
    avg_reject_by_humidity: {
      humidity: number;
      avg_reject_due_to_pest: number;
    }[];
    avg_disease_by_humidity: {
      humidity: number;
      avg_reject_due_to_disease: number;
    }[];
  };
};

const props = defineProps<{
  data: Data;
}>();

const yieldData = computed(
  () => props.data.summary.avg_yield_by_humidity || []
);
const rejectData = computed(
  () => props.data.summary.avg_reject_by_humidity || []
);
const diseaseData = computed(
  () => props.data.summary.avg_disease_by_humidity || []
);

// Create maps to match humidity values
const rejectMap = computed(
  () =>
    new Map(
      rejectData.value.map((d) => [
        Number(d.humidity),
        Number(d.avg_reject_due_to_pest),
      ])
    )
);
const diseaseMap = computed(
  () =>
    new Map(
      diseaseData.value.map((d) => [
        Number(d.humidity),
        Number(d.avg_reject_due_to_disease),
      ])
    )
);

// Compute chart data
const chartData = computed(() => ({
  labels: yieldData.value.map((d) => d.humidity.toString()),
  datasets: [
    {
      label: "Yield (kg)",
      data: yieldData.value.map((d) => Number(d.avg_strawberry_yield)),
      borderColor: "rgb(54, 162, 235)", // Blue for yield
      fill: false,
    },
    {
      label: "Reject due to pests (kg)",
      data: yieldData.value.map(
        (d) => rejectMap.value.get(Number(d.humidity)) || 0
      ),
      borderColor: "rgb(255, 99, 132)", // Red for rejection
      fill: false,
    },
    {
      label: "Reject due to disease (kg)",
      data: yieldData.value.map(
        (d) => diseaseMap.value.get(Number(d.humidity)) || 0
      ),
      borderColor: "rgb(255, 205, 86)", // Yellow for rejection
      fill: false,
    },
  ],
}));

// 🔹 Compute Key Insights
const bestHumidity = computed(() => {
  return yieldData.value.reduce(
    (best, d) =>
      d.avg_strawberry_yield > best.yield
        ? { humidity: d.humidity, yield: d.avg_strawberry_yield }
        : best,
    { humidity: 0, yield: 0 }
  );
});

const worstHumidityPest = computed(() => {
  return rejectData.value.reduce(
    (worst, d) =>
      d.avg_reject_due_to_pest > worst.rejection
        ? { humidity: d.humidity, rejection: d.avg_reject_due_to_pest }
        : worst,
    { humidity: 0, rejection: 0 }
  );
});

const worstHumidityDisease = computed(() => {
  return diseaseData.value.reduce(
    (worst, d) =>
      d.avg_reject_due_to_disease > worst.rejection
        ? { humidity: d.humidity, rejection: d.avg_reject_due_to_disease }
        : worst,
    { humidity: 0, rejection: 0 }
  );
});

const effectiveYieldData = computed(() =>
  yieldData.value.map((d) => {
    const humidity = Number(d.humidity);
    const yieldKg = Number(d.avg_strawberry_yield);
    const rejectKg = rejectMap.value.get(humidity) || 0;
    const diseaseKg = diseaseMap.value.get(humidity) || 0;
    return { humidity, effectiveYield: yieldKg - rejectKg - diseaseKg };
  })
);

const bestHumidityNetYield = computed(() =>
  effectiveYieldData.value.reduce(
    (best, d) =>
      d.effectiveYield > best.yield
        ? { humidity: d.humidity, yield: d.effectiveYield }
        : best,
    { humidity: 0, yield: 0 }
  )
);

const chartOptions = { responsive: true, maintainAspectRatio: false };
</script>

<template>
  <div>
    <h3 class="text-xl font-semibold my-4">Humidity vs Yield</h3>
    <!-- Chart -->
    <div class="h-80">
      <Line :data="chartData" :options="chartOptions" />
    </div>
    <!-- Summary Insights -->
    <div class="bg-gray-100 p-4 rounded-lg mb-4">
      <h3 class="text-lg font-bold">🔹 Key Insights</h3>
      <p>
        ✅ The highest yield was recorded at:
        <strong class="text-green-600">{{ bestHumidity.humidity }}%</strong> ({{
          bestHumidity.yield
        }}
        kg)
      </p>
      <p>
        🚨 The highest rejection due to pests was recorded at:
        <strong class="text-red-600">{{ worstHumidityPest.humidity }}%</strong>
        ({{ worstHumidityPest.rejection }}
        kg rejected)
      </p>
      <p>
        ⚠️ The highest rejection due to disease was recorded at:
        <strong class="text-red-600"
          >{{ worstHumidityDisease.humidity }}%</strong
        >
        ({{ worstHumidityDisease.rejection }}
        kg rejected)
      </p>
      <p>
        🌱 Best humidity for net yield:
        <strong class="text-green-600"
          >{{ bestHumidityNetYield.humidity }}%</strong
        >
        ({{ bestHumidityNetYield.yield.toFixed(2) }}
        kg)
      </p>
    </div>
  </div>
</template>

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
    avg_yield_by_rainfall: {
      rainfall: number;
      avg_strawberry_yield: number;
    }[];
    avg_reject_by_rainfall: {
      rainfall: number;
      avg_reject_due_to_pest: number;
    }[];
    avg_disease_by_rainfall: {
      rainfall: number;
      avg_reject_due_to_disease: number;
    }[];
  };
};

const props = defineProps<{
  data: Data;
}>();

const yieldData = computed(
  () => props.data.summary.avg_yield_by_rainfall || []
);
const rejectData = computed(
  () => props.data.summary.avg_reject_by_rainfall || []
);
const diseaseData = computed(
  () => props.data.summary.avg_disease_by_rainfall || []
);

// Create maps to match rainfall values
const rejectMap = computed(
  () =>
    new Map(
      rejectData.value.map((d) => [
        Number(d.rainfall),
        Number(d.avg_reject_due_to_pest),
      ])
    )
);
const diseaseMap = computed(
  () =>
    new Map(
      diseaseData.value.map((d) => [
        Number(d.rainfall),
        Number(d.avg_reject_due_to_disease),
      ])
    )
);

// Compute chart data
const chartData = computed(() => ({
  labels: yieldData.value.map((d) => d.rainfall.toString()),
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
        (d) => rejectMap.value.get(Number(d.rainfall)) || 0
      ),
      borderColor: "rgb(255, 99, 132)", // Red for rejection
      fill: false,
    },
    {
      label: "Reject due to disease (kg)",
      data: yieldData.value.map(
        (d) => diseaseMap.value.get(Number(d.rainfall)) || 0
      ),
      borderColor: "rgb(255, 205, 86)", // Yellow for rejection
      fill: false,
    },
  ],
}));

// 🔹 Compute Key Insights
const bestRainfall = computed(() => {
  return yieldData.value.reduce(
    (best, d) =>
      d.avg_strawberry_yield > best.yield
        ? { rainfall: d.rainfall, yield: d.avg_strawberry_yield }
        : best,
    { rainfall: 0, yield: 0 }
  );
});

const worstRainfallPest = computed(() => {
  return rejectData.value.reduce(
    (worst, d) =>
      d.avg_reject_due_to_pest > worst.rejection
        ? { rainfall: d.rainfall, rejection: d.avg_reject_due_to_pest }
        : worst,
    { rainfall: 0, rejection: 0 }
  );
});

const worstRainfallDisease = computed(() => {
  return diseaseData.value.reduce(
    (worst, d) =>
      d.avg_reject_due_to_disease > worst.rejection
        ? { rainfall: d.rainfall, rejection: d.avg_reject_due_to_disease }
        : worst,
    { rainfall: 0, rejection: 0 }
  );
});

const effectiveYieldData = computed(() =>
  yieldData.value.map((d) => {
    const rainfall = Number(d.rainfall);
    const yieldKg = Number(d.avg_strawberry_yield);
    const rejectKg = rejectMap.value.get(rainfall) || 0;
    const diseaseKg = diseaseMap.value.get(rainfall) || 0;
    return { rainfall, effectiveYield: yieldKg - rejectKg - diseaseKg };
  })
);

const bestRainfallNetYield = computed(() =>
  effectiveYieldData.value.reduce(
    (best, d) =>
      d.effectiveYield > best.yield
        ? { rainfall: d.rainfall, yield: d.effectiveYield }
        : best,
    { rainfall: 0, yield: 0 }
  )
);

const chartOptions = { responsive: true, maintainAspectRatio: false };
</script>

<template>
  <div>
    <h3 class="text-xl font-semibold my-4">Rainfall vs Yield</h3>
    <!-- Chart -->
    <div class="h-80">
      <Line :data="chartData" :options="chartOptions" />
    </div>
    <!-- Summary Insights -->
    <div class="bg-gray-100 p-4 rounded-lg mb-4">
      <h3 class="text-lg font-bold">🔹 Key Insights</h3>
      <p>
        ✅ The highest yield was recorded at:
        <strong class="text-green-600">{{ bestRainfall.rainfall }} mm</strong>
        ({{ bestRainfall.yield }}
        kg)
      </p>
      <p>
        🚨 The highest rejection due to pests was recorded at:
        <strong class="text-red-600"
          >{{ worstRainfallPest.rainfall }} mm</strong
        >
        ({{ worstRainfallPest.rejection }}
        kg rejected)
      </p>
      <p>
        ⚠️ The highest rejection due to disease was recorded at:
        <strong class="text-red-600"
          >{{ worstRainfallDisease.rainfall }} mm</strong
        >
        ({{ worstRainfallDisease.rejection }}
        kg rejected)
      </p>
      <p>
        🌱 Best rainfall for net yield:
        <strong class="text-green-600"
          >{{ bestRainfallNetYield.rainfall }} mm</strong
        >
        ({{ bestRainfallNetYield.yield.toFixed(2) }}
        kg)
      </p>
    </div>
  </div>
</template>

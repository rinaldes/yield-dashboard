<script setup lang="ts">
const store = useDataStore();

onMounted(async () => {
  await store.fetchWeeklyData();
  await store.fetchPredictions();
  await store.fetchSummary();

  await nextTick(); // ✅ Ensure Vue reactivity updates before rendering
  console.log("Final store state:", store.summary);
});
</script>

<template>
  <div class="container mx-auto px-12 md:px-24 py-12">
    <h1 class="text-3xl font-bold mb-12">🍓 Strawberry Yield Dashboard</h1>

    <div v-if="store.loading" class="text-center">Loading data...</div>

    <div v-else class="space-y-8">
      <WeekComparisonCard :data="store.weeklyData" />
      <Table :data="store.weeklyData" />
      <Chart v-if="store.weeklyData.length" :data="store.weeklyData" />
      <ChartHumidityYield v-if="store.summary" :data="store.summary" />
      <ChartRainfallYield v-if="store.summary" :data="store.summary" />
      <ChartTemperatureYield v-if="store.summary" :data="store.summary" />
      <Prediction :data="store.predictions" />
    </div>
  </div>
</template>

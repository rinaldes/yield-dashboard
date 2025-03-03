<script setup lang="ts">
defineProps(["data"]);
</script>
<template>
  <div>
    <h2 class="text-2xl font-semibold">📈 Weekly Trends</h2>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      <div class="lg:col-span-2">
        <h3 class="text-xl font-semibold mb-4">All Metrics Comparison</h3>
        <ChartAllChart :data="data" />
      </div>

      <div>
        <h3 class="text-xl font-semibold mb-4">Strawberry Yield</h3>
        <ChartYield :data="data" />
      </div>

      <div>
        <h3 class="text-xl font-semibold mb-4">Humidity</h3>
        <ChartHumidity :data="data" />
      </div>

      <div>
        <h3 class="text-xl font-semibold mb-4">Rainfall</h3>
        <ChartRainfall :data="data" />
      </div>

      <div>
        <h3 class="text-xl font-semibold mb-4">Temperature</h3>
        <ChartTemperature :data="data" />
      </div>

      <div>
        <h3 class="text-xl font-semibold mb-4">Rejection due to Disease</h3>
        <ChartDiseaseRejection :data="data" />
      </div>

      <div>
        <h3 class="text-xl font-semibold mb-4">Rejection due to Pest</h3>
        <ChartPestRejection :data="data" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps(["data"]);
</script>

<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-semibold mt-6 mb-3">🔮 Next Week Prediction</h2>

    <div
      v-if="data"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <!-- Weather Card -->
      <div
        class="border border-crown-of-thorns-500 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-center gap-2 mb-3">
          <UIcon name="i-heroicons-cloud" class="w-6 h-6 text-blue-500" />
          <h3 class="text-lg font-semibold">Weather Forecast</h3>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Week</span>
            <span class="font-medium">#{{ data.predictions.next_week }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Humidity</span>
            <UBadge color="success" variant="subtle">
              ± {{ data.predictions.predicted_weather.humidity }}%
            </UBadge>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Rainfall</span>
            <UBadge color="info" variant="subtle">
              ± {{ data.predictions.predicted_weather.rainfall }}mm
            </UBadge>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Temperature</span>
            <UBadge color="warning" variant="subtle">
              ± {{ data.predictions.predicted_weather.temperature }}°C
            </UBadge>
          </div>
        </div>
      </div>

      <!-- Yield Card -->
      <div
        class="border border-crown-of-thorns-500 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-beaker" class="w-6 h-6 text-green-500" />
          <h3 class="text-lg font-semibold">Crop Yield</h3>
        </div>
        <div class="flex flex-col items-center justify-center h-full">
          <span class="text-3xl font-bold text-green-600">
            ± {{ data.predictions.predicted_yield }}
          </span>
          <span class="text-gray-500 mt-1">kilograms</span>
        </div>
      </div>

      <!-- Rejections Card -->
      <div
        class="border border-crown-of-thorns-500 p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-center gap-2 mb-3">
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="w-6 h-6 text-red-500"
          />
          <h3 class="text-lg font-semibold">Quality Control</h3>
        </div>
        <div class="space-y-3">
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-gray-500">Pest Rejection</span>
              <span class="font-medium text-red-600">
                ± {{ data.predictions.predicted_reject.reject_due_to_pest }}kg
              </span>
            </div>
            <UProgress
              :value="data.predictions.predicted_reject.reject_due_to_pest"
              color="warning"
              size="xs"
            />
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-gray-500">Disease Rejection</span>
              <span class="font-medium text-red-600">
                ±
                {{ data.predictions.predicted_reject.reject_due_to_disease }}kg
              </span>
            </div>
            <UProgress
              :value="data.predictions.predicted_reject.reject_due_to_disease"
              color="warning"
              size="xs"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

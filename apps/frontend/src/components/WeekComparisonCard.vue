<script setup lang="ts">
const props = defineProps(["data"]);
const isLoaded = ref(false);

const lastWeek = ref();
const secondLastWeek = ref();

const getTrend = (current: number, previous?: number) => {
  if (previous === undefined || previous === null) return "neutral";
  return current > previous ? "up" : current < previous ? "down" : "neutral";
};

watchEffect(() => {
  if (props.data && props.data.length >= 2) {
    lastWeek.value = props.data[props.data.length - 1];
    secondLastWeek.value = props.data[props.data.length - 2];
    isLoaded.value = true;
  } else {
    isLoaded.value = false;
  }
});
</script>

<template>
  <div class="space-y-4" v-if="isLoaded">
    <h2 class="text-2xl font-semibold mt-6 mb-3">🔮 Last Week Data</h2>

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
          <h3 class="text-lg font-semibold">Weather</h3>
        </div>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Week</span>
            <span class="font-medium">#{{ lastWeek?.week_number }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Humidity</span>
            <div class="flex items-center gap-1">
              <UBadge color="success" variant="subtle">
                {{ lastWeek?.humidity }}%
              </UBadge>
              <UIcon
                v-if="
                  getTrend(lastWeek?.humidity, secondLastWeek?.humidity) ===
                  'up'
                "
                name="i-heroicons-arrow-trending-up"
                class="w-4 h-4"
              />
              <UIcon
                v-else-if="
                  getTrend(lastWeek?.humidity, secondLastWeek?.humidity) ===
                  'down'
                "
                name="i-heroicons-arrow-trending-down"
                class="w-4 h-4"
              />
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Rainfall</span>
            <div class="flex items-center gap-1">
              <UBadge color="info" variant="subtle">
                {{ lastWeek?.rainfall }}mm
              </UBadge>
              <UIcon
                v-if="
                  getTrend(lastWeek?.rainfall, secondLastWeek?.rainfall) ===
                  'up'
                "
                name="i-heroicons-arrow-trending-up"
                class="w-4 h-4"
              />
              <UIcon
                v-else-if="
                  getTrend(lastWeek?.rainfall, secondLastWeek?.rainfall) ===
                  'down'
                "
                name="i-heroicons-arrow-trending-down"
                class="w-4 h-4"
              />
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-gray-500">Temperature</span>
            <div class="flex items-center gap-1">
              <UBadge color="warning" variant="subtle">
                {{ lastWeek?.temperature }}°C
              </UBadge>
              <UIcon
                v-if="
                  getTrend(
                    lastWeek?.temperature,
                    secondLastWeek?.temperature
                  ) === 'up'
                "
                name="i-heroicons-arrow-trending-up"
                class="w-4 h-4"
              />
              <UIcon
                v-else-if="
                  getTrend(
                    lastWeek?.temperature,
                    secondLastWeek?.temperature
                  ) === 'down'
                "
                name="i-heroicons-arrow-trending-down"
                class="w-4 h-4"
              />
            </div>
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
        <div class="flex flex-col items-center justify-center h-full ml-6">
          <div class="flex items-center gap-2">
            <span class="text-3xl font-bold text-green-600">
              {{ lastWeek?.strawberry_yield }}
            </span>
            <UIcon
              v-if="
                getTrend(
                  lastWeek?.strawberry_yield,
                  secondLastWeek?.strawberry_yield
                ) === 'up'
              "
              name="i-heroicons-arrow-trending-up"
              class="w-6 h-6 text-green-500"
            />
            <UIcon
              v-else-if="
                getTrend(
                  lastWeek?.strawberry_yield,
                  secondLastWeek?.strawberry_yield
                ) === 'down'
              "
              name="i-heroicons-arrow-trending-down"
              class="w-6 h-6 text-red-500"
            />
          </div>
          <span class="text-gray-500 mt-1 mr-8">kilograms</span>
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
              <div class="flex items-center gap-1">
                <span class="font-medium text-red-600">
                  {{ lastWeek?.reject_due_to_pest }}kg
                </span>
                <UIcon
                  v-if="
                    getTrend(
                      lastWeek?.reject_due_to_pest,
                      secondLastWeek?.reject_due_to_pest
                    ) === 'up'
                  "
                  name="i-heroicons-arrow-trending-up"
                  class="w-4 h-4 text-red-500"
                />
                <UIcon
                  v-else-if="
                    getTrend(
                      lastWeek?.reject_due_to_pest,
                      secondLastWeek?.reject_due_to_pest
                    ) === 'down'
                  "
                  name="i-heroicons-arrow-trending-down"
                  class="w-4 h-4 text-green-500"
                />
              </div>
            </div>
            <UProgress
              :value="lastWeek?.reject_due_to_pest"
              color="warning"
              size="xs"
            />
          </div>
          <div>
            <div class="flex justify-between items-center mb-1">
              <span class="text-gray-500">Disease Rejection</span>
              <div class="flex items-center gap-1">
                <span class="font-medium text-red-600">
                  {{ lastWeek?.reject_due_to_disease }}kg
                </span>
                <UIcon
                  v-if="
                    getTrend(
                      lastWeek?.reject_due_to_disease,
                      secondLastWeek?.reject_due_to_disease
                    ) === 'up'
                  "
                  name="i-heroicons-arrow-trending-up"
                  class="w-4 h-4 text-red-500"
                />
                <UIcon
                  v-else-if="
                    getTrend(
                      lastWeek?.reject_due_to_disease,
                      secondLastWeek?.reject_due_to_disease
                    ) === 'down'
                  "
                  name="i-heroicons-arrow-trending-down"
                  class="w-4 h-4 text-green-500"
                />
              </div>
            </div>
            <UProgress
              :value="lastWeek?.reject_due_to_disease"
              color="warning"
              size="xs"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

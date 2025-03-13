<script setup lang="ts">
const items = ref([
  {
    label: "Production",
    icon: "i-lucide-factory",
    to: "/dashboard",
    children: [
      {
        label: "Harvest",
        description: "Manage and track harvest data",
        icon: "i-lucide-wheat",
        to: "/dashboard/harvest",
      },
      {
        label: "Brix",
        description: "Manage and analyze brix measurements",
        icon: "i-lucide-test-tube",
        to: "/dashboard/brix",
      },
      {
        label: "Forecast",
        description: "View and manage production forecasts",
        icon: "i-lucide-trending-up",
        to: "/dashboard/forecast",
      },
    ],
  },
  {
    label: "Operational",
    icon: "i-lucide-settings",
    to: "/dashboard",
    children: [
      {
        label: "Location",
        description: "Manage production locations and sites",
        icon: "i-lucide-map-pin",
        to: "/dashboard/location",
      },
      {
        label: "Product",
        description: "Manage product information and specifications",
        icon: "i-lucide-package",
        to: "/dashboard/product",
      },
      {
        label: "PIC",
        description: "Manage person in charge (PIC) assignments",
        icon: "i-lucide-users",
        to: "/dashboard/pic",
      },
    ],
  },
]);
</script>

<template>
  <div class="px-12 md:px-24">
    <div class="flex justify-between sticky top-0 py-8 bg-janna-500 z-10">
      <img src="/images/hyoshii-redlogo.png" class="w-16" />
      <nav
        class="flex gap-16 justify-center md:justify-end text-crown-of-thorns-500"
      >
        <!-- <UNavigationMenu :items="items" class="w-full justify-center" /> -->
        <NuxtLink
          v-for="item in items"
          :href="item.to"
          class="flex items-center gap-2 hover:underline-offset-8 hover:underline"
          >{{ item.label }}</NuxtLink
        >
      </nav>
    </div>

    <div class="flex-1 py-10">
      <slot />
    </div>
  </div>
</template>

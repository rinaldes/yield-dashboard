<script setup lang="ts">
const links = [
  {
    label: "HARVEST",
    to: "/dashboard/harvest",
  },
];
</script>

<template>
  <div class="py-12 px-12 md:px-24">
    <nav
      class="flex flex-row gap-16 justify-center md:justify-end text-crown-of-thorns-500"
    >
      <NuxtLink
        v-for="item in links"
        :href="item.to"
        class="flex items-center gap-2 hover:underline-offset-8 hover:underline"
        :class="
          (item.to !== '/pic' && $route.path !== '/pic') ||
          item.to === $route.path
            ? 'underline-offset-8 underline'
            : 'font-normal'
        "
        >{{ item.label }}</NuxtLink
      >
    </nav>
    <div class="flex-1 py-10">
      <slot />
    </div>
  </div>
</template>

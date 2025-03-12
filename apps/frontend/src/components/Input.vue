<script setup lang="ts">
defineProps<{
  label?: string;
}>();
</script>

<template>
  <div class="flex flex-col gap-2 w-full">
    <label for="pic" class="text-plantation-500">{{ label }}</label>
    <div class="border border-crown-of-thorns-500 p-2">
      <slot />
    </div>
  </div>
</template>

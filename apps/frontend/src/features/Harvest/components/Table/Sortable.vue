<script setup lang="ts">
defineProps<{ column: any; label: string }>();
</script>

<template>
  <UButton
    color="neutral"
    variant="ghost"
    :label="label"
    :icon="
      column.getIsSorted() === 'asc'
        ? 'i-lucide-arrow-up-narrow-wide'
        : column.getIsSorted()
        ? 'i-lucide-arrow-down-wide-narrow'
        : 'i-lucide-arrow-up-down'
    "
    class="-mx-2.5"
    @click="column.toggleSorting(column.getIsSorted() === 'asc')"
  />
</template>

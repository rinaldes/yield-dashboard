<script lang="ts" setup>
import type { Harvest } from "./type";

const { data, status, refresh } = await useFetch<Harvest[]>(
  `${
    useRuntimeConfig().public.apiBase
  }/api/v1/harvest?include=location,pic,Packing,Reject,Yield`,
  {
    key: "table-harvest",
    lazy: true,
    default: () => [],
  }
);
</script>
<template>
  <div class="w-full space-y-4 pb-4">
    <div class="flex justify-between items-center mb-8">
      <h1>Harvest Data</h1>
      <Button
        label="Add Harvest"
        icon="lucide:plus"
        @click="navigateTo('/dashboard/harvest/form')"
      />
    </div>
    <HarvestComponentsTable :data="data" :status="status" :refresh="refresh" />
  </div>
</template>

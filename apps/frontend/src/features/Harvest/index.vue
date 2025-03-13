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
    <HarvestComponentsTable />
  </div>
</template>

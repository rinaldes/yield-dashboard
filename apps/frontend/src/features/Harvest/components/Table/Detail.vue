<script setup lang="ts">
const props = defineProps<{ row: any }>();
</script>

<template>
  <div class="p-4 bg-gray-50 rounded-lg space-y-4">
    <h2>Packing</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
      <div
        v-for="(packing, index) in row.original.Packing"
        :key="index"
        class="space-y-1"
      >
        <div class="text-sm font-bold text-plantation-500">
          Package {{ packing.package.name }}
        </div>
        <div class="font-medium">{{ packing.quantity }} pack</div>
      </div>
    </div>
    <h2>Reject</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
      <div
        v-for="(reject, index) in row.original.Reject"
        :key="index"
        class="space-y-1"
      >
        <div class="text-sm font-bold text-plantation-500">
          Reason {{ reject.reason.name }}
        </div>
        <div class="font-medium">{{ reject.quantity }} g</div>
      </div>
    </div>
    <h2>Yield</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="(yieldItem, index) in row.original.Yield"
        :key="index"
        class="space-y-1"
      >
        <div class="text-sm font-bold text-plantation-500">
          Variant {{ yieldItem.variantGrade.variant.name }} Grade
          {{ yieldItem.variantGrade.grade.name }}
        </div>
        <div class="font-medium">{{ yieldItem.quantity }} tray</div>
      </div>
    </div>
  </div>
</template>

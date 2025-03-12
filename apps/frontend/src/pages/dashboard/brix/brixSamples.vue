<script lang="ts" setup>
defineProps({
  from: {
    type: String,
    default: undefined,
  },
  type: {
    type: String,
    default: undefined,
  },
  brix_score: {
    type: Number,
    default: undefined,
  },
});

defineEmits(["update:from", "update:type", "update:brix_score"]);
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
    <UFormField label="Source" name="from" required>
      <Input>
        <UInputMenu
          :model-value="from"
          @update:model-value="$emit('update:from', $event)"
          placeholder="Select source"
          :items="['market', 'reject', 'none']"
          variant="none"
          class="w-full"
        />
      </Input>
    </UFormField>

    <UFormField label="Type" name="type">
      <Input>
        <UInputMenu
          :model-value="type"
          @update:model-value="$emit('update:type', $event)"
          placeholder="Select type"
          :items="['tip', 'deep', 'all']"
          class="w-full"
          variant="none"
        />
      </Input>
    </UFormField>

    <UFormField label="Brix Score" name="brix_score" required>
      <Input>
        <UInput
          :model-value="brix_score"
          @update:model-value="$emit('update:brix_score', $event)"
          type="number"
          variant="none"
          class="w-full"
          min="0"
          max="100"
          step="0.1"
        />
      </Input>
    </UFormField>
  </div>
</template>

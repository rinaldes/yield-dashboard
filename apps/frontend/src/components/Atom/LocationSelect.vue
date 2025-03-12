<script lang="ts" setup>
const props = defineProps<{
  modelValue?: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value?: number): void;
}>();

type Location = {
  id: number;
  name: string;
};

const { data: locations } = await useFetch<Location[]>(
  `${useRuntimeConfig().public.apiBase}/api/v1/location`,
  {
    key: "location-select",
    lazy: true,
    default: () => [],
  }
);

const items = computed(() => {
  return (
    locations.value?.map((location) => ({
      label: location.name,
      id: location.id,
    })) || []
  );
});
const selectedValue = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});
</script>

<template>
  <UInputMenu
    v-model="selectedValue"
    value-key="id"
    :items="items"
    placeholder="Select location"
    variant="none"
    class="w-full"
  />
</template>

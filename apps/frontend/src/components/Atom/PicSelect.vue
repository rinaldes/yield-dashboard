<script lang="ts" setup>
const props = defineProps<{
  modelValue?: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value?: number): void;
}>();

type PIC = {
  id: number;
  name: string;
};

const { data: pics } = await useFetch<PIC[]>(
  `${useRuntimeConfig().public.apiBase}/api/v1/pic`,
  {
    key: "pic-select",
    lazy: true,
    default: () => [],
  }
);

const items = computed(() => {
  return (
    pics.value?.map((pic) => ({
      label: pic.name,
      id: pic.id,
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
    placeholder="Select PIC"
    variant="none"
    class="w-full"
  />
</template>

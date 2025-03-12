<script setup lang="ts">
defineProps<{
  label?: string;
  icon?: string;
  type?: "button" | "submit" | "reset";
  /* @ts-ignore */
  color?: ButtonColor;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();
</script>

<template>
  <UButton
    :type="type"
    :color="color"
    :icon="icon"
    size="lg"
    @click="emit('click')"
    :class="`py-4 font-medium rounded-none justify-center cursor-pointer w-52 hover:bg-color-${
      color ?? 'plantation'
    }-500 hover:opacity-80`"
  >
    {{ label }}
  </UButton>
</template>

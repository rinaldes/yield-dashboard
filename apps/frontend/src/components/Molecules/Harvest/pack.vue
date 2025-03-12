<script lang="ts" setup>
defineProps<{
  state?: any;
}>();
</script>
<template>
  <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
    <UFormField FormField label="Pack Grade A" name="packGradeA">
      <Input>
        <UInput v-model="state.packGradeA" variant="none" class="w-full" />
      </Input>
    </UFormField>
    <UFormField label="Pack Grade A 15pcs" name="packGradeA15pcs">
      <Input>
        <UInput v-model="state.packGradeA15pcs" variant="none" class="w-full" />
      </Input>
    </UFormField>
    <UFormField label="Frozen Weight" name="frozenWeight">
      <Input>
        <UInput v-model="state.frozenWeight" variant="none" class="w-full" />
      </Input>
    </UFormField>

    <UFormField label="Pack Grade B" name="packGradeB">
      <Input>
        <UInput v-model="state.packGradeB" variant="none" class="w-full" />
      </Input>
    </UFormField>
    <UFormField label="Gift Box" name="giftBox">
      <Input>
        <UInput v-model="state.giftBox" variant="none" class="w-full" />
      </Input>
    </UFormField>
  </div>
</template>

<style></style>

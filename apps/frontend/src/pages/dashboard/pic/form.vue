<script lang="ts" setup>
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
const { $toast } = useNuxtApp();

const schema = z.object({
  name: z.string(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: "",
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  $toast.success("Form Submitted");
  console.log(event.data);
}
</script>

<template>
  <div class="space-y-12">
    <Toaster position="top-right" />
    <h1>PIC Form</h1>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Name" name="name">
          <Input>
            <UInput v-model="state.name" variant="none" class="w-full" />
          </Input>
        </UFormField>
      </div>
      <Button label="Submit" type="submit" class="mt-4 mr-2" />
      <Button label="Reset" type="reset" color="secondary" class="mt-4" />
    </UForm>
  </div>
</template>

<script lang="ts" setup>
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  is_indoors: z.boolean().default(false),
  total_plants: z.optional(
    z.number().min(0, "Total plants cannot be negative")
  ),
  width: z.optional(z.number().min(0, "Width cannot be negative")),
  height: z.optional(z.number().min(0, "Height cannot be negative")),
  length: z.optional(z.number().min(0, "Length cannot be negative")),
  area: z.optional(z.number().min(0, "Area cannot be negative")),
  planting_date: z.optional(z.string()),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  planting_date: new Date().toISOString(),
  name: "",
  is_indoors: false,
  total_plants: 0,
  width: 0,
  height: 0,
  length: 0,
  area: 0,
});

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const payload = {
      ...state,
      planting_date: state.planting_date
        ? new Date(state.planting_date).toISOString()
        : undefined,
    };

    const response = await $fetch(
      `${useRuntimeConfig().public.apiBase}/api/v1/location`,
      {
        method: "POST",
        body: payload,
      }
    );
    toast.add({
      title: "Success",
      description: "Location created successfully",
      color: "success",
    });

    state.name = "";
    state.is_indoors = false;
    state.total_plants = 0;
    state.width = 0;
    state.height = 0;
    state.length = 0;
    state.area = 0;
    state.planting_date = new Date().toISOString();
    // router.push("/dashboard/location");
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to create location",
      color: "error",
    });
  }
}

const items = [
  {
    label: "Dashboard",
    to: "/",
  },
  {
    label: "Location",
    to: "/dashboard/location",
  },
  {
    label: "Form",
    to: "/dashboard/location/form",
  },
];

watch(
  () => [state.width, state.height, state.length],
  () => {
    state.area = (state?.width || 0) * (state?.length || 0);
  },
  { deep: true }
);
</script>

<template>
  <div class="space-y-12">
    <div>
      <UBreadcrumb :items="items" class="cursor-pointer mb-4">
        <template #separator>
          <span class="mx-2 text-(--ui-text-muted)">/</span>
        </template>
      </UBreadcrumb>
      <h1>Location Form</h1>
    </div>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <Input label="Name" class="xl:col-span-2">
          <div class="w-full flex justify-between items-center">
            <UFormField name="name" required class="w-3/4">
              <UInput v-model="state.name" variant="none" class="w-full" />
            </UFormField>
            <UFormField
              name="is_indoors"
              class="border-crown-of-thorns-500 border-l-1 pr-4 pl-6"
            >
              <UCheckbox
                v-model="state.is_indoors"
                variant="none"
                label="Is Indoor"
                size="xl"
              />
            </UFormField>
          </div>
        </Input>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <UFormField label="Area (m²)" name="area">
          <Input>
            <UInput
              v-model="state.area"
              variant="none"
              class="w-full"
              disabled
            />
          </Input>
        </UFormField>
        <UFormField label="Total Plants" name="total_plants">
          <Input>
            <UInput
              v-model="state.total_plants"
              type="number"
              variant="none"
              class="w-full"
            />
          </Input>
        </UFormField>

        <UFormField label="Planting Date" name="planting_date">
          <Input>
            <UInput
              v-model="state.planting_date"
              type="date"
              variant="none"
              class="w-full"
            />
          </Input>
        </UFormField>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <UFormField label="Length (m)" name="length" required>
          <Input>
            <UInput
              v-model="state.length"
              type="number"
              variant="none"
              class="w-full"
            />
          </Input>
        </UFormField>
        <UFormField label="Width (m)" name="width" required>
          <Input>
            <UInput
              v-model="state.width"
              type="number"
              variant="none"
              class="w-full"
            />
          </Input>
        </UFormField>
        <UFormField label="Height (m)" name="height">
          <Input>
            <UInput
              v-model="state.height"
              type="number"
              variant="none"
              class="w-full"
            />
          </Input>
        </UFormField>
      </div>
      <Button label="Submit" type="submit" class="mt-4 mr-2" />
      <Button label="Reset" type="reset" color="secondary" class="mt-4" />
    </UForm>
  </div>
</template>

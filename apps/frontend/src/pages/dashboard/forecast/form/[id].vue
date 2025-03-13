<script lang="ts" setup>
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
const { $toast } = useNuxtApp();

const schema = z.object({
  datetime: z.string(),
  harvestLocation: z.number(),
  pic: z.number(),
  total: z.number().min(0),
  totalExMomoka: z.number().min(0),
  packGradeA: z.optional(z.number().min(0)),
  packGradeA15pcs: z.optional(z.number().min(0)),
  momoka3pcs: z.optional(z.number().min(0)),
  momokaA11: z.optional(z.number().min(0)),
  momokaA15: z.optional(z.number().min(0)),
  momokaGradeB: z.optional(z.number().min(0)),
  hatsuhana3pcs: z.optional(z.number().min(0)),
  hatsuhana4pcs: z.optional(z.number().min(0)),
  hatsuhana6pcs: z.optional(z.number().min(0)),
});

const route = useRoute();
const forecastId = computed(() => route.params.id);

const { data: forecastData } = await useFetch<any>(
  `${useRuntimeConfig().public.apiBase}/api/v1/forecasts/${forecastId.value}`,
  {
    key: `forecast-${forecastId.value}`,
    default: () => ({}),
  }
);

const items = ref([
  {
    label: "Tochiotome",
    slot: "tochiotome",
  },
  {
    label: "Momoka",
    slot: "momoka",
  },
]);

const state = reactive<Partial<z.output<typeof schema>>>({
  datetime: "",
  harvestLocation: undefined,
  pic: undefined,
  total: 0,
  totalExMomoka: 0,
  packGradeA: undefined,
  packGradeA15pcs: undefined,
  momoka3pcs: undefined,
  momokaA11: undefined,
  momokaA15: undefined,
  momokaGradeB: undefined,
  hatsuhana3pcs: undefined,
  hatsuhana4pcs: undefined,
  hatsuhana6pcs: undefined,
});

onMounted(() => {
  if (forecastData.value) {
    const date = new Date(forecastData.value.week);
    state.datetime = date.toISOString().slice(0, 16);

    state.harvestLocation = forecastData.value.location_id;
    state.pic = forecastData.value.pic_id;
    state.total = forecastData.value.total;
    state.totalExMomoka = forecastData.value.total_ex_momoka;

    // Populate variant quantities
    forecastData.value.forecastVariants.forEach((variant: any) => {
      switch (variant.package_id) {
        case 6:
          state.packGradeA = variant.quantity;
          break;
        case 7:
          state.packGradeA15pcs = variant.quantity;
          break;
        case 1:
          state.momoka3pcs = variant.quantity;
          break;
        case 3:
          state.momokaA11 = variant.quantity;
          break;
        case 4:
          state.momokaA15 = variant.quantity;
          break;
        case 5:
          state.momokaGradeB = variant.quantity;
          break;
        case 9:
          state.hatsuhana3pcs = variant.quantity;
          break;
        case 10:
          state.hatsuhana4pcs = variant.quantity;
          break;
        case 11:
          state.hatsuhana6pcs = variant.quantity;
          break;
      }
    });
  }
});

async function onSubmit(event: FormSubmitEvent<z.output<typeof schema>>) {
  const ensureNumber = (value: number | undefined) => Number(value) || 0;

  try {
    const payload = {
      week: new Date(event.data.datetime).toISOString(),
      location_id: event.data.harvestLocation,
      pic_id: event.data.pic,
      total: event.data.total,
      total_ex_momoka: event.data.totalExMomoka,
      variants: [
        {
          package_id: 6,
          quantity: ensureNumber(event.data.packGradeA),
        },
        {
          package_id: 7,
          quantity: ensureNumber(event.data.packGradeA15pcs),
        },
        {
          package_id: 1,
          quantity: ensureNumber(event.data.momoka3pcs),
        },
        {
          package_id: 3,
          quantity: ensureNumber(event.data.momokaA11),
        },
        {
          package_id: 4,
          quantity: ensureNumber(event.data.momokaA15),
        },
        {
          package_id: 5,
          quantity: ensureNumber(event.data.momokaGradeB),
        },
        {
          package_id: 9,
          quantity: ensureNumber(event.data.hatsuhana3pcs),
        },
        {
          package_id: 10,
          quantity: ensureNumber(event.data.hatsuhana4pcs),
        },
        {
          package_id: 11,
          quantity: ensureNumber(event.data.hatsuhana6pcs),
        },
      ],
    };

    await $fetch(
      `${useRuntimeConfig().public.apiBase}/api/v1/forecasts/${
        forecastId.value
      }`,
      {
        method: "PUT",
        body: payload,
      }
    );
    $toast.success("Forecast updated successfully");
    navigateTo("/dashboard/forecast");
  } catch (error) {
    console.log(error);
    $toast.error("Failed to update forecast");
  }
}

watch(
  () => [
    state.packGradeA,
    state.packGradeA15pcs,
    state.momoka3pcs,
    state.momokaA11,
    state.momokaA15,
    state.momokaGradeB,
    state.hatsuhana3pcs,
    state.hatsuhana4pcs,
    state.hatsuhana6pcs,
  ],
  () => {
    const totalValue =
      (Number(state.packGradeA) || 0) +
      (Number(state.packGradeA15pcs) || 0) +
      (Number(state.momoka3pcs) || 0) +
      (Number(state.momokaA11) || 0) +
      (Number(state.momokaA15) || 0) +
      (Number(state.momokaGradeB) || 0) +
      (Number(state.hatsuhana3pcs) || 0) +
      (Number(state.hatsuhana4pcs) || 0) +
      (Number(state.hatsuhana6pcs) || 0);

    const totalExMomokaValue =
      totalValue -
      ((Number(state.momoka3pcs) || 0) +
        (Number(state.momokaA11) || 0) +
        (Number(state.momokaA15) || 0) +
        (Number(state.momokaGradeB) || 0));

    state.total = totalValue;
    state.totalExMomoka = totalExMomokaValue;
  },
  { immediate: true }
);
</script>

<template>
  <div class="space-y-12">
    <Toaster position="top-right" />
    <h1>Forecast Form</h1>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <div
        class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-c xl:grid-cols-3"
      >
        <UFormField label="Current Week" name="datetime">
          <Input>
            <UInput
              v-model="state.datetime"
              variant="none"
              class="w-full"
              type="datetime-local"
            />
          </Input>
        </UFormField>
        <UFormField label="Lokasi Panen" name="harvestLocation">
          <Input>
            <AtomLocationSelect v-model="state.harvestLocation" />
          </Input>
        </UFormField>
        <UFormField label="Pengisi Data" name="pic">
          <Input>
            <AtomPicSelect v-model="state.pic" />
          </Input>
        </UFormField>
      </div>

      <h2>Packing</h2>
      <UTabs :items="items" class="w-full mt-8" variant="link">
        <template #tochiotome="{ item }">
          <div
            class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 py-4"
          >
            <UFormField
              label="Hasil Marketable (packs) - Grade A11"
              name="packGradeA"
            >
              <Input>
                <UInput
                  v-model="state.packGradeA"
                  variant="none"
                  class="w-full"
                  type="number"
                />
              </Input>
            </UFormField>
            <UFormField
              label="Hasil Marketable (packs) - Grade A Isi 15"
              name="packGradeA15pcs"
            >
              <Input>
                <UInput
                  v-model="state.packGradeA15pcs"
                  variant="none"
                  class="w-full"
                  type="number"
                />
              </Input>
            </UFormField>
          </div>
          <div
            class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 py-4"
          >
            <UFormField
              label="Hasil Marketable (packs) - Hatsuhana 3 pcs"
              name="hatsuhana3pcs"
            >
              <Input>
                <UInput
                  v-model="state.hatsuhana3pcs"
                  type="number"
                  variant="none"
                  class="w-full"
                />
              </Input>
            </UFormField>
            <UFormField
              label="Hasil Marketable (packs) - Hatsuhana 4 pcs"
              name="hatsuhana4pcs"
            >
              <Input>
                <UInput
                  v-model="state.hatsuhana4pcs"
                  type="number"
                  variant="none"
                  class="w-full"
                />
              </Input>
            </UFormField>
            <UFormField
              label="Hasil Marketable (packs) - Hatsuhana 6 pcs"
              name="hatsuhana6pcs"
            >
              <Input>
                <UInput
                  v-model="state.hatsuhana6pcs"
                  type="number"
                  variant="none"
                  class="w-full"
                />
              </Input>
            </UFormField>
          </div>
        </template>
        <!-- Momoka -->
        <template #momoka="{ item }">
          <div
            class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 py-4"
          >
            <UFormField
              label="Hasil Marketable (packs) - Momoka 3 pcs"
              name="momoka3pcs"
            >
              <Input>
                <UInput
                  v-model="state.momoka3pcs"
                  type="number"
                  variant="none"
                  class="w-full"
                />
              </Input>
            </UFormField>
            <UFormField
              label="Hasil Marketable (Packs) - Momoka A11"
              name="momokaA11"
            >
              <Input>
                <UInput
                  v-model="state.momokaA11"
                  type="number"
                  variant="none"
                  class="w-full"
                />
              </Input>
            </UFormField>
            <UFormField
              label="Hasil Marketable (Packs) - Momoka A15"
              name="momokaA15"
            >
              <Input>
                <UInput
                  v-model="state.momokaA15"
                  type="number"
                  variant="none"
                  class="w-full"
                />
              </Input>
            </UFormField>
            <UFormField
              label="Hasil Marketable (packs) - Momoka grade B"
              name="momokaGradeB"
            >
              <Input>
                <UInput
                  v-model="state.momokaGradeB"
                  type="number"
                  variant="none"
                  class="w-full"
                />
              </Input>
            </UFormField>
          </div>
        </template>
      </UTabs>

      <hr class="my-8" />
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <UFormField label="Total" name="total">
          <Input>
            <UInput
              v-model="state.total"
              variant="none"
              class="w-full"
              disabled
            />
          </Input>
        </UFormField>
        <UFormField label="Total Exclude Momoka" name="totalExMomoka">
          <Input>
            <UInput
              v-model="state.totalExMomoka"
              variant="none"
              class="w-full"
              disabled
            />
          </Input>
        </UFormField>
      </div>
      <Button label="Submit" type="submit" class="mt-4 mr-2" />
      <Button label="Reset" type="reset" color="secondary" class="mt-4" />
    </UForm>
  </div>
</template>

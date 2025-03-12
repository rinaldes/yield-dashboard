<script lang="ts" setup>
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = z.object({
  datetime: z.number(),
  harvestLocation: z.string(),
  pic: z.string(),
  packGradeA: z.optional(z.number()),
  packGradeA15pcs: z.optional(z.number()),
  frozenWeight: z.optional(z.number()),
  wastedWeight: z.optional(z.number()),
  packGradeB: z.optional(z.number()),
  momoka3pcs: z.optional(z.number()),
  momoka6pcs: z.optional(z.number()),
  momokaA11: z.optional(z.number()),
  momokaA15: z.optional(z.number()),
  momokaGradeB: z.optional(z.number()),
  hatsuhana3pcs: z.optional(z.number()),
  hatsuhana4pcs: z.optional(z.number()),
  hatsuhana6pcs: z.optional(z.number()),
  giftbox: z.optional(z.number()),
  total: z.number(),
  totalExMomoka: z.number(),
});

const rejectSchema = z.object({
  jamur: z.optional(z.number()),
  mildew: z.optional(z.number()),
  jamurHijau: z.optional(z.number()),
  siput: z.optional(z.number()),
  cracking: z.optional(z.number()),
  overripe: z.optional(z.number()),
  fisik: z.optional(z.number()),
  hama: z.optional(z.number()),
  polinasi: z.optional(z.number()),
  gradeC: z.optional(z.number()),
  orange: z.optional(z.number()),
});

const currentDateTime = ref(1);

type Schema = z.output<typeof schema>;
type RejectSchema = z.output<typeof rejectSchema>;

const state = reactive<Partial<Schema>>({
  datetime: currentDateTime.value,
  harvestLocation: "",
  pic: "",
  packGradeA: undefined,
  packGradeA15pcs: undefined,
  frozenWeight: undefined,
  wastedWeight: undefined,
  packGradeB: undefined,
  momoka3pcs: undefined,
  momoka6pcs: undefined,
  momokaA11: undefined,
  momokaA15: undefined,
  momokaGradeB: undefined,
  hatsuhana3pcs: undefined,
  hatsuhana4pcs: undefined,
  hatsuhana6pcs: undefined,
  giftbox: undefined,
  total: 0,
  totalExMomoka: 0,
});

const reject = reactive<Partial<RejectSchema>>({
  jamur: undefined,
  mildew: undefined,
  jamurHijau: undefined,
  siput: undefined,
  cracking: undefined,
  overripe: undefined,
  fisik: undefined,
  hama: undefined,
  polinasi: undefined,
  gradeC: undefined,
  orange: undefined,
});

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

// dummy data
const location = [
  {
    value: "gh1",
    label: "GH1",
  },
  {
    value: "gh2",
    label: "GH2",
  },
  {
    value: "gh3",
    label: "GH3",
  },
  {
    value: "gh4",
    label: "GH4",
  },
  {
    value: "gh5",
    label: "GH5",
  },
  {
    value: "outdoor1",
    label: "Outdoor 1",
  },
  {
    value: "outdoor2",
    label: "Outdoor 2",
  },
  {
    value: "outdoor3",
    label: "Outdoor 3",
  },
  {
    value: "outdoor4",
    label: "Outdoor 4",
  },
  {
    value: "outdoor5",
    label: "Outdoor 5",
  },
  {
    value: "outdoor6",
    label: "Outdoor 6",
  },
  {
    value: "outdoor7",
    label: "Outdoor 7",
  },
];

const pic = [
  {
    value: "budi",
    label: "Budi",
  },
  {
    value: "toni",
    label: "Toni",
  },
];

// dummy end
const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: "Success",
    description: "The form has been submitted.",
    color: "success",
  });
  console.log(event.data);
}

onMounted(() => {
  const currentTime = new Date();
  const startOfYear = new Date(currentTime.getFullYear(), 0, 1);
  const pastDaysOfYear =
    (new Date(currentTime).getTime() - startOfYear.getTime()) / 86400000;
  currentDateTime.value = Math.floor((pastDaysOfYear + 2) / 7);

  state.datetime = currentDateTime.value;
});

watch(
  () => [
    state.packGradeA,
    state.packGradeA15pcs,
    state.packGradeB,
    state.momoka3pcs,
    state.momoka6pcs,
    state.momokaA11,
    state.momokaA15,
    state.momokaGradeB,
    state.hatsuhana3pcs,
    state.hatsuhana4pcs,
    state.hatsuhana6pcs,
    state.giftbox,
  ],
  () => {
    const totalValue =
      (Number(state.packGradeA) || 0) +
      (Number(state.packGradeA15pcs) || 0) +
      (Number(state.packGradeB) || 0) +
      (Number(state.momoka3pcs) || 0) +
      (Number(state.momoka6pcs) || 0) +
      (Number(state.momokaA11) || 0) +
      (Number(state.momokaA15) || 0) +
      (Number(state.momokaGradeB) || 0) +
      (Number(state.hatsuhana3pcs) || 0) +
      (Number(state.hatsuhana4pcs) || 0) +
      (Number(state.hatsuhana6pcs) || 0) +
      (Number(state.giftbox) || 0);

    const totalExMomokaValue =
      totalValue -
      ((Number(state.momoka3pcs) || 0) +
        (Number(state.momoka6pcs) || 0) +
        (Number(state.momokaA11) || 0) +
        (Number(state.momokaA15) || 0) +
        (Number(state.momokaGradeB) || 0));

    state.total = totalValue;
    state.totalExMomoka = totalExMomokaValue;
  },
  { immediate: true }
);

watch(
  () => [
    reject.jamur,
    reject.mildew,
    reject.jamurHijau,
    reject.siput,
    reject.cracking,
    reject.overripe,
    reject.fisik,
    reject.hama,
    reject.polinasi,
    reject.gradeC,
    reject.orange,
  ],
  () => {
    const totalReject =
      (Number(reject.jamur) || 0) +
      (Number(reject.mildew) || 0) +
      (Number(reject.jamurHijau) || 0) +
      (Number(reject.siput) || 0) +
      (Number(reject.cracking) || 0) +
      (Number(reject.overripe) || 0) +
      (Number(reject.fisik) || 0) +
      (Number(reject.hama) || 0) +
      (Number(reject.polinasi) || 0) +
      (Number(reject.gradeC) || 0) +
      (Number(reject.orange) || 0);

    state.wastedWeight = totalReject;
  },
  { immediate: true }
);
</script>

<template>
  <div class="space-y-12">
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
              type="number"
              :value="currentDateTime"
            />
          </Input>
        </UFormField>
        <UFormField label="Lokasi Panen" name="harvestLocation">
          <Input>
            <USelect
              v-model="state.harvestLocation"
              variant="none"
              :items="location"
              class="w-full"
            />
          </Input>
        </UFormField>
        <UFormField label="Pengisi Data" name="pic">
          <Input>
            <USelect
              :items="pic"
              v-model="state.pic"
              variant="none"
              class="w-full"
            />
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

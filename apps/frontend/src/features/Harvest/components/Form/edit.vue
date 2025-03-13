<script lang="ts" setup>
import type { FormSubmitEvent } from "@nuxt/ui";
import type { RejectSchema, YieldSchema, Schema } from "./schema";
import { schema } from "./schema";
import type { Harvest } from "../../type";

const toast = useToast();
const currentDateTime = ref("");

const route = useRoute();
const harvestId = computed(() => route.params.id);

const { data: harvestData } = await useFetch<any>(
  `${useRuntimeConfig().public.apiBase}/api/v1/harvest/${harvestId.value}`,
  {
    key: `harvest-${harvestId.value}`,
    default: () => ({} as Harvest),
  }
);

const { data, status, refresh } = await useFetch<Harvest[]>(
  `${useRuntimeConfig().public.apiBase}/api/v1/harvest`,
  {
    key: "table-harvest",
    lazy: true,
    default: () => [],
  }
);

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

const yieldState = reactive<Partial<YieldSchema>>({
  momokaGradeA: undefined,
  momokaGradeB: undefined,
  momokaGradeMix: undefined,
  tochiotomeGradeA: undefined,
  tochiotomeGradeB: undefined,
  tochiotomeGradeMix: undefined,
});

const state = reactive<Partial<Schema>>({
  datetime: currentDateTime.value,
  siklus: undefined,
  harvestLocation: undefined,
  pic: undefined,
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
  reject: reject,
  yield: yieldState,
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

onMounted(() => {
  if (harvestData.value) {
    const date = new Date(harvestData.value.datetime);
    date.setHours(date.getHours() + 7);
    state.datetime = date.toISOString().slice(0, 16);
    currentDateTime.value = state.datetime;

    state.harvestLocation = harvestData.value.location_id;
    state.pic = harvestData.value.pic_id;
    state.siklus = harvestData.value.siklus;
    state.total = harvestData.value.total;
    state.totalExMomoka = harvestData.value.total_ex_momoka;
    state.frozenWeight = harvestData.value.frozen_weight;
    state.wastedWeight = harvestData.value.wasted_weight;

    // Populate packing data
    harvestData.value.Packing.forEach((pack: any) => {
      switch (pack.package_id) {
        case 1:
          state.momoka3pcs = pack.quantity;
          break;
        case 2:
          state.momoka6pcs = pack.quantity;
          break;
        case 3:
          state.momokaA11 = pack.quantity;
          break;
        case 4:
          state.momokaA15 = pack.quantity;
          break;
        case 5:
          state.momokaGradeB = pack.quantity;
          break;
        case 6:
          state.packGradeA = pack.quantity;
          break;
        case 7:
          state.packGradeA15pcs = pack.quantity;
          break;
        case 8:
          state.packGradeB = pack.quantity;
          break;
        case 9:
          state.hatsuhana3pcs = pack.quantity;
          break;
        case 10:
          state.hatsuhana4pcs = pack.quantity;
          break;
        case 11:
          state.hatsuhana6pcs = pack.quantity;
          break;
        case 12:
          state.giftbox = pack.quantity;
          break;
      }
    });

    // Populate reject data
    harvestData.value.Reject.forEach((rejecto: any) => {
      switch (rejecto.reason_id) {
        case 1:
          reject.jamur = rejecto.quantity;
          break;
        case 2:
          reject.mildew = rejecto.quantity;
          break;
        case 3:
          reject.jamurHijau = rejecto.quantity;
          break;
        case 4:
          reject.siput = rejecto.quantity;
          break;
        case 5:
          reject.cracking = rejecto.quantity;
          break;
        case 6:
          reject.overripe = rejecto.quantity;
          break;
        case 7:
          reject.fisik = rejecto.quantity;
          break;
        case 8:
          reject.hama = rejecto.quantity;
          break;
        case 9:
          reject.polinasi = rejecto.quantity;
          break;
        case 10:
          reject.gradeC = rejecto.quantity;
          break;
        case 11:
          reject.orange = rejecto.quantity;
          break;
      }
    });
    // Populate yield data
    harvestData.value.Yield.forEach((yieldItem: any) => {
      switch (yieldItem.variant_grade_id) {
        case 1:
          yieldState.momokaGradeMix = yieldItem.quantity;
          break;
        case 2:
          yieldState.tochiotomeGradeA = yieldItem.quantity;
          break;
        case 3:
          yieldState.tochiotomeGradeB = yieldItem.quantity;
          break;
        case 4:
          yieldState.tochiotomeGradeMix = yieldItem.quantity;
          break;
      }
    });
  }
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const ensureNumber = (value: number | undefined) => Number(value) || 0;

  try {
    const payload = {
      datetime: new Date(event.data.datetime).toISOString(),
      location_id: event.data.harvestLocation,
      pic_id: event.data.pic,
      siklus: event.data.siklus,
      total: event.data.total,
      total_ex_momoka: event.data.totalExMomoka,
      frozen_weight: event.data.frozenWeight,
      wasted_weight: event.data.wastedWeight,
      Packing: [
        {
          package_id: 1,
          quantity: ensureNumber(event.data.momoka3pcs),
        },
        {
          package_id: 2,
          quantity: ensureNumber(event.data.momoka6pcs),
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
          package_id: 6,
          quantity: ensureNumber(event.data.packGradeA),
        },
        {
          package_id: 7,
          quantity: ensureNumber(event.data.packGradeA15pcs),
        },
        {
          package_id: 8,
          quantity: ensureNumber(event.data.packGradeB),
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
        {
          package_id: 12,
          quantity: ensureNumber(event.data.giftbox),
        },
      ],
      Reject: [
        {
          reason_id: 1,
          quantity: ensureNumber(event.data.reject.jamur),
        },
        {
          reason_id: 2,
          quantity: ensureNumber(event.data.reject.mildew),
        },
        {
          reason_id: 3,
          quantity: ensureNumber(event.data.reject.jamurHijau),
        },
        {
          reason_id: 4,
          quantity: ensureNumber(event.data.reject.siput),
        },
        {
          reason_id: 5,
          quantity: ensureNumber(event.data.reject.cracking),
        },
        {
          reason_id: 6,
          quantity: ensureNumber(event.data.reject.overripe),
        },
        {
          reason_id: 7,
          quantity: ensureNumber(event.data.reject.fisik),
        },
        {
          reason_id: 8,
          quantity: ensureNumber(event.data.reject.hama),
        },
        {
          reason_id: 9,
          quantity: ensureNumber(event.data.reject.polinasi),
        },
        {
          reason_id: 10,
          quantity: ensureNumber(event.data.reject.gradeC),
        },
        {
          reason_id: 11,
          quantity: ensureNumber(event.data.reject.orange),
        },
      ],
      Yield: [
        {
          variant_grade_id: 1,
          quantity: ensureNumber(event.data.yield.momokaGradeMix),
        },
        {
          variant_grade_id: 2,
          quantity: ensureNumber(event.data.yield.tochiotomeGradeA),
        },
        {
          variant_grade_id: 3,
          quantity: ensureNumber(event.data.yield.tochiotomeGradeB),
        },
        {
          variant_grade_id: 4,
          quantity: ensureNumber(event.data.yield.tochiotomeGradeMix),
        },
        {
          variant_grade_id: 5,
          quantity: ensureNumber(event.data.yield.momokaGradeA),
        },
        {
          variant_grade_id: 6,
          quantity: ensureNumber(event.data.yield.momokaGradeB),
        },
      ],
    };
    await $fetch(
      `${useRuntimeConfig().public.apiBase}/api/v1/harvest/${harvestId.value}`,
      {
        method: "PUT",
        body: payload,
      }
    );

    refresh();
    navigateTo("/harvest");
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to update harvest data",
      color: "error",
    });
  }
}

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
    <h1>Harvest Form</h1>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <div
        class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-c xl:grid-cols-3"
      >
        <UFormField label="Timestamp" name="datetime">
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
        <UFormField label="Siklus" name="siklus">
          <Input>
            <UInput
              v-model="state.siklus"
              variant="none"
              class="w-full"
              type="number"
            />
          </Input>
        </UFormField>
      </div>

      <div class="py-4">
        <h2>Packing</h2>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 py-4">
          <UFormField label="Berat harus di Frozen (g)" name="frozenWeight">
            <Input>
              <UInput
                v-model="state.frozenWeight"
                variant="none"
                class="w-full"
                type="number"
              />
            </Input>
          </UFormField>
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
        <UTabs :items="items" class="w-full mt-4" variant="link">
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
              <UFormField
                label="Hasil Marketable (packs) - Grade B"
                name="packGradeB"
              >
                <Input>
                  <UInput
                    v-model="state.packGradeB"
                    variant="none"
                    class="w-full"
                    type="number"
                  />
                </Input>
              </UFormField>
              <UFormField
                label="Hasil Marketable (packs) - Giftbox"
                name="giftBox"
              >
                <Input>
                  <UInput
                    v-model="state.giftbox"
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
      </div>

      <div class="py-2">
        <h2>Reject</h2>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3 my-8">
          <UFormField label="Berat Reject (g)" name="wastedWeight">
            <Input>
              <UInput
                v-model="state.wastedWeight"
                variant="none"
                class="w-full"
                disabled
              />
            </Input>
          </UFormField>
        </div>
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          <UFormField label="Jamur (g)" name="jamur">
            <Input>
              <UInput
                v-model="reject.jamur"
                variant="none"
                class="w-full"
                type="number"
              />
            </Input>
          </UFormField>
          <UFormField label="Mildew (g)" name="mildew">
            <Input>
              <UInput
                v-model="reject.mildew"
                variant="none"
                class="w-full"
                type="number"
              />
            </Input>
          </UFormField>
          <UFormField label="Jamur Hijau (g)" name="jamurHijau">
            <Input>
              <UInput
                v-model="reject.jamurHijau"
                variant="none"
                class="w-full"
                type="number"
              />
            </Input>
          </UFormField>
          <UFormField label="Siput (g)" name="siput">
            <Input>
              <UInput
                v-model="reject.siput"
                variant="none"
                class="w-full"
                type="number"
              />
            </Input>
          </UFormField>
          <UFormField label="Cracking (g)" name="cracking">
            <Input>
              <UInput
                v-model="reject.cracking"
                variant="none"
                class="w-full"
                type="number"
              />
            </Input>
          </UFormField>
          <UFormField label="Overripe (g)" name="overripe">
            <Input>
              <UInput
                v-model="reject.overripe"
                variant="none"
                class="w-full"
                type="number"
              />
            </Input>
          </UFormField>
          <UFormField label="Fisik (g)" name="fisik">
            <Input>
              <UInput
                v-model="reject.fisik"
                variant="none"
                class="w-full"
                type="number"
              />
            </Input>
          </UFormField>
          <UFormField label="Hama (g)" name="hama">
            <Input>
              <UInput
                v-model="reject.hama"
                variant="none"
                class="w-full"
                type="number"
              />
            </Input>
          </UFormField>
          <UFormField label="Polinasi (g)" name="polinasi">
            <Input>
              <UInput
                v-model="reject.polinasi"
                variant="none"
                class="w-full"
                type="number"
              />
            </Input>
          </UFormField>
          <UFormField label="Grade C (g)" name="gradeC">
            <Input>
              <UInput
                v-model="reject.gradeC"
                variant="none"
                class="w-full"
                type="number"
              />
            </Input>
          </UFormField>
          <UFormField label="Orange (g)" name="orange">
            <Input>
              <UInput
                v-model="reject.orange"
                variant="none"
                class="w-full"
                type="number"
              />
            </Input>
          </UFormField>
        </div>
      </div>

      <div class="py-6">
        <h2 class="mb-6">Yield</h2>
        <div class="grid grid-cols-1 gap-x-16 xl:grid-cols-2">
          <div class="flex flex-col gap-4">
            <h3>Momoka</h3>
            <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <UFormField label="Grade A" name="momokaGradeA">
                <Input>
                  <UInput
                    v-model="yieldState.momokaGradeA"
                    variant="none"
                    class="w-full"
                    type="number"
                  />
                </Input>
              </UFormField>
              <UFormField label="Grade B" name="momokaGradeB">
                <Input>
                  <UInput
                    v-model="yieldState.momokaGradeB"
                    variant="none"
                    class="w-full"
                    type="number"
                  />
                </Input>
              </UFormField>
              <UFormField label="Mix" name="momokaGradeMix">
                <Input>
                  <UInput
                    v-model="yieldState.momokaGradeMix"
                    variant="none"
                    class="w-full"
                    type="number"
                  />
                </Input>
              </UFormField>
            </div>
          </div>
          <div class="flex flex-col gap-4">
            <h3>Tochiotome</h3>
            <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
              <UFormField label="Grade A" name="tochiotomeGradeA">
                <Input>
                  <UInput
                    v-model="yieldState.tochiotomeGradeA"
                    variant="none"
                    class="w-full"
                    type="number"
                  />
                </Input>
              </UFormField>
              <UFormField label="Grade B" name="tochiotomeGradeB">
                <Input>
                  <UInput
                    v-model="yieldState.tochiotomeGradeB"
                    variant="none"
                    class="w-full"
                    type="number"
                  />
                </Input>
              </UFormField>
              <UFormField label="Mix" name="tochiotomeGradeMix">
                <Input>
                  <UInput
                    v-model="yieldState.tochiotomeGradeMix"
                    variant="none"
                    class="w-full"
                    type="number"
                  />
                </Input>
              </UFormField>
            </div>
          </div>
        </div>
      </div>

      <Button label="Submit" type="submit" class="mt-4 mr-2" />
      <Button label="Reset" type="reset" color="secondary" class="mt-4" />
    </UForm>

    <HarvestComponentsTable :data="data" :status="status" :refresh="refresh" />
  </div>
</template>

<script lang="ts" setup>
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const schema = z.object({
  datetime: z.string(),
  harvestLocation: z.number(),
  pic: z.number(),
  siklus: z.optional(z.number()),
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

const currentDateTime = ref("");

type Schema = z.output<typeof schema>;
type RejectSchema = z.output<typeof rejectSchema>;

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

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
  // try {
  //   const response = await $fetch(
  //     `${useRuntimeConfig().public.apiBase}/api/v1/harvest`,
  //     {
  //       method: "POST",
  //       body: {
  //         datetime: state.datetime,
  //         harvestLocation: state.harvestLocation,
  //         pic: state.pic,
  //         packGradeA: state.packGradeA,
  //         packGradeA15pcs: state.packGradeA15pcs,
  //         frozenWeight: state.frozenWeight,
  //         wastedWeight: state.wastedWeight,
  //         packGradeB: state.packGradeB,
  //         momoka3pcs: state.momoka3pcs,
  //         momoka6pcs: state.momoka6pcs,
  //         momokaA11: state.momokaA11,
  //         momokaA15: state.momokaA15,
  //         momokaGradeB: state.momokaGradeB,
  //         hatsuhana3pcs: state.hatsuhana3pcs,
  //         hatsuhana4pcs: state.hatsuhana4pcs,
  //         hatsuhana6pcs: state.hatsuhana6pcs,
  //         giftbox: state.giftbox,
  //         total: state.total,
  //         totalExMomoka: state.totalExMomoka,
  //       },
  //     }
  //   );

  //   navigateTo("/dashboard/harvest");
  // } catch (error) {}
}

const momokaSchema = z.object({
  grade: z.string(),
  beratBersih: z.number(),
});

const tochiotomeSchema = z.object({
  grade: z.string(),
  beratBersih: z.number(),
});
const schemaYield = z.object({
  siklus: z.number(),
  remark: z.string(),
  momoka: z.array(momokaSchema),
  tochiotome: z.array(tochiotomeSchema),
});

type SchemaYield = z.output<typeof schemaYield>;
type Momoka = z.output<typeof momokaSchema>;
type Tochiotome = z.output<typeof tochiotomeSchema>;

const stateYield = reactive<Partial<SchemaYield>>({
  siklus: undefined,
  remark: "",
});

const stateMomoka = reactive<Partial<Momoka>>({
  grade: "",
  beratBersih: undefined,
});

const stateTochiotome = reactive<Partial<Tochiotome>>({
  grade: "",
  beratBersih: undefined,
});

onMounted(() => {
  currentDateTime.value = new Date().toISOString().slice(0, 16);

  const date = new Date(currentDateTime.value);

  date.setHours(date.getHours() + 14);

  const updatedTime = date.toISOString().slice(0, 16);

  state.datetime = updatedTime;
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
              :value="currentDateTime"
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
              <UFormField label="Grade A" name="beratBersih">
                <Input>
                  <UInput
                    v-model="stateMomoka.beratBersih"
                    variant="none"
                    class="w-full"
                    type="number"
                  />
                </Input>
              </UFormField>
              <UFormField label="Grade B" name="beratBersih">
                <Input>
                  <UInput
                    v-model="stateMomoka.beratBersih"
                    variant="none"
                    class="w-full"
                    type="number"
                  />
                </Input>
              </UFormField>
              <UFormField label="Mix" name="beratBersih">
                <Input>
                  <UInput
                    v-model="stateMomoka.beratBersih"
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
              <UFormField label="Grade A" name="beratBersih">
                <Input>
                  <UInput
                    v-model="stateTochiotome.beratBersih"
                    variant="none"
                    class="w-full"
                    type="number"
                  />
                </Input>
              </UFormField>
              <UFormField label="Grade B" name="beratBersih">
                <Input>
                  <UInput
                    v-model="stateTochiotome.beratBersih"
                    variant="none"
                    class="w-full"
                    type="number"
                  />
                </Input>
              </UFormField>
              <UFormField label="Mix" name="beratBersih">
                <Input>
                  <UInput
                    v-model="stateMomoka.beratBersih"
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
  </div>
</template>

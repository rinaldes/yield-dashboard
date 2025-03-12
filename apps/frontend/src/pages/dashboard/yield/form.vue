<script lang="ts" setup>
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

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

const momokaSchema = z.object({
  grade: z.string(),
  beratBersih: z.number(),
});

const tochiotomeSchema = z.object({
  grade: z.string(),
  beratBersih: z.number(),
});
const currentDateTime = ref("");
const schema = z.object({
  timestamp: z.string(),
  location: z.string(),
  siklus: z.number(),
  remark: z.string(),
  momoka: z.array(momokaSchema),
  tochiotome: z.array(tochiotomeSchema),
});

type Schema = z.output<typeof schema>;
type Momoka = z.output<typeof momokaSchema>;
type Tochiotome = z.output<typeof tochiotomeSchema>;

const state = reactive<Partial<Schema>>({
  timestamp: "",
  location: "",
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
  currentDateTime.value = new Date().toISOString().slice(0, 16);

  const date = new Date(currentDateTime.value);

  date.setHours(date.getHours() + 14);

  const updatedTime = date.toISOString().slice(0, 16);

  state.timestamp = updatedTime;
});
</script>

<template>
  <div class="space-y-12">
    <h1>Yield Form</h1>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        <UFormField label="Timestamp" name="datetime">
          <Input>
            <UInput
              v-model="state.timestamp"
              variant="none"
              class="w-full"
              type="datetime-local"
              :value="currentDateTime"
            />
          </Input>
        </UFormField>

        <UFormField label="Lokasi Panen" name="location">
          <Input>
            <USelect
              v-model="state.location"
              variant="none"
              :items="location"
              class="w-full"
            />
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
      <hr class="my-8" />
      <div class="grid grid-cols-1 gap-x-16 xl:grid-cols-2">
        <div class="flex flex-col gap-4">
          <h2>Momoka</h2>
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
        <div class="flex flex-col gap-4">
          <h2>Tochiotome</h2>
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
      <Button label="Submit" type="submit" class="mt-4 mr-2" />
      <Button label="Reset" type="reset" color="secondary" class="mt-4" />
    </UForm>
  </div>
</template>

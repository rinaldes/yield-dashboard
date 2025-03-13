<script lang="ts" setup>
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { h, ref } from "vue";
import { getPaginationRowModel } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
const UButton = resolveComponent("UButton");
const { formatToWIB } = useDateTime();

const schema = z.object({
  datetime: z.number().min(0),
  harvestLocation: z.number(),
  pic: z.number(),
  packGradeA: z.optional(z.number().min(0)),
  packGradeA15pcs: z.optional(z.number().min(0)),
  momoka3pcs: z.optional(z.number().min(0)),
  momokaA11: z.optional(z.number().min(0)),
  momokaA15: z.optional(z.number().min(0)),
  momokaGradeB: z.optional(z.number().min(0)),
  hatsuhana3pcs: z.optional(z.number().min(0)),
  hatsuhana4pcs: z.optional(z.number().min(0)),
  hatsuhana6pcs: z.optional(z.number().min(0)),
  total: z.number().min(0),
  totalExMomoka: z.number().min(0),
});

const currentDateTime = ref(1);

const { data, status, refresh } = await useFetch<Forecast[]>(
  `${useRuntimeConfig().public.apiBase}/api/v1/forecasts`,
  {
    key: "table-forecasts",
    lazy: true,
    default: () => [],
  }
);

const columns: TableColumn<Forecast>[] = [
  {
    accessorKey: "index",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "No.",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "week",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Week",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => formatToWIB(row.original.week),
  },
  {
    accessorKey: "location_id",
    header: "Location",
    // @ts-ignore
    cell: ({ row }) => row.original.location.name,
  },
  {
    accessorKey: "pic_id",
    header: "PIC",
    // @ts-ignore
    cell: ({ row }) => row.original.pic.name,
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => row.original.total + " kg",
  },
  {
    accessorKey: "total_ex_momoka",
    header: "Total Ex Momoka",
    cell: ({ row }) => row.original.total_ex_momoka + " kg",
  },
  {
    accessorKey: "actions",
    header: () => h("div", { class: "text-right" }, "Actions"),
    cell: ({ row }) =>
      h("div", { class: "flex space-x-4 w-full justify-end" }, [
        h(UButton, {
          label: "Edit",
          icon: "lucide:pencil",
          color: "neutral",
          variant: "ghost",
          onClick: () =>
            navigateTo(`/dashboard/forecast/form/${row.original.id}`),
        }),
        h(UButton, {
          label: "Remove",
          icon: "lucide:trash",
          color: "error",
          variant: "ghost",
          onClick: async () => {
            const confirmed = confirm(
              "Are you sure you want to remove this forecast?"
            );
            if (confirmed) {
              try {
                await $fetch(
                  `${useRuntimeConfig().public.apiBase}/api/v1/forecasts/${
                    row.original.id
                  }`,
                  {
                    method: "DELETE",
                  }
                );
                refresh();
              } catch (error) {}
            }
          },
        }),
      ]),
  },
];

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  datetime: currentDateTime.value,
  harvestLocation: undefined,
  pic: undefined,
  packGradeA: undefined,
  packGradeA15pcs: undefined,
  momoka3pcs: undefined,
  momokaA11: undefined,
  momokaA15: undefined,
  momokaGradeB: undefined,
  hatsuhana3pcs: undefined,
  hatsuhana4pcs: undefined,
  hatsuhana6pcs: undefined,
  total: 0,
  totalExMomoka: 0,
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
  const firstDayOfWeek = new Date();
  firstDayOfWeek.setDate(
    firstDayOfWeek.getDate() - firstDayOfWeek.getDay() + 1
  );
  firstDayOfWeek.setDate(firstDayOfWeek.getDate() + event.data.datetime * 7);

  const payload = {
    week: firstDayOfWeek.toISOString(),
    location_id: event.data.harvestLocation,
    pic_id: event.data.pic,
    total: event.data.total,
    total_ex_momoka: event.data.totalExMomoka,
    variants: [
      {
        package_id: 6,
        quantity: event.data.packGradeA,
      },
      {
        package_id: 7,
        quantity: event.data.packGradeA15pcs,
      },
      {
        package_id: 1,
        quantity: event.data.momoka3pcs,
      },
      {
        package_id: 3,
        quantity: event.data.momokaA11,
      },
      {
        package_id: 4,
        quantity: event.data.momokaA15,
      },
      {
        package_id: 5,
        quantity: event.data.momokaGradeB,
      },
      {
        package_id: 9,
        quantity: event.data.hatsuhana3pcs,
      },
      {
        package_id: 10,
        quantity: event.data.hatsuhana4pcs,
      },
      {
        package_id: 11,
        quantity: event.data.hatsuhana6pcs,
      },
    ],
  };
  try {
    const response = await $fetch(
      `${useRuntimeConfig().public.apiBase}/api/v1/forecasts`,
      {
        method: "POST",
        body: payload,
      }
    );
    refresh();
    toast.add({
      title: "Success",
      description: "Forecast created successfully",
      color: "success",
    });
    state.harvestLocation = undefined;
    state.pic = undefined;
    state.packGradeA = undefined;
    state.packGradeA15pcs = undefined;
    state.momoka3pcs = undefined;
    state.momokaA11 = undefined;
    state.momokaA15 = undefined;
    state.momokaGradeB = undefined;
    state.hatsuhana3pcs = undefined;
    state.hatsuhana4pcs = undefined;
    state.hatsuhana6pcs = undefined;
    state.total = 0;
    state.totalExMomoka = 0;
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to create forecast",
      color: "error",
    });
  }
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

const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
});

const sorting = ref([
  {
    id: "week",
    desc: true,
  },
]);

const table = ref();
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

    <div
      class="w-full p-4 bg-white rounded-lg border-crown-of-thorns-500 border"
    >
      <UTable
        ref="table"
        v-model:pagination="pagination"
        v-model:sorting="sorting"
        :data="data || []"
        :columns="columns"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel(),
        }"
        class="flex-1"
      />

      <div class="flex justify-center mt-8">
        <UPagination
          :default-page="
            (table?.tableApi?.getState().pagination.pageIndex || 0) + 1
          "
          :items-per-page="table?.tableApi?.getState().pagination.pageSize"
          :total="table?.tableApi?.getFilteredRowModel().rows.length"
          @update:page="(p:any) => table?.tableApi?.setPageIndex(p - 1)"
        />
      </div>
    </div>
  </div>
</template>

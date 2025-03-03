<script setup lang="ts">
import { getPaginationRowModel } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
import { debounce } from "lodash-es";

defineProps(["data"]);
const table = useTemplateRef("table");
const UButton = resolveComponent("UButton");
const columns: TableColumn<any>[] = [
  {
    accessorKey: "week_number",
    header: ({ column }: any) => {
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
    cell: ({ row }: any) => `#${row.getValue("week_number")}`,
  },
  {
    accessorKey: "humidity",

    header: ({ column }: any) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Humidity",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }: any) => `${row.getValue("humidity")}%`,
  },
  {
    accessorKey: "rainfall",

    header: ({ column }: any) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Rainfall",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }: any) => `${row.getValue("rainfall")} mm`,
  },
  {
    accessorKey: "temperature",

    header: ({ column }: any) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Temperature",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }: any) => `${row.getValue("temperature")}°C`,
  },
  {
    accessorKey: "strawberry_yield",

    header: ({ column }: any) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Yield (KG)",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }: any) => `${row.getValue("strawberry_yield")} kg`,
  },
  {
    accessorKey: "reject_due_to_pest",

    header: ({ column }: any) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Reject (Pest)",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }: any) => `${row.getValue("reject_due_to_pest")} kg`,
  },
  {
    accessorKey: "reject_due_to_disease",

    header: ({ column }: any) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Reject (Disease)",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }: any) => `${row.getValue("reject_due_to_disease")} kg`,
  },
];

const sorting = ref([
  {
    id: "week_number",
    desc: false,
  },
]);

const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
});

const humidity = ref([0, 100]);
const rainfall = ref([0, 300]);
const temperature = ref([0, 50]);
const weeks = ref([1, 53]);
const rejectDueToDisease = ref([0, 10000]);
const rejectDueToPest = ref([0, 10000]);
const strawberryYield = ref([0, 10000]);

const columnFilters = ref([
  {
    id: "week_number",
    value: weeks.value,
  },
  {
    id: "humidity",
    value: humidity.value,
  },
  {
    id: "rainfall",
    value: rainfall.value,
  },
  {
    id: "temperature",
    value: temperature.value,
  },
  {
    id: "reject_due_to_disease",
    value: rejectDueToDisease.value,
  },
  {
    id: "reject_due_to_pest",
    value: rejectDueToPest.value,
  },
  {
    id: "strawberry_yield",
    value: strawberryYield.value,
  },
]);

const updateColumnFilters = debounce(() => {
  columnFilters.value = [
    { id: "week_number", value: weeks.value },
    { id: "humidity", value: humidity.value },
    { id: "rainfall", value: rainfall.value },
    { id: "temperature", value: temperature.value },
    { id: "reject_due_to_disease", value: rejectDueToDisease.value },
    { id: "reject_due_to_pest", value: rejectDueToPest.value },
    { id: "strawberry_yield", value: strawberryYield.value },
  ];
}, 500);

watch(
  [
    weeks,
    humidity,
    rainfall,
    temperature,
    rejectDueToDisease,
    rejectDueToPest,
    strawberryYield,
  ],
  () => {
    updateColumnFilters();
  }
);

onMounted(() => {
  updateColumnFilters();
});
</script>

<template>
  <div>
    <h2 class="text-2xl font-semibold my-3">📅 Weekly Data</h2>
    <UCollapsible :unmount-on-hide="false" class="flex flex-col gap-2">
      <UButton
        label="Filter"
        variant="outline"
        color="secondary"
        trailing-icon="i-lucide-filter"
        class="my-4"
        block
      />

      <template #content>
        <div
          class="px-4 py-3.5 border mb-4 border-crown-of-thorns-500 rounded-lg bg-white flex flex-col gap-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="flex flex-col gap-2 w-full">
              <label for="pic" class="text-plantation-500">Week Number: </label>
              <div class="flex flex-col sm:flex-row gap-3 justify-between">
                <div class="border border-crown-of-thorns-500 w-full">
                  <UInput
                    :model-value="weeks[0]"
                    @update:model-value="
                      (val) => (weeks = [Number(val), weeks[1]])
                    "
                    class="w-full"
                    variant="none"
                    placeholder=""
                    :ui="{ base: 'peer' }"
                    type="number"
                    min="1"
                  >
                    <label
                      class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-(--ui-text-highlighted) peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal"
                    >
                      <span class="inline-flex bg-(--ui-bg) px-1"
                        >Start Week</span
                      >
                    </label>
                  </UInput>
                </div>
                <div class="border border-crown-of-thorns-500 w-full">
                  <UInput
                    :model-value="weeks[1]"
                    @update:model-value="
                      (val) => (weeks = [weeks[0], Number(val)])
                    "
                    class="w-full"
                    variant="none"
                    placeholder=""
                    :ui="{ base: 'peer' }"
                    type="number"
                    min="1"
                  >
                    <label
                      class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-(--ui-text-highlighted) peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal"
                    >
                      <span class="inline-flex bg-(--ui-bg) px-1"
                        >End Week</span
                      >
                    </label>
                  </UInput>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="flex flex-col gap-2">
              <label for="pic" class="text-plantation-500">Humidity: </label>
              <div class="flex flex-col sm:flex-row justify-between gap-3">
                <div class="border border-crown-of-thorns-500 w-full">
                  <UInput
                    :model-value="humidity[0]"
                    @update:model-value="
                      (val) => (humidity = [Number(val), humidity[1]])
                    "
                    class="w-full"
                    variant="none"
                    placeholder=""
                    :ui="{ base: 'peer' }"
                    type="number"
                    min="1"
                  >
                    <label
                      class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-(--ui-text-highlighted) peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal"
                    >
                      <span class="inline-flex bg-(--ui-bg) px-1">Lowest</span>
                    </label>
                  </UInput>
                </div>
                <div class="border border-crown-of-thorns-500 w-full">
                  <UInput
                    :model-value="humidity[1]"
                    @update:model-value="
                      (val) => (humidity = [humidity[0], Number(val)])
                    "
                    class="w-full"
                    variant="none"
                    placeholder=""
                    :ui="{ base: 'peer' }"
                    type="number"
                    min="1"
                  >
                    <label
                      class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-(--ui-text-highlighted) peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal"
                    >
                      <span class="inline-flex bg-(--ui-bg) px-1">Highest</span>
                    </label>
                  </UInput>
                </div>
              </div>
              <USlider
                v-model="humidity"
                :min="0"
                :max="100"
                :step="1"
                class="mt-2"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label for="pic" class="text-plantation-500">Rainfall: </label>
              <div class="flex flex-col sm:flex-row justify-between gap-3">
                <div class="border border-crown-of-thorns-500 w-full">
                  <UInput
                    :model-value="rainfall[0]"
                    @update:model-value="
                      (val) => (rainfall = [Number(val), rainfall[1]])
                    "
                    class="w-full"
                    variant="none"
                    placeholder=""
                    :ui="{ base: 'peer' }"
                    type="number"
                    min="1"
                  >
                    <label
                      class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-(--ui-text-highlighted) peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal"
                    >
                      <span class="inline-flex bg-(--ui-bg) px-1">Lowest</span>
                    </label>
                  </UInput>
                </div>
                <div class="border border-crown-of-thorns-500 w-full">
                  <UInput
                    :model-value="rainfall[1]"
                    @update:model-value="
                      (val) => (rainfall = [rainfall[0], Number(val)])
                    "
                    class="w-full"
                    variant="none"
                    placeholder=""
                    :ui="{ base: 'peer' }"
                    type="number"
                    min="1"
                  >
                    <label
                      class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-(--ui-text-highlighted) peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal"
                    >
                      <span class="inline-flex bg-(--ui-bg) px-1">Highest</span>
                    </label>
                  </UInput>
                </div>
              </div>
              <USlider
                v-model="rainfall"
                :min="0"
                :max="500"
                :step="5"
                class="mt-2"
              />
            </div>

            <div class="flex flex-col gap-2">
              <label for="pic" class="text-plantation-500">Temperature: </label>
              <div class="flex flex-col sm:flex-row justify-between gap-3">
                <div class="border border-crown-of-thorns-500 w-full">
                  <UInput
                    :model-value="temperature[0]"
                    @update:model-value="
                      (val) => (temperature = [Number(val), temperature[1]])
                    "
                    class="w-full"
                    variant="none"
                    placeholder=""
                    :ui="{ base: 'peer' }"
                    type="number"
                    min="-50"
                  >
                    <label
                      class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-(--ui-text-highlighted) peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal"
                    >
                      <span class="inline-flex bg-(--ui-bg) px-1">Lowest</span>
                    </label>
                  </UInput>
                </div>
                <div class="border border-crown-of-thorns-500 w-full">
                  <UInput
                    :model-value="temperature[1]"
                    @update:model-value="
                      (val) => (temperature = [temperature[0], Number(val)])
                    "
                    class="w-full"
                    variant="none"
                    placeholder=""
                    :ui="{ base: 'peer' }"
                    type="number"
                    min="-50"
                  >
                    <label
                      class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-(--ui-text-highlighted) peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal"
                    >
                      <span class="inline-flex bg-(--ui-bg) px-1">Highest</span>
                    </label>
                  </UInput>
                </div>
              </div>
              <USlider
                v-model="temperature"
                :min="0"
                :max="40"
                :step="0.5"
                class="mt-2"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="flex flex-col gap-2 w-full">
              <label for="pic" class="text-plantation-500"
                >Strawberry Yield:
              </label>
              <div class="flex flex-col sm:flex-row gap-3 justify-between">
                <div class="border border-crown-of-thorns-500 w-full">
                  <UInput
                    :model-value="strawberryYield[0]"
                    @update:model-value="
                      (val) =>
                        (strawberryYield = [Number(val), strawberryYield[1]])
                    "
                    class="w-full"
                    variant="none"
                    placeholder=""
                    :ui="{ base: 'peer' }"
                    type="number"
                    min="1"
                  >
                    <label
                      class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-(--ui-text-highlighted) peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal"
                    >
                      <span class="inline-flex bg-(--ui-bg) px-1">Start</span>
                    </label>
                  </UInput>
                </div>
                <div class="border border-crown-of-thorns-500 w-full">
                  <UInput
                    :model-value="strawberryYield[1]"
                    @update:model-value="
                      (val) =>
                        (strawberryYield = [strawberryYield[0], Number(val)])
                    "
                    class="w-full"
                    variant="none"
                    placeholder=""
                    :ui="{ base: 'peer' }"
                    type="number"
                    min="1"
                  >
                    <label
                      class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-(--ui-text-highlighted) peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal"
                    >
                      <span class="inline-flex bg-(--ui-bg) px-1">End</span>
                    </label>
                  </UInput>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2 w-full">
              <label for="pic" class="text-plantation-500"
                >Reject due to Disease:
              </label>
              <div class="flex flex-col sm:flex-row gap-3 justify-between">
                <div class="border border-crown-of-thorns-500 w-full">
                  <UInput
                    :model-value="rejectDueToDisease[0]"
                    @update:model-value="
                      (val) =>
                        (rejectDueToDisease = [
                          Number(val),
                          rejectDueToDisease[1],
                        ])
                    "
                    class="w-full"
                    variant="none"
                    placeholder=""
                    :ui="{ base: 'peer' }"
                    type="number"
                    min="1"
                  >
                    <label
                      class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-(--ui-text-highlighted) peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal"
                    >
                      <span class="inline-flex bg-(--ui-bg) px-1">Start</span>
                    </label>
                  </UInput>
                </div>
                <div class="border border-crown-of-thorns-500 w-full">
                  <UInput
                    :model-value="rejectDueToDisease[1]"
                    @update:model-value="
                      (val) =>
                        (rejectDueToDisease = [
                          rejectDueToDisease[0],
                          Number(val),
                        ])
                    "
                    class="w-full"
                    variant="none"
                    placeholder=""
                    :ui="{ base: 'peer' }"
                    type="number"
                    min="1"
                  >
                    <label
                      class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-(--ui-text-highlighted) peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal"
                    >
                      <span class="inline-flex bg-(--ui-bg) px-1">End</span>
                    </label>
                  </UInput>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2 w-full">
              <label for="pic" class="text-plantation-500"
                >Reject due to Pest:
              </label>
              <div class="flex flex-col sm:flex-row gap-3 justify-between">
                <div class="border border-crown-of-thorns-500 w-full">
                  <UInput
                    :model-value="rejectDueToPest[0]"
                    @update:model-value="
                      (val) =>
                        (rejectDueToPest = [Number(val), rejectDueToPest[1]])
                    "
                    class="w-full"
                    variant="none"
                    placeholder=""
                    :ui="{ base: 'peer' }"
                    type="number"
                    min="1"
                  >
                    <label
                      class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-(--ui-text-highlighted) peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal"
                    >
                      <span class="inline-flex bg-(--ui-bg) px-1">Start</span>
                    </label>
                  </UInput>
                </div>
                <div class="border border-crown-of-thorns-500 w-full">
                  <UInput
                    :model-value="rejectDueToPest[1]"
                    @update:model-value="
                      (val) =>
                        (rejectDueToPest = [rejectDueToPest[0], Number(val)])
                    "
                    class="w-full"
                    variant="none"
                    placeholder=""
                    :ui="{ base: 'peer' }"
                    type="number"
                    min="1"
                  >
                    <label
                      class="pointer-events-none absolute left-0 -top-2.5 text-(--ui-text-highlighted) text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-(--ui-text-highlighted) peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-(--ui-text-dimmed) peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal"
                    >
                      <span class="inline-flex bg-(--ui-bg) px-1">End</span>
                    </label>
                  </UInput>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </UCollapsible>

    <UTable
      ref="table"
      v-model:sorting="sorting"
      v-model:pagination="pagination"
      v-model:column-filters="columnFilters"
      :data="data"
      :columns="columns"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel(),
      }"
      class="flex-1 w-full border-collapse border bg-white border-crown-of-thorns-500 rounded-lg px-4"
    />
    <div class="flex justify-center border-t border-(--ui-border) pt-4">
      <UPagination
        :default-page="
          (table?.tableApi?.getState().pagination.pageIndex || 0) + 1
        "
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
      />
    </div>
  </div>
</template>

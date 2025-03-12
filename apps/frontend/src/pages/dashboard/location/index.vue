<script setup lang="ts">
import { h, ref } from "vue";
import { getPaginationRowModel } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
import { debounce } from "lodash-es";

import * as z from "zod";

const UButton = resolveComponent("UButton");
const { ageCalculator, formatToWIB } = useDateTime();

const today = new Date();
const twoYearsAgo = new Date();
twoYearsAgo.setFullYear(today.getFullYear() - 2);

const plantingDateFilter = ref([
  twoYearsAgo.toISOString(),
  today.toISOString(),
]);

const nameFilter = ref("");
const totalPlantsFilter = ref([0, 10000]);
const areaFilter = ref([0, 1000]);

const columnFilters = ref([
  { id: "name", value: nameFilter.value },
  { id: "total_plants", value: totalPlantsFilter.value },
  { id: "area", value: areaFilter.value },
  // { id: "planting_date", value: plantingDateFilter.value },
]);

const updateColumnFilters = debounce(() => {
  columnFilters.value = [
    { id: "name", value: nameFilter.value },
    { id: "total_plants", value: totalPlantsFilter.value },
    { id: "area", value: areaFilter.value },
    // { id: "planting_date", value: plantingDateFilter.value },
  ];
  console.log(columnFilters.value);
}, 500);

type Location = {
  id: number;
  name: string;
  is_indoors: boolean;
  total_plants: number;
  planting_date: string;
  area: number;
  width: number;
  height: number;
  length: number;
};

const schema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  is_indoors: z.boolean().default(false),
  total_plants: z.number().min(0, "Total plants must be a positive number"),
  planting_date: z.string().optional(),
});

const { data, status, refresh } = await useFetch<Location[]>(
  `${useRuntimeConfig().public.apiBase}/api/v1/location?includeDetails=true`,
  {
    key: "table-locations",
    lazy: true,
    default: () => [],
  }
);

const editingLocation = ref<Location | null>(null);
const isPopupOpen = ref(false);
const isPopupPlantOpen = ref(false);

const saveLocation = async () => {
  if (!editingLocation.value) return;
  try {
    const payload = {
      ...editingLocation.value,
      area: editingLocation.value.width * editingLocation.value.length,
      planting_date: editingLocation.value.planting_date
        ? new Date(editingLocation.value.planting_date).toISOString()
        : undefined,
    };
    await $fetch(
      `${useRuntimeConfig().public.apiBase}/api/v1/location/${
        editingLocation.value.id
      }`,
      {
        method: "PUT",
        body: payload,
      }
    );
    isPopupOpen.value = false;
    isPopupPlantOpen.value = false;
    refresh();
  } catch (error) {
    console.log(error);
  }
};

const columns: TableColumn<Location>[] = [
  {
    accessorKey: "id",
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
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Name",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
  },
  {
    accessorKey: "is_indoors",
    header: "Is Indoor",

    cell: ({ row }) => (row.original.is_indoors ? "Yes" : "No"),
  },
  {
    accessorKey: "total_plants",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Total Plants",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => row.original.total_plants + " plants",
  },
  {
    accessorKey: "planting_date",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Planting Date",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => formatToWIB(row.original.planting_date),
  },
  {
    accessorKey: "planting_date",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Plant Age",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => ageCalculator(row.original.planting_date),
  },
  {
    accessorKey: "area",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Area",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => row.original.area + " m²",
  },
  {
    accessorKey: "actions",
    header: () => h("div", { class: "text-right" }, "Actions"),
    cell: ({ row }) =>
      h("div", { class: "flex space-x-4 w-full justify-end" }, [
        h(UButton, {
          label: "Update Plant",
          icon: "lucide:sprout",
          color: "success",
          variant: "ghost",
          onClick: () => {
            editingLocation.value = row.original;
            isPopupPlantOpen.value = true;
          },
        }),
        h(UButton, {
          label: "Edit",
          icon: "lucide:pencil",
          color: "neutral",
          variant: "ghost",
          onClick: () => {
            editingLocation.value = row.original;
            isPopupOpen.value = true;
          },
        }),

        h(UButton, {
          label: "Remove",
          icon: "lucide:trash",
          color: "error",
          variant: "ghost",
          onClick: async () => {
            const confirmed = confirm(
              "Are you sure you want to remove this location?"
            );
            if (confirmed) {
              try {
                await $fetch(
                  `${useRuntimeConfig().public.apiBase}/api/v1/location/${
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

const pagination = ref({
  pageIndex: 0,
  pageSize: 10,
});

const sorting = ref([
  {
    id: "name",
    desc: false,
  },
]);

const columnVisibility = ref({
  is_indoors: false,
});

const table = ref();

watch([nameFilter, totalPlantsFilter, areaFilter, plantingDateFilter], () => {
  updateColumnFilters();
});

onMounted(() => {
  updateColumnFilters();
});
</script>

<template>
  <div class="w-full space-y-4 pb-4">
    <div class="flex justify-between items-center mb-8">
      <h1>Location Table</h1>
      <Button
        label="Add Location"
        icon="lucide:plus"
        @click="navigateTo('/dashboard/location/form')"
      />
    </div>

    <UCollapsible :unmount-on-hide="false" class="flex flex-col gap-2">
      <UButton
        label="Filter"
        variant="outline"
        color="secondary"
        trailing-icon="i-lucide-filter"
        class="mb-4"
        block
      />

      <template #content>
        <div
          class="px-4 py-3.5 border mb-4 border-crown-of-thorns-500 rounded-lg bg-white flex flex-col gap-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Name Filter -->
            <UFormField label="Name" name="name">
              <Input>
                <UInput
                  v-model="nameFilter"
                  placeholder="Search by name"
                  variant="none"
                  class="w-full"
                />
              </Input>
            </UFormField>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Total Plants Filter -->
            <div class="flex flex-col gap-2">
              <label class="text-plantation-500">Total Plants:</label>
              <div class="flex flex-col sm:flex-row gap-3 justify-between">
                <Input>
                  <UInput
                    :model-value="totalPlantsFilter[0]"
                    @update:model-value="
                      (val) =>
                        (totalPlantsFilter = [
                          Number(val),
                          totalPlantsFilter[1],
                        ])
                    "
                    class="w-full"
                    variant="none"
                    placeholder="Min"
                    type="number"
                    :min="0"
                  />
                </Input>
                <Input>
                  <UInput
                    :model-value="totalPlantsFilter[1]"
                    @update:model-value="
                      (val) =>
                        (totalPlantsFilter = [
                          totalPlantsFilter[0],
                          Number(val),
                        ])
                    "
                    class="w-full"
                    variant="none"
                    placeholder="Max"
                    type="number"
                    :min="0"
                  />
                </Input>
              </div>
              <USlider
                v-model="totalPlantsFilter"
                :min="0"
                :max="10000"
                :step="100"
                class="mt-2"
              />
            </div>

            <!-- Planting Date Filter -->
            <!-- <div class="flex flex-col gap-2">
              <label class="text-plantation-500">Planting Date:</label>
              <div class="flex flex-col sm:flex-row gap-3 justify-between">
                <div class="border border-crown-of-thorns-500 w-full">
                  <UInput
                    v-model="
                      new Date(plantingDateFilter[0])
                        .toISOString()
                        .split('T')[0]
                    "
                    type="date"
                    placeholder="Start Date"
                    class="w-full"
                  />
                </div>
                <div class="border border-crown-of-thorns-500 w-full">
                  <UInput
                    v-model="
                      new Date(plantingDateFilter[1])
                        .toISOString()
                        .split('T')[0]
                    "
                    type="date"
                    placeholder="End Date"
                    class="w-full"
                  />
                </div>
              </div>
            </div> -->

            <!-- Area Filter -->
            <div class="flex flex-col gap-2">
              <label class="text-plantation-500">Area (m²):</label>
              <div class="flex flex-col sm:flex-row gap-3 justify-between">
                <Input>
                  <UInput
                    :model-value="areaFilter[0]"
                    @update:model-value="
                      (val) => (areaFilter = [Number(val), areaFilter[1]])
                    "
                    class="w-full"
                    variant="none"
                    placeholder="Min"
                    type="number"
                    :min="0"
                  />
                </Input>
                <Input>
                  <UInput
                    :model-value="areaFilter[1]"
                    @update:model-value="
                      (val) => (areaFilter = [areaFilter[0], Number(val)])
                    "
                    class="w-full"
                    variant="none"
                    placeholder="Max"
                    type="number"
                    :min="0"
                  />
                </Input>
              </div>
              <USlider
                v-model="areaFilter"
                :min="0"
                :max="1000"
                :step="10"
                class="mt-2"
              />
            </div>
          </div>
        </div>
      </template>
    </UCollapsible>

    <div
      class="w-full p-4 bg-white rounded-lg border-crown-of-thorns-500 border"
    >
      <UTable
        ref="table"
        v-model:pagination="pagination"
        v-model:sorting="sorting"
        v-model:column-visibility="columnVisibility"
        v-model:column-filters="columnFilters"
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

    <UModal v-model:open="isPopupOpen" class="w-fit px-8">
      <template #content>
        <div v-if="editingLocation" class="p-4 mx-auto">
          <h2 class="text-lg font-semibold mb-4">Update Location</h2>
          <UForm :schema="schema" :state="editingLocation" class="space-y-4">
            <UFormField label="Name" name="name">
              <UInput v-model="editingLocation.name" />
            </UFormField>
            <UFormField label="Is Indoor" name="is_indoors" hidden>
              <UCheckbox v-model="editingLocation.is_indoors" />
            </UFormField>
            <label
              >Area :
              {{ editingLocation.width * editingLocation.length }} m²</label
            >
            <br />
            <UFormField label="Width" name="width">
              <UInput v-model="editingLocation.width" type="number" />
            </UFormField>
            <UFormField label="Length" name="length">
              <UInput v-model="editingLocation.length" type="number" />
            </UFormField>
            <UFormField label="Height" name="height">
              <UInput v-model="editingLocation.height" type="number" />
            </UFormField>
            <div class="flex justify-end space-x-2">
              <UButton label="Cancel" @click="isPopupOpen = false" />
              <UButton label="Save" color="primary" @click="saveLocation" />
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <UModal v-model:open="isPopupPlantOpen" class="w-fit px-8">
      <template #content>
        <div v-if="editingLocation" class="p-4 mx-auto">
          <h2 class="text-lg font-semibold mb-4">Update Plant</h2>
          <UForm :schema="schema" :state="editingLocation" class="space-y-4">
            <h3>Location : {{ editingLocation.name }}</h3>

            <UFormField label="Total Plants" name="total_plants">
              <UInput v-model="editingLocation.total_plants" type="number" />
            </UFormField>
            <UFormField label="Planting Date" name="planting_date">
              <UInput
                v-model="editingLocation.planting_date"
                type="date"
                class="w-full"
                :value="
                  editingLocation.planting_date
                    ? new Date(editingLocation.planting_date)
                        .toISOString()
                        .split('T')[0]
                    : ''
                "
              />
            </UFormField>
            <div class="flex justify-end space-x-2">
              <UButton label="Cancel" @click="isPopupPlantOpen = false" />
              <UButton label="Save" color="primary" @click="saveLocation" />
            </div>
          </UForm>
        </div>
      </template>
    </UModal>
  </div>
</template>

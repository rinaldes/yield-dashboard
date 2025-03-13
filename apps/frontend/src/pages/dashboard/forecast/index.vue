<script lang="ts" setup>
import { h, ref } from "vue";
import { getPaginationRowModel } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
import { debounce } from "lodash-es";
const UButton = resolveComponent("UButton");
const { formatToWIB } = useDateTime();
const { $toast } = useNuxtApp();

import * as z from "zod";
type Forecast = {
  id: string;
  week: string;
  location_id: number;
  pic_id: number;
  total: number;
  total_ex_momoka: number;
  variants: {
    package_id: number;
    quantity: number;
  }[];
};

const schema = z.object({
  week: z.string(),
  location_id: z.number(),
  pic_id: z.number(),
  total: z.number(),
  total_ex_momoka: z.number(),
});

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
                $toast.success("Forecast removed successfully");
              } catch (error) {
                console.log(error);
                $toast.error("Failed to remove forecast");
              }
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
    id: "week",
    desc: false,
  },
]);

const columnVisibility = ref({});

const table = ref();
</script>

<template>
  <div class="w-full space-y-4 pb-4">
    <Toaster position="top-right" />
    <div class="flex justify-between items-center mb-8">
      <h1>Forecast Table</h1>
      <Button
        label="Add Forecast"
        icon="lucide:plus"
        @click="navigateTo('/dashboard/forecast/form')"
      />
    </div>

    <div
      class="w-full p-4 bg-white rounded-lg border-crown-of-thorns-500 border"
    >
      <UTable
        ref="table"
        v-model:pagination="pagination"
        v-model:sorting="sorting"
        v-model:column-visibility="columnVisibility"
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

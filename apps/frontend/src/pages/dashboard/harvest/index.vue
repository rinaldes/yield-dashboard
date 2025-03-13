<script setup lang="ts">
import { h, ref } from "vue";
import { getPaginationRowModel } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
import { useDateTime } from "~/composables/useDateTime";

const UButton = resolveComponent("UButton");
const { formatToWIB } = useDateTime();

type Harvest = {
  id: number;
  datetime: string;
  location: {
    id: number;
    name: string;
  };
  pic: {
    id: number;
    name: string;
  };
  siklus: number;
  total: number;
  total_ex_momoka: number;
  Packing: {
    id: number;
    package_id: number;
    quantity: number;
    package: {
      id: number;
      name: string;
    };
  }[];
  Reject: {
    id: number;
    reason_id: number;
    quantity: number;
    reason: {
      id: number;
      name: string;
    };
  }[];
  Yield: {
    id: number;
    variant_grade_id: number;
    quantity: number;
    variantGrade: {
      id: number;
      variant: {
        id: number;
        name: string;
      };
      grade: {
        id: number;
        name: string;
      };
    };
  }[];
};

const { data, status, refresh } = await useFetch<Harvest[]>(
  `${
    useRuntimeConfig().public.apiBase
  }/api/v1/harvest?include=location,pic,Packing,Reject,Yield`,
  {
    key: "table-harvest",
    lazy: true,
    default: () => [],
  }
);

const columns: TableColumn<Harvest>[] = [
  {
    id: "expand",
    cell: ({ row }) =>
      h(UButton, {
        color: "neutral",
        variant: "ghost",
        icon: "i-lucide-chevron-down",
        square: true,
        ui: {
          leadingIcon: [
            "transition-transform",
            row.getIsExpanded() ? "duration-200 rotate-180" : "",
          ],
        },
        onClick: () => row.toggleExpanded(),
      }),
  },
  {
    accessorKey: "datetime",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Date & Time",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => formatToWIB(row.original.datetime),
  },
  {
    accessorKey: "location.name",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Location",
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
    accessorKey: "pic.name",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "PIC",
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
    accessorKey: "total",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Total",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => row.original.total + " pack",
  },
  {
    accessorKey: "total_ex_momoka",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Total Without Momoka",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => row.original.total_ex_momoka + " pack",
  },
  {
    accessorKey: "siklus",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Siklus",
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
    accessorKey: "actions",
    header: " ",
    cell: ({ row }) =>
      h("div", { class: "flex space-x-2 justify-end" }, [
        h(UButton, {
          label: "Edit",
          icon: "lucide:pencil",
          color: "neutral",
          variant: "ghost",
          onClick: () =>
            navigateTo(`/dashboard/harvest/form/${row.original.id}`),
        }),
        h(UButton, {
          label: "Remove",
          icon: "lucide:trash",
          color: "error",
          variant: "ghost",
          onClick: async () => {
            const confirmed = confirm(
              "Are you sure you want to remove this harvest?"
            );
            if (confirmed) {
              try {
                await $fetch(
                  `${useRuntimeConfig().public.apiBase}/api/v1/harvest/${
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
    id: "datetime",
    desc: true,
  },
]);

// Update the table configuration
const table = ref();
const expanded = ref({});
</script>

<template>
  <div class="w-full space-y-4 pb-4">
    <div class="flex justify-between items-center mb-8">
      <h1>Harvest Data</h1>
      <Button
        label="Add Harvest"
        icon="lucide:plus"
        @click="navigateTo('/dashboard/harvest/form')"
      />
    </div>
    <div class="w-full py-6 px-4 bg-white border border-crown-of-thorns-500">
      <UTable
        ref="table"
        v-model:pagination="pagination"
        v-model:sorting="sorting"
        v-model:expanded="expanded"
        :data="data || []"
        :columns="columns"
        :pagination-options="{
          getPaginationRowModel: getPaginationRowModel(),
        }"
        :ui="{ tr: 'data-[expanded=true]:bg-(--ui-bg-elevated)/50' }"
        class="flex-1"
      >
        <template #expanded="{ row }">
          <div class="p-4 bg-gray-50 rounded-lg space-y-4">
            <h2>Packing</h2>
            <div
              class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8"
            >
              <div
                v-for="(packing, index) in row.original.Packing"
                :key="index"
                class="space-y-1"
              >
                <div class="text-sm font-bold text-plantation-500">
                  Package {{ packing.package.name }}
                </div>
                <div class="font-medium">{{ packing.quantity }} pack</div>
              </div>
            </div>
            <h2>Reject</h2>
            <div
              class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8"
            >
              <div
                v-for="(reject, index) in row.original.Reject"
                :key="index"
                class="space-y-1"
              >
                <div class="text-sm font-bold text-plantation-500">
                  Reason {{ reject.reason.name }}
                </div>
                <div class="font-medium">{{ reject.quantity }} g</div>
              </div>
            </div>
            <h2>Yield</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              <div
                v-for="(yieldItem, index) in row.original.Yield"
                :key="index"
                class="space-y-1"
              >
                <div class="text-sm font-bold text-plantation-500">
                  Variant {{ yieldItem.variantGrade.variant.name }} Grade
                  {{ yieldItem.variantGrade.grade.name }}
                </div>
                <div class="font-medium">{{ yieldItem.quantity }} tray</div>
              </div>
            </div>
          </div>
        </template>
      </UTable>

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

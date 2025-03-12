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
  harvestLocation: string;
  pic: string;
  packGradeA: number;
  packGradeA15pcs: number;
  frozenWeight: number;
  wastedWeight: number;
  packGradeB: number;
  momoka3pcs: number;
  momoka6pcs: number;
  momokaA11: number;
  momokaA15: number;
  momokaGradeB: number;
  hatsuhana3pcs: number;
  hatsuhana4pcs: number;
  hatsuhana6pcs: number;
  giftbox: number;
  total: number;
  totalExMomoka: number;
};

const { data, status, refresh } = await useFetch<Harvest[]>(
  `${useRuntimeConfig().public.apiBase}/api/v1/harvest`,
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
    accessorKey: "harvestLocation",
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
    accessorKey: "pic",
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
          color: "red",
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
    desc: false,
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
    <div class="w-full p-4 bg-white rounded-lg">
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
            <h2>Tochiotome</h2>
            <div
              class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8"
            >
              <div class="space-y-1">
                <div class="text-sm font-bold text-plantation-500">
                  Pack Grade A
                </div>
                <div class="font-medium">{{ row.original.packGradeA }}</div>
              </div>
              <div class="space-y-1">
                <div class="text-sm font-bold text-plantation-500">
                  Pack Grade A 15pcs
                </div>
                <div class="font-medium">
                  {{ row.original.packGradeA15pcs }}
                </div>
              </div>
              <div class="space-y-1">
                <div class="text-sm font-bold text-plantation-500">
                  Pack Grade B
                </div>
                <div class="font-medium">{{ row.original.packGradeB }}</div>
              </div>
              <div class="space-y-1">
                <div class="text-sm font-bold text-plantation-500">
                  Hatsuhana 3pcs
                </div>
                <div class="font-medium">{{ row.original.hatsuhana3pcs }}</div>
              </div>
              <div class="space-y-1">
                <div class="text-sm font-bold text-plantation-500">
                  Hatsuhana 4pcs
                </div>
                <div class="font-medium">{{ row.original.hatsuhana4pcs }}</div>
              </div>
              <div class="space-y-1">
                <div class="text-sm font-bold text-plantation-500">
                  Hatsuhana 6pcs
                </div>
                <div class="font-medium">{{ row.original.hatsuhana6pcs }}</div>
              </div>
              <div class="space-y-1">
                <div class="text-sm font-bold text-plantation-500">Giftbox</div>
                <div class="font-medium">{{ row.original.giftbox }}</div>
              </div>
            </div>
            <h2>Momoka</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              <div class="space-y-1">
                <div class="text-sm font-bold text-plantation-500">
                  Momoka 3pcs
                </div>
                <div class="font-medium">{{ row.original.momoka3pcs }}</div>
              </div>
              <div class="space-y-1">
                <div class="text-sm font-bold text-plantation-500">
                  Momoka A11
                </div>
                <div class="font-medium">{{ row.original.momokaA11 }}</div>
              </div>
              <div class="space-y-1">
                <div class="text-sm font-bold text-plantation-500">
                  Momoka A15
                </div>
                <div class="font-medium">{{ row.original.momokaA15 }}</div>
              </div>
              <div class="space-y-1">
                <div class="text-sm font-bold text-plantation-500">
                  Momoka Grade B
                </div>
                <div class="font-medium">{{ row.original.momokaGradeB }}</div>
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

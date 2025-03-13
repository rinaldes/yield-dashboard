<script lang="ts" setup>
import Sortable from "./Sortable.vue";
import Detail from "./Detail.vue";
import { getPaginationRowModel } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
import type { Harvest } from "../../type";
const { $toast } = useNuxtApp();

const UButton = resolveComponent("UButton");
const { formatToWIB } = useDateTime();

const editingHarvest = ref<Harvest | null>(null);
const isPopupOpen = ref(false);

const { data, status, refresh } = defineProps<{
  data: Harvest[];
  status: string;
  refresh: () => void;
}>();

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
    header: ({ column }) => h(Sortable, { column, label: "Date & Time" }),
    cell: ({ row }) => formatToWIB(row.original.datetime),
  },
  {
    accessorKey: "location.name",
    header: ({ column }) => h(Sortable, { column, label: "Location" }),
  },
  {
    accessorKey: "pic.name",
    header: ({ column }) => h(Sortable, { column, label: "PIC" }),
  },
  {
    accessorKey: "total",
    header: ({ column }) => h(Sortable, { column, label: "Total" }),
    cell: ({ row }) => `${row.original.total} pack`,
  },
  {
    accessorKey: "total_ex_momoka",
    header: ({ column }) =>
      h(Sortable, { column, label: "Total Without Momoka" }),
    cell: ({ row }) => `${row.original.total_ex_momoka} pack`,
  },
  {
    accessorKey: "siklus",
    header: ({ column }) => h(Sortable, { column, label: "Siklus" }),
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
                $toast.success("Harvest removed successfully");
              } catch (error) {
                console.log(error);
                $toast.error("Failed to remove harvest");
              }
            }
          },
        }),
      ]),
  },
];

const saveHarvest = async () => {
  if (!editingHarvest.value) return;
  try {
    const payload = {
      ...editingHarvest.value,
    };
    await $fetch(
      `${useRuntimeConfig().public.apiBase}/api/v1/brix/${
        editingHarvest.value.id
      }`,
      {
        method: "PUT",
        body: payload,
      }
    );
    isPopupOpen.value = false;
    refresh();
  } catch (error) {
    console.log(error);
  }
};

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

const table = ref();
const expanded = ref({});
</script>

<template>
  <div class="w-full py-6 px-4 bg-white border border-crown-of-thorns-500">
    <Toaster position="top-right" />
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
        <Detail :row="row" />
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
    <UModal v-model:open="isPopupOpen" class="w-fit px-8">
      <template #content>
        <div v-if="editingHarvest" class="p-4 mx-auto">
          <h2 class="text-lg font-semibold mb-4">Update Harvest</h2>

          <div class="flex justify-end space-x-2">
            <UButton label="Cancel" @click="isPopupOpen = false" />
            <UButton label="Save" color="primary" @click="saveHarvest" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import { useBrixStore } from "~/stores/brix";
import { onMounted } from "vue";
import { h, ref } from "vue";
import { getPaginationRowModel } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
import { debounce } from "lodash-es";
import { z } from "zod";
const UButton = resolveComponent("UButton");
const { formatToWIB } = useDateTime();

const brixStore = useBrixStore();

onMounted(() => {
  brixStore.fetchBrix();
});

const { data, status, refresh } = await useFetch<Brix[]>(
  `${useRuntimeConfig().public.apiBase}/api/v1/brix`,
  {
    key: "table-brix",
    lazy: true,
    default: () => [],
  }
);

type Brix = {
  id: number;
  location_id: number;
  from: string;
  type?: string;
  brix_score: number;
  createdAt: string;
  updatedAt: string;
  location: {
    name: string;
  };
};

const schema = z.object({
  location_id: z.number().min(1, "Location is required"),
  pic_id: z.number().min(1, "PIC is required"),
  from: z.enum(["market", "reject", "none"]),
  type: z.enum(["tip", "deep", "all"]).optional(),
  brix_score: z
    .number()
    .min(0, "Brix score cannot be negative")
    .max(100, "Brix score cannot exceed 100"),
});

const editingBrix = ref<Brix | null>(null);
const isPopupOpen = ref(false);

const columns: TableColumn<Brix>[] = [
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
    accessorKey: "from",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "From",
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
    accessorKey: "type",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Type",
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
    accessorKey: "brix_score",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Brix Score",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => row.original.brix_score.toFixed(2),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "neutral",
        variant: "ghost",
        label: "Inputed At",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => formatToWIB(row.original.createdAt),
  },
  {
    accessorKey: "actions",
    header: () => h("div", { class: "text-right" }, " "),
    cell: ({ row }) =>
      h("div", { class: "flex space-x-4 w-full justify-end" }, [
        h(UButton, {
          label: "Edit",
          icon: "lucide:pencil",
          color: "neutral",
          variant: "ghost",
          onClick: () => {
            editingBrix.value = row.original;
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
              "Are you sure you want to remove this brix entry?"
            );
            if (confirmed) {
              try {
                await $fetch(
                  `${useRuntimeConfig().public.apiBase}/api/v1/brix/${
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

const saveBrix = async () => {
  if (!editingBrix.value) return;
  try {
    const payload = {
      ...editingBrix.value,
    };
    await $fetch(
      `${useRuntimeConfig().public.apiBase}/api/v1/brix/${
        editingBrix.value.id
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
    id: "createdAt",
    desc: true,
  },
]);

const columnVisibility = ref({});

const table = ref();
</script>

<template>
  <div class="w-full space-y-4">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">Brix Data</h1>
      <UButton
        label="Add New"
        icon="i-heroicons-plus-20-solid"
        @click="navigateTo('/dashboard/brix/form')"
      />
    </div>
    <div class="bg-white border border-crown-of-thorns-50 p-8">
      <UCollapsible :unmount-on-hide="false" class="flex flex-col gap-2">
        <UButton
          label="Filter"
          color="primary"
          trailing-icon="i-lucide-filter"
          class="mb-4 w-fit"
        />

        <template #content>
          <div
            class="px-4 py-3.5 border mb-4 border-crown-of-thorns-500 rounded-lg bg-white flex flex-col gap-6"
          ></div>
        </template>
      </UCollapsible>

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
    <UModal v-model:open="isPopupOpen" class="w-fit px-8">
      <template #content>
        <div v-if="editingBrix" class="p-4 mx-auto">
          <h2 class="text-lg font-semibold mb-4">Update Brix</h2>
          <UForm :schema="schema" :state="editingBrix" class="space-y-4">
            <UFormField label="From" name="from">
              <UInput v-model="editingBrix.from" />
            </UFormField>
            <UFormField label="Type" name="type">
              <UInput v-model="editingBrix.type" />
            </UFormField>
            <UFormField label="Brix Score" name="brix_score">
              <UInput v-model="editingBrix.brix_score" type="number" />
            </UFormField>
          </UForm>
          <div class="flex justify-end space-x-2">
            <UButton label="Cancel" @click="isPopupOpen = false" />
            <UButton label="Save" color="primary" @click="saveBrix" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

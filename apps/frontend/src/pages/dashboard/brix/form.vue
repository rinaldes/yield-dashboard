<script lang="ts" setup>
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import BrixSamples from "./brixSamples.vue";
import type { TableColumn } from "@nuxt/ui";
const UButton = resolveComponent("UButton");
const { formatToWIB } = useDateTime();
import { getPaginationRowModel } from "@tanstack/vue-table";

const samples = ref([
  {
    from: undefined,
    type: undefined,
    brix_score: 0,
  },
]);

const { data, status, refresh } = await useFetch<Brix[]>(
  `${useRuntimeConfig().public.apiBase}/api/v1/brix`,
  {
    key: "table-brix",
    lazy: true,
    default: () => [],
  }
);

const addSample = () => {
  samples.value.push({
    from: undefined,
    type: undefined,
    brix_score: 0,
  });
};

const removeSample = (index: number) => {
  if (samples.value.length > 1) {
    samples.value.splice(index, 1);
  }
};

const schema = z.object({
  location_id: z.number().min(1, "Location is required"),
  pic_id: z.number().min(1, "PIC is required"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  location_id: undefined,
  pic_id: undefined,
});

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    console.log(event.data);
    // loop samples
    for (const sample of samples.value) {
      const payload = {
        location_id: event.data.location_id,
        pic_id: event.data.pic_id,
        from: sample.from,
        type: sample.type,
        brix_score: sample.brix_score,
      };

      const response = await $fetch(
        `${useRuntimeConfig().public.apiBase}/api/v1/brix`,
        {
          method: "POST",
          body: payload,
        }
      );
    }
    toast.add({
      title: "Success",
      description: "Brix data created successfully",
      color: "success",
    });
    state.location_id = undefined;
    state.pic_id = undefined;
    samples.value = [
      {
        from: undefined,
        type: undefined,
        brix_score: 0,
      },
    ];
    refresh();
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to create brix data",
      color: "error",
    });
  }
}

const items = [
  {
    label: "Dashboard",
    to: "/",
  },
  {
    label: "Brix",
    to: "/dashboard/brix",
  },
  {
    label: "Form",
    to: "/dashboard/brix/form",
  },
];

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
];

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
  <div class="space-y-12">
    <div>
      <UBreadcrumb :items="items" class="cursor-pointer mb-4">
        <template #separator>
          <span class="mx-2 text-(--ui-text-muted)">/</span>
        </template>
      </UBreadcrumb>
      <h1>Brix Form</h1>
    </div>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <UFormField label="Location" name="location_id" required>
          <Input>
            <AtomLocationSelect v-model="state.location_id" />
          </Input>
        </UFormField>

        <UFormField label="Pengisi Data" name="pic_id" required>
          <Input>
            <AtomPicSelect v-model="state.pic_id" />
          </Input>
        </UFormField>
      </div>

      <div
        v-for="(sample, index) in samples"
        :key="index"
        class="mb-4 border-crown-of-thorns-100 border p-4 pt-2"
      >
        <div class="flex justify-between items-center mb-2">
          <label>Sample {{ index + 1 }}</label>
          <UButton
            v-if="samples.length > 1"
            label="Remove"
            icon="i-lucide-trash"
            color="error"
            variant="ghost"
            @click="removeSample(index)"
          />
        </div>
        <BrixSamples
          v-model:from="sample.from"
          v-model:type="sample.type"
          v-model:brix_score="sample.brix_score"
        />
      </div>

      <UButton
        label="Add Sample"
        icon="i-lucide-plus"
        color="primary"
        class="mb-4"
        @click="addSample"
      />
      <br />
      <Button label="Submit" type="submit" class="mt-4 mr-2" />
      <Button label="Reset" type="reset" color="secondary" class="mt-4" />
    </UForm>
  </div>

  <div class="bg-white border border-crown-of-thorns-50 mt-8 p-8">
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
</template>

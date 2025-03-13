<script lang="ts" setup>
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";
import { h, ref } from "vue";
import { getPaginationRowModel } from "@tanstack/vue-table";
import type { TableColumn } from "@nuxt/ui";
import { debounce } from "lodash-es";
const { $toast } = useNuxtApp();

const UButton = resolveComponent("UButton");
const { ageCalculator, formatToWIB } = useDateTime();

const schema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
  is_indoors: z.boolean().default(false),
  total_plants: z.optional(
    z.number().min(0, "Total plants cannot be negative")
  ),
  width: z.optional(z.number().min(0, "Width cannot be negative")),
  height: z.optional(z.number().min(0, "Height cannot be negative")),
  length: z.optional(z.number().min(0, "Length cannot be negative")),
  area: z.optional(z.number().min(0, "Area cannot be negative")),
  planting_date: z.optional(z.string()),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  planting_date: new Date().toISOString(),
  name: "",
  is_indoors: false,
  total_plants: 0,
  width: 0,
  height: 0,
  length: 0,
  area: 0,
});

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
    $toast.success("Location updated successfully");
    refresh();
  } catch (error) {
    $toast.error("Failed to update location");
    console.log(error);
  }
};

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const payload = {
      ...state,
      planting_date: state.planting_date
        ? new Date(state.planting_date).toISOString()
        : undefined,
    };

    const response = await $fetch(
      `${useRuntimeConfig().public.apiBase}/api/v1/location`,
      {
        method: "POST",
        body: payload,
      }
    );
    $toast.success("Location created successfully");

    state.name = "";
    state.is_indoors = false;
    state.total_plants = 0;
    state.width = 0;
    state.height = 0;
    state.length = 0;
    state.area = 0;
    state.planting_date = new Date().toISOString();
    refresh();
  } catch (error) {
    console.error(error);
    $toast.error("Failed to create location");
  }
}

const items = [
  {
    label: "Dashboard",
    to: "/",
  },
  {
    label: "Location",
    to: "/dashboard/location",
  },
  {
    label: "Form",
    to: "/dashboard/location/form",
  },
];

watch(
  () => [state.width, state.height, state.length],
  () => {
    state.area = (state?.width || 0) * (state?.length || 0);
  },
  { deep: true }
);

const { data, status, refresh } = await useFetch<any[]>(
  `${useRuntimeConfig().public.apiBase}/api/v1/location?includeDetails=true`,
  {
    key: "table-locations",
    lazy: true,
    default: () => [],
  }
);

const editingLocation = ref<any | null>(null);
const isPopupOpen = ref(false);
const isPopupPlantOpen = ref(false);

const columns: TableColumn<any>[] = [
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
                $toast.success("Location removed successfully");
                refresh();
              } catch (error) {
                $toast.error("Failed to remove location");
                console.log(error);
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
    id: "id",
    desc: true,
  },
]);

const table = ref();
</script>

<template>
  <div class="space-y-12">
    <Toaster position="top-right" />
    <div>
      <UBreadcrumb :items="items" class="cursor-pointer mb-4">
        <template #separator>
          <span class="mx-2 text-(--ui-text-muted)">/</span>
        </template>
      </UBreadcrumb>
      <h1>Location Form</h1>
    </div>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <Input label="Name" class="xl:col-span-2">
          <div class="w-full flex justify-between items-center">
            <UFormField name="name" required class="w-3/4">
              <UInput v-model="state.name" variant="none" class="w-full" />
            </UFormField>
            <UFormField
              name="is_indoors"
              class="border-crown-of-thorns-500 border-l-1 pr-4 pl-6"
            >
              <UCheckbox
                v-model="state.is_indoors"
                variant="none"
                label="Is Indoor"
                size="xl"
              />
            </UFormField>
          </div>
        </Input>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <UFormField label="Area (m²)" name="area">
          <Input>
            <UInput
              v-model="state.area"
              variant="none"
              class="w-full"
              disabled
            />
          </Input>
        </UFormField>
        <UFormField label="Total Plants" name="total_plants">
          <Input>
            <UInput
              v-model="state.total_plants"
              type="number"
              variant="none"
              class="w-full"
            />
          </Input>
        </UFormField>

        <UFormField label="Planting Date" name="planting_date">
          <Input>
            <UInput
              v-model="state.planting_date"
              type="date"
              variant="none"
              class="w-full"
            />
          </Input>
        </UFormField>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <UFormField label="Length (m)" name="length" required>
          <Input>
            <UInput
              v-model="state.length"
              type="number"
              variant="none"
              class="w-full"
            />
          </Input>
        </UFormField>
        <UFormField label="Width (m)" name="width" required>
          <Input>
            <UInput
              v-model="state.width"
              type="number"
              variant="none"
              class="w-full"
            />
          </Input>
        </UFormField>
        <UFormField label="Height (m)" name="height">
          <Input>
            <UInput
              v-model="state.height"
              type="number"
              variant="none"
              class="w-full"
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

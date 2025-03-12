import { defineStore } from "pinia";

export type Brix = {
  id: number;
  location_id: number;
  pic_id: number;
  from: string;
  type?: string;
  brix_score: number;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
};

export const useBrixStore = defineStore("brix", {
  state: () => ({
    brixData: [] as Brix[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchBrix() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await useFetch<Brix[]>(
          `${useRuntimeConfig().public.apiBase}/api/v1/brix`,
          {
            key: "table-brix",
            lazy: true,
            default: () => [],
          }
        );
        this.brixData = data.value || [];
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to fetch brix data";
      } finally {
        this.loading = false;
      }
    },
    async createBrix(brixData: Omit<Brix, "id" | "createdAt" | "updatedAt">) {
      this.loading = true;
      this.error = null;
      try {
        await $fetch(`${useRuntimeConfig().public.apiBase}/api/v1/brix`, {
          method: "POST",
          body: brixData,
        });
        await this.fetchBrix();
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : "Failed to create brix entry";
      } finally {
        this.loading = false;
      }
    },
    async updateBrix(id: number, brixData: Partial<Brix>) {
      this.loading = true;
      this.error = null;
      try {
        await $fetch(`${useRuntimeConfig().public.apiBase}/api/v1/brix/${id}`, {
          method: "PUT",
          body: brixData,
        });
        await this.fetchBrix();
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : "Failed to update brix entry";
      } finally {
        this.loading = false;
      }
    },
    async deleteBrix(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await $fetch(`${useRuntimeConfig().public.apiBase}/api/v1/brix/${id}`, {
          method: "DELETE",
        });
        await this.fetchBrix();
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : "Failed to delete brix entry";
      } finally {
        this.loading = false;
      }
    },
  },
});

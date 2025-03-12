import { defineStore } from "pinia";

export type PIC = {
  id: number;
  name: string;
};

export const usePICStore = defineStore("pic", {
  state: () => ({
    pics: [] as PIC[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchPICs() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await useFetch<PIC[]>(
          `${useRuntimeConfig().public.apiBase}/api/v1/pic`,
          {
            key: "table-pics",
            lazy: true,
            default: () => [],
          }
        );
        this.pics = data.value || [];
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to fetch PICs";
      } finally {
        this.loading = false;
      }
    },
  },
});

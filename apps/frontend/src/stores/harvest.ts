import { defineStore } from "pinia";

export const useHarvestData = defineStore("data", {
  state: () => ({
    harvestData: [],
    loading: false,
  }),
  actions: {
    async fetchHarvestData() {
      this.loading = true;
      try {
        const response = await fetch(
          `${useRuntimeConfig().public.apiBase}/api/v1/harvest`
        );
        this.harvestData = await response.json();
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        this.loading = false;
      }
    },
  },
});

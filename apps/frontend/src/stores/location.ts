import { defineStore } from "pinia";

export type Location = {
  id: number;
  name: string;
  is_indoors: boolean;
  total_plants: number;
};

export const useLocationStore = defineStore("location", {
  state: () => ({
    locations: [] as Location[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchLocations() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await useFetch<Location[]>(
          `${
            useRuntimeConfig().public.apiBase
          }/api/v1/location?includeDetails=true`,
          {
            key: "table-locations",
            lazy: true,
            default: () => [],
          }
        );
        this.locations = data.value || [];
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to fetch locations";
      } finally {
        this.loading = false;
      }
    },
  },
});

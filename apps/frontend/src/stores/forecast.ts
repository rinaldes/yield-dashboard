import { defineStore } from "pinia";

export type Forecast = {
  id: string;
  week: string;
  location_id: number;
  pic_id: number;
  total: number;
  total_ex_momoka: number;
  variants: {
    package_id: number;
    quantity: number;
  }[];
};

export const useForecastStore = defineStore("forecast", {
  state: () => ({
    forecasts: [] as Forecast[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchForecasts() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await useFetch<Forecast[]>(
          `${useRuntimeConfig().public.apiBase}/api/v1/forecasts`,
          {
            key: "table-forecasts",
            lazy: true,
            default: () => [],
          }
        );
        this.forecasts = data.value || [];
      } catch (error) {
        this.error =
          error instanceof Error ? error.message : "Failed to fetch forecasts";
      } finally {
        this.loading = false;
      }
    },
  },
});

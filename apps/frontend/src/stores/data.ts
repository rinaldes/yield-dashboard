import { defineStore } from "pinia";

export const useDataStore = defineStore("data", {
  state: () => ({
    weeklyData: [],
    predictions: null,
    summary: null,
    loading: false,
  }),
  actions: {
    async fetchWeeklyData() {
      this.loading = true;
      try {
        const response = await fetch(
          `${useRuntimeConfig().public.apiBase}/data/weekly`
        );
        this.weeklyData = await response.json();
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchPredictions() {
      this.loading = true;
      try {
        const response = await fetch(
          `${useRuntimeConfig().public.apiBase}/data/predict`
        );
        this.predictions = await response.json();
        console.log("this.prediction");
        console.log(this.predictions);
      } catch (error) {
        console.error("Failed to fetch predictions", error);
      } finally {
        this.loading = false;
      }
    },

    async fetchSummary() {
      this.loading = true;
      try {
        const response = await fetch(
          `${useRuntimeConfig().public.apiBase}/data/summary`
        );
        const data = await response.json();
        this.summary = { ...data }; // ✅ Ensure reactivity by spreading into a new object
        console.log("this.summary");
        console.log(this.summary);
      } catch (error) {
        console.error("Failed to fetch summary data", error);
      } finally {
        this.loading = false;
      }
    },
  },
});

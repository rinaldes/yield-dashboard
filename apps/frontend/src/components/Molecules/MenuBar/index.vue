<script setup lang="ts">
const items = ref([
  {
    label: "Production",
    children: [
      {
        label: "Harvest",
        icon: "i-lucide-house",
      },
      {
        label: "Yield",
        icon: "i-lucide-cloud-download",
      },
    ],
  },
  {
    label: "Operational",
    children: [
      {
        label: "PIC",
        icon: "i-lucide-user",
        to: "/dashboard/define-shortcuts",
      },
      {
        label: "useOverlay",
        icon: "i-lucide-file-text",
        description: "Display a modal/slideover within your application.",
        to: "/composables/use-overlay",
      },
      {
        label: "useToast",
        icon: "i-lucide-file-text",
        description: "Display a toast within your application.",
        to: "/composables/use-toast",
      },
    ],
  },
  {
    label: "Components",
    icon: "i-lucide-box",
    to: "/components",
    active: true,
    children: [
      {
        label: "Link",
        icon: "i-lucide-file-text",
        description: "Use NuxtLink with superpowers.",
        to: "/components/link",
      },
      {
        label: "Modal",
        icon: "i-lucide-file-text",
        description: "Display a modal within your application.",
        to: "/components/modal",
      },
      {
        label: "NavigationMenu",
        icon: "i-lucide-file-text",
        description: "Display a list of links.",
        to: "/components/navigation-menu",
      },
      {
        label: "Pagination",
        icon: "i-lucide-file-text",
        description: "Display a list of pages.",
        to: "/components/pagination",
      },
      {
        label: "Popover",
        icon: "i-lucide-file-text",
        description:
          "Display a non-modal dialog that floats around a trigger element.",
        to: "/components/popover",
      },
      {
        label: "Progress",
        icon: "i-lucide-file-text",
        description: "Show a horizontal bar to indicate task progression.",
        to: "/components/progress",
      },
    ],
  },
]);
</script>

<template>
  <UNavigationMenu orientation="horizontal" :items="items" />
</template>

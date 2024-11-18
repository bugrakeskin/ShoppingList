<template>
  <!-- Compenant DIV -->
  <div
    class="border-b border-gray-100 dark:border-gray-800 my-4 flex p-2 items-center text-xl justify-between md:hover:bg-gray-800"
  >
    <!-- LEFT DIV -->
    <div class="flex space-x-4 items-center">
      <UCheckbox v-model="selected" />
      <div class="flex space-x-2 items-center">
        <UIcon
          class="text-gray-500"
          dark:text-green-400
          :name="iconType"
        ></UIcon>
        <div class="text-gray-800 dark:text-gray-400 leading-6 font-sans">
          {{ props.shopLists.name }}
        </div>
      </div>
    </div>
    <!-- RIGTH DIV -->
    <div class="flex items-center px-4 space-x-1">
      <span class="text-gray-400 text-sm dark:text-gray-500"
        >{{ whenAdded }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const selected = ref(false);

import type { ShoppingList } from "~/types/types";

const props = defineProps({
  shopLists: {
    type: Object as () => ShoppingList,
    required: true,
  },
});
const iconType = computed(() => {
  if (props.shopLists.type === "Yiyecek") {
    return "hugeicons:vegetarian-food";
  } else if (props.shopLists.type === "Temizlik") {
    return "carbon:clean";
  } else {
    return "i-heroicons-arrow-down-tray";
  }
});
const whenAdded = computed(() => {
  const today = new Date();
  const date = new Date(props.shopLists.created_at);
  const diffTime = Math.abs(today.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return "Bugün";
  }
  return diffDays + " gün önce";
});
</script>

<style></style>

<template>
  <div class="flex justify-between items-center container mx-auto">
    <div
      class="md:hover:bg-green-900 p-2 cursor-pointer border-b border-gray-100 dark:border-gray-800"
    >
      <div class="flex space-x-3 items-center justify-between">
        <div class="text-xl">
          <UCheckbox v-model="selected" />
          <span>
            {{ props.shoppinglist.name }}
          </span>
        </div>
        <div class="flex space-x-1">
          <UBadge color="white" variant="solid">
            <UIcon class="text-2xl text-green-400" :name="getIcon" />
          </UBadge>
        </div>
        <div class="flex items-center px-4 space-x-1">
          <span class="text-gray-500 text-sm font-sans">2 gün önce</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const selected = ref(false);
/* const products = [
  {
    id: 1,
    name: "Domates",
    icon: "noto-v1:tomato",
  },
];
 */

import type { ShoppingList } from "~/types/types";

const props = defineProps({
  shoppinglist: {
    type: Object as () => ShoppingList,
    required: true,
  },
});
const getIcon = computed(() => {
  if (props.shoppinglist.type === "Yiyecek") {
    return "hugeicons:vegetarian-food";
  } else if (props.shoppinglist.type === "Temizlik") {
    return "carbon:clean";
  } else {
    return "i-heroicons-arrow-down-tray";
  }
});

// Function to add product to shoppingList table
</script>

<style></style>

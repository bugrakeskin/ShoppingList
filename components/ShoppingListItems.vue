<template>
  <!-- Header part -->
  <div>
    <h1 class="text-2xl text-green-600 dark:text-green-300 p-4">
      Alışveriş Listesi
    </h1>

    <div
      v-if="shopListItems && shopListItems.length === 0"
      class="text-gray-500 dark:text-gray-400 p-4"
    >
      <p class="text-xl">Alışveriş listeniz boş.</p>
    </div>
  </div>
  <!-- Loading state -->
  <div v-if="loading" class="text-center">
    <span>Loading products...</span>
  </div>

  <!-- Products list -->
  <div v-else>
    <div v-for="item in shopListItems" :key="item.id">
      <!-- Component Container -->
      <div
        class="border-b border-gray-100 dark:border-gray-800 my-4 flex p-2 items-center text-xl justify-between md:hover:bg-gray-300 md:dark:hover:bg-gray-800"
      >
        <!-- LEFT DIV -->
        <div class="flex space-x-2">
          <UIcon
            class="text-gray-500"
            dark:text-green-400
            :name="getIconForType(item.type)"
          ></UIcon>
          <div class="text-gray-800 dark:text-gray-400 leading-6 font-sans">
            {{ item.name }}
          </div>
        </div>

        <!-- RIGHT DIV -->
        <div class="flex items-center px-4 space-x-1">
          <span class="text-gray-400 text-sm dark:text-gray-500 text-nowrap">
            {{ getDateCalculated(item.created_at) }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ShoppingList } from "~/types/types";

// State definitions
const shopListItems = ref<ShoppingList[] | null>(null);
const { getIconForType } = useIcon();
const selected = ref(false);
const completed = ref(false);
const loading = ref(true);

// `whenAdded` calculation for each item
const getDateCalculated = (createdAt: string | Date) => {
  const { calculateDate } = useWhenAddedCalculate(createdAt); // Use the composable
  return calculateDate.value; // Access the computed value here
};

// Completion state toggle function
const toggleCompleted = async () => {
  completed.value = !completed.value;
  selected.value = completed.value; // Sync the completed state with the checkbox
};

// Fetch the shopping list from Supabase
const fetchShoppingList = async () => {
  const {
    data: shoppingData,
    error,
    loading: isLoading,
  } = await useSupabaseData<ShoppingList>("shoppingList", {
    orderBy: { column: "created_at", ascending: false }, // Sort by created_at
  });

  if (error) {
    console.error("Error fetching Shopping List:", error);
  }

  shopListItems.value = shoppingData;
  loading.value = isLoading;
};

// Fetch data on mounted
onMounted(() => {
  fetchShoppingList();
});
</script>

<template>
  <!-- Compenant DIV -->
  <div
    @click="toggleCompleted"
    :class="completed ? 'line-through text-black dark:text-white' : ''"
    class="border-b border-gray-100 dark:border-gray-800 p-2 flex items-center text-xl justify-between md:hover:bg-gray-800 cursor-pointer"
  >
    <!-- LEFT DIV -->
    <div class="flex space-x-2 items-center">
      <UCheckbox v-model="selected" />
      <div class="flex space-x-2 items-center">
        <UIcon
          class="text-green-600 dark:text-green-300"
          dark:text-green-400
          :name="iconType"
        ></UIcon>
        <div class="text-gray-600 dark:text-gray-200 leading-6 font-sans">
          {{ props.shopLists.name }}
        </div>
      </div>
    </div>
    <!-- RIGTH DIV -->
    <div class="flex items-center px-4 space-x-1">
      <span class="text-gray-400 text-sm dark:text-gray-500">{{
        whenAdded
      }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const selected = ref(false);
const completed = ref(false);
const supabase = useSupabaseClient<HistoryOfShoppingListInt>();

import type { HistoryOfShoppingListInt, ShoppingList } from "~/types/types";

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
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const createdDate = new Date(
    new Date(props.shopLists.created_at).getFullYear(),
    new Date(props.shopLists.created_at).getMonth(),
    new Date(props.shopLists.created_at).getDate()
  );

  if (todayDate.getTime() === createdDate.getTime()) {
    return "Bugün";
  }

  const diffTime = todayDate.getTime() - createdDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays + " gün önce";
});

const toast = useToast();
const emit = defineEmits(["addedToHistory", "addedtoShoppingList"]);

const toggleCompleted = async () => {
  completed.value = !completed.value;
  selected.value = completed.value; // Sync checkbox with completed state

  if (completed.value) {
    await saveToHistory();
    await deleteFromShoppingList(); // Add the deletion after saving to history
    toast.add({ title: "Ürün Satın Alındı." });
    emit("addedToHistory"); // Emit event here
  }
};

async function saveToHistory() {
  const { error } = await supabase.from("history").insert({
    name: props.shopLists.name,
    type: props.shopLists.type,
    created_at: new Date().toISOString(),
  });
  if (error) {
    console.error("Error:", error.message);
  }
}

async function deleteFromShoppingList() {
  const { error } = await supabase
    .from("shoppingList")
    .delete()
    .eq("id", props.shopLists.id); // Delete the item based on its ID
  if (error) {
    console.error("Error deleting from shoppingList:", error.message);
  }
  emit("addedtoShoppingList");
}
</script>

<style></style>

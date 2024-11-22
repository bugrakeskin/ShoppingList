<template>
  <!-- Compenant DIV -->
  <div
    @click="toggleCompleted"
    :class="completed ? 'line-through text-black dark:text-white' : ''"
    class="border-b border-gray-100 dark:border-gray-800 p-2 flex items-center md:text-xl sm:text-sm text-pretty justify-between md:hover:bg-gray-300 md:dark:hover:bg-gray-800 cursor-pointer"
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
      <span class="text-gray-400 text-sm dark:text-gray-500 text-nowrap">
        {{ whenAdded }}</span
      >
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

const iconType = useIconType(props.shopLists.type);

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
    toast.add({
      title: "Ürün Satın Alındı.",
      description: "Alışveriş listesinden silindi.",
    });
    emit("addedToHistory"); // Emit event here
  }
};

async function saveToHistory() {
  // First, check if the item already exists in history
  const { data, error: selectError } = await supabase
    .from("history")
    .select("id")
    .eq("name", props.shopLists.name)
    .single();

  if (selectError && selectError.code !== "PGRST116") {
    // Ignore if no rows found
    console.error("Error checking history:", selectError.message);
    return;
  }

  if (data) {
    // If record exists, do nothing or update it (optional)
    console.log("Record already exists, updating...");
  } else {
    // If no record found, perform an insert
    const { error: insertError } = await supabase.from("history").insert({
      name: props.shopLists.name,
      type: props.shopLists.type,
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Error inserting into history:", insertError.message);
    } else {
      console.log("Insert successful");
    }
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

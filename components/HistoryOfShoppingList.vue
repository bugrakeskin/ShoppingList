<template>
  <!-- component main div -->

  <div
    class="max-h-[10vh] overflow-y-auto border-b border-gray-100 dark:border-gray-800"
  >
    <div
      class="flex p-2 space-x-2 justify-between mt-2 text-gray-600 dark:text-gray-200"
    >
      <div>{{ props.HistoryOfShoppingListItems.name }}</div>
      <div>{{ props.HistoryOfShoppingListItems.type }}</div>
      <div>{{ whenAdded }}</div>
    </div>
  </div>
  <!-- component main div -->
</template>

<script lang="ts" setup>
import type { HistoryOfShoppingListInt } from "~/types/types";

const props = defineProps({
  HistoryOfShoppingListItems: {
    type: Object as () => HistoryOfShoppingListInt,
    required: true,
  },
});

const whenAdded = computed(() => {
  const today = new Date();
  // Bugünün sadece yıl, ay, gün değerlerini alın
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const createdDate = new Date(
    new Date(props.HistoryOfShoppingListItems.created_at).getFullYear(),
    new Date(props.HistoryOfShoppingListItems.created_at).getMonth(),
    new Date(props.HistoryOfShoppingListItems.created_at).getDate()
  );

  // Tarihler aynı gün mü kontrol et
  if (todayDate.getTime() === createdDate.getTime()) {
    return "Bugün";
  }

  // Gün farkını hesapla
  const diffTime = todayDate.getTime() - createdDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // ceil ile yukarı yuvarla

  return diffDays + " gün önce";
});
</script>

<style></style>

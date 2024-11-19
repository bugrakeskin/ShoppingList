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
      <span class="text-gray-400 text-sm dark:text-gray-500"
        >{{ whenAdded }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const selected = ref(false);
const completed = ref(false);

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
  // Bugünün sadece yıl, ay, gün değerlerini alın
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

  // Tarihler aynı gün mü kontrol et
  if (todayDate.getTime() === createdDate.getTime()) {
    return "Bugün";
  }

  // Gün farkını hesapla
  const diffTime = todayDate.getTime() - createdDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // ceil ile yukarı yuvarla

  return diffDays + " gün önce";
});
const isStruckThrough = ref(false);
const toast = useToast();
const toggleCompleted = () => {
  completed.value = !completed.value;
  selected.value = completed.value; // Sync checkbox with completed state
  if (completed.value) {
    toast.add({ title: "Ürün Satın Alındı." });
  }
};
</script>

<style></style>

<template>
  <div></div>

  <div class="my-4">
    <div>
      <div
        class="md:hover:bg-green-900 p-2 cursor-pointer border-b border-gray-100 dark:border-gray-800"
      >
        <div class="flex space-x-3 items-center justify-between">
          <div class="text-xl">
            <span>
              {{ props.products.name }}
            </span>
          </div>
          <div class="flex space-x-1">
            <UBadge color="white" variant="solid">
              <UIcon class="text-2xl text-green-400" :name="iconType" />
            </UBadge>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Products } from "~/types/types";
const selected = ref(false);
const props = defineProps({
  products: {
    type: Object as () => Products,
    required: true,
  },
});
const iconType = computed(() => {
  if (props.products.type === "Yiyecek") {
    return "hugeicons:vegetarian-food";
  } else if (props.products.type === "Temizlik") {
    return "carbon:clean";
  } else {
    return "i-heroicons-arrow-down-tray";
  }
});
</script>

<style></style>

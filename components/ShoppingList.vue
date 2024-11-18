<template>
  <div class="flex justify-between items-center container mx-auto">
    <div>
      <div
        class="flex space-x-4 items-center p-4"
        v-for="product in products"
        :key="product.id"
      >
        <UCheckbox v-model="selected" />
        <div class="flex space-x-1 items-center">
          <UIcon :name="product.icon" />
          <div>{{ product.name }}</div>
        </div>
      </div>
    </div>
    <div class="flex items-center px-4 space-x-1">
      <span class="text-gray-500 text-sm font-mono">2 gün önce</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const selected = ref(false);
const products = [
  {
    id: 1,
    name: "Domates",
    icon: "noto-v1:tomato",
  },
];
</script>

<style></style>

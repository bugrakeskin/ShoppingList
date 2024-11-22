<template>
  <div class="">
    <UTabs :items="items" :default-index="0">
      <template #ShoppingList>
        <ShoppingListItems />
        <div class="mt-8 p-2">
          <UButton
            class="bg-green-400 text-gray-600"
            block
            label="Ekle"
            @click="isOpen = true"
          />
          <USlideover v-model="isOpen" prevent-close>
            <UCard class="flex flex-col flex-1">
              <template #header>
                <div class="flex items-center justify-between">
                  <h3
                    class="text-base leading-6 text-gray-500 dark:text-gray-400"
                  >
                    Alışveriş Listesine Ekle
                  </h3>
                  <UButton
                    color="gray"
                    variant="ghost"
                    icon="i-heroicons-x-mark-20-solid"
                    class="-my-1"
                    @click="isOpen = false"
                  />
                </div>
              </template>
              <div class="max-h-[80vh] overflow-y-auto">
                <ProductList2 />
              </div>
            </UCard>
          </USlideover>
        </div>
      </template>

      <!-- Ürünler -->
      <template #ProductsInput>
        <ProductsForm @productAdded="refreshProducts" />
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false);
const emit = defineEmits(["productAdded"]);

// Define the refreshProducts function
const refreshProducts = async () => {
  console.log("Product list refresh triggered!");
  // Perform any logic to update state or notify other components if needed.
};
// Tabs definition
const items = [
  {
    label: "Alışveriş Listesi",
    icon: "i-heroicons-information-circle",
    slot: "ShoppingList",
  },
  {
    label: "Ürünler",
    icon: "i-heroicons-arrow-down-tray",
    slot: "ProductsInput",
  },
];
</script>

<style scoped>
::-webkit-scrollbar {
  display: none;
}

body {
  -ms-overflow-style: none; /* IE ve Edge */
  scrollbar-width: none; /* Firefox */
}
</style>

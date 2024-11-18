<template>
  <div class="p-4">
    <UTabs :items="items" :default-index="0">
      <template #ShoppingList>
        <ShoppingList
          v-for="shopList in shopLists"
          :key="shopList.id"
          :shopLists="shopList"
        />
        <div>
          <UButton
            class="bg-green-400 text-gray-600"
            block
            label="Ekle"
            @click="isOpen = true"
          />

          <USlideover v-model="isOpen" prevent-close>
            <UCard
              class="flex flex-col flex-1"
              :ui="{
                body: { base: 'flex-1' },
                ring: '',
                divide: 'divide-y divide-gray-100 dark:divide-gray-800',
              }"
            >
              <template #header>
                <div class="flex items-center justify-between">
                  <h3
                    class="text-base leading-6 text-gray-500 dark:text-gray-400"
                  >
                    Listeye Ekle
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
              <div @click="toast.add({ title: 'Alışveriş Listesine Eklendi' })">
                <ProductList
                  v-for="product in products"
                  :key="product.id"
                  :products="product"
                />
              </div>
              <!--  <Placeholder class="h-full" /> -->
            </UCard>
          </USlideover>
        </div>
      </template>
      <template #ProductsInput>
        <ProductsInput />
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false);

import type { Products, ShoppingList } from "~/types/types";

const products = ref<Products[]>([]);
const shopLists = ref<ShoppingList[]>([]);

const supabaseProduct = useSupabaseClient<Products>();
const supabaseList = useSupabaseClient<ShoppingList>();

/* fetch Products Table from Supabase */
const { data: productsData, error: productsError } = await useAsyncData(
  "products",
  async () => {
    const { data, error } = await supabaseProduct
      .from("products") // Fetch products
      .select(); // Adjust fields as needed
    if (error) throw new Error(error.message);
    return data;
  }
);

// Assign productsData to products reactive variable
products.value = productsData?.value ?? [];
/* Fetch Products */

/* fetch shoppingList Table from Supabase */
const { data: shopListsData, error: shopListsError } = await useAsyncData(
  "shoppingList",
  async () => {
    const { data, error } = await supabaseProduct
      .from("shoppingList") // Fetch products
      .select(); // Adjust fields as needed
    if (error) throw new Error(error.message);
    return data;
  }
);

// Assign productsData to products reactive variable
shopLists.value = shopListsData?.value ?? [];
/* Fetch shoppingList */

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

const toast = useToast();
</script>

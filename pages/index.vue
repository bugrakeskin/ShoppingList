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
              <div>
                <ProductList
                  v-for="product in products"
                  :key="product.id"
                  :products="product"
                  @productDeleted="refreshProducts"
                  @addedToShoppingList="refreshShoppingList"
                />
              </div>
            </UCard>
          </USlideover>
        </div>
      </template>
      <template #ProductsInput>
        <!-- ProductAdded olayını yakalıyoruz -->
        <ProductsInput @productAdded="refreshProducts" />
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

const toast = useToast();

// Fetch Products
const fetchProducts = async () => {
  try {
    const { data, error } = await supabaseProduct.from("products").select();
    if (error) throw error;

    products.value = data ?? [];
  } catch (error) {
    console.error("Error fetching products:", error);
    toast.add({ title: "Failed to fetch products." });
  }
};

// Refresh Products (Ürünleri yeniden getir)

const refreshShoppingList = async () => {
  await fetchShoppingList();
};
const refreshProducts = async () => {
  await fetchProducts();
};

// Fetch Shopping List
const fetchShoppingList = async () => {
  try {
    const { data, error } = await supabaseList.from("shoppingList").select();
    if (error) throw error;

    shopLists.value = data ?? [];
  } catch (error) {
    console.error("Error fetching shopping list:", error);
    toast.add({ title: "Failed to fetch shopping list." });
  }
};

await fetchProducts();
await fetchShoppingList();

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

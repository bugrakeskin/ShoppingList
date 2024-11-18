<template>
  <div class="">
    <UTabs :items="items" :default-index="0">
      <template #ShoppingList>
        <div class="pt-4">
          <h1 class="text-2xl text-green-600 dark:text-green-300">
            Alışveriş Listesi
          </h1>

          <ShoppingList
            v-for="shopList in shopLists"
            :key="shopList.id"
            :shopLists="shopList"
          />
        </div>
        <div class="mt-8">
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

      <!-- Ürünler -->
      <template #ProductsInput>
        <ProductsInput @productAdded="refreshProducts" />
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, watch } from "vue";
import type { ShoppingList, Products } from "~~/types/types"; // Add the correct types

// Lazy-loaded components
const ShoppingList = defineAsyncComponent(
  () => import("~/components/ShoppingList.vue")
);
const ProductList = defineAsyncComponent(
  () => import("~/components/ProductList.vue")
);
const ProductsInput = defineAsyncComponent(
  () => import("~/components/ProductsInput.vue")
);

// Reactive states with types
const isOpen = ref(false);
const activeTab = ref("ShoppingList");
const products = ref<Products[]>([]); // Explicitly typing products array
const shopLists = ref<ShoppingList[]>([]); // Explicitly typing shopLists array

// Supabase and toast instances
const supabase = useSupabaseClient();
const toast = useToast();

// Fetch data from Supabase
const fetchData = async (table: string, targetRef: any) => {
  try {
    const { data, error } = await supabase.from(table).select();
    if (error) throw error;
    targetRef.value = data ?? [];
  } catch (err) {
    console.error(`Error fetching ${table}:`, err);
    toast.add({ title: `Failed to fetch ${table}` });
  }
};

// Refresh functions
const refreshProducts = async () => {
  await fetchData("products", products);
};

const refreshShoppingList = async () => {
  await fetchData("shoppingList", shopLists);
};

// Watch active tab
watch(activeTab, async () => {
  if (activeTab.value === "ShoppingList") {
    await refreshShoppingList();
  } else if (activeTab.value === "ProductsInput") {
    await refreshProducts();
  }
});

// Initial data fetch
await refreshProducts();
await refreshShoppingList();

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
/* Add any custom styles here */
</style>

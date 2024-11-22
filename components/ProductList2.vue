<template>
  <div class="container mx-auto py-4">
    <h1 class="text-3xl font-semibold mb-4">Products</h1>

    <!-- Loading state -->
    <div v-if="loading" class="text-center">
      <span>Loading products...</span>
    </div>

    <!-- Products list -->
    <div v-else>
      <div v-for="product in products" :key="product.id">
        <!-- Component Container -->
        <div
          class="border-b border-gray-100 dark:border-gray-800 my-4 flex p-2 items-center text-xl justify-between md:hover:bg-gray-300 md:dark:hover:bg-gray-800"
        >
          <!-- LEFT DIV -->
          <div class="flex space-x-2">
            <UIcon
              class="text-gray-500"
              dark:text-green-400
              :name="useIconType(product.type).value"
            ></UIcon>
            <div class="text-gray-800 dark:text-gray-400 leading-6 font-sans">
              {{ product.name }}
            </div>
          </div>

          <!-- RIGHT DIV -->
          <div class="flex space-x-4">
            <!-- Add to Shopping List Button -->
            <UButton
              @click=""
              :icon="buttonIcon"
              size="sm"
              color="primary"
              square
              variant="solid"
            />
            <!-- Delete Product Button -->
            <UButton
              @click="deleteProduct(product.id)"
              icon="i-heroicons-trash"
              size="sm"
              color="red"
              square
              variant="solid"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
scrollbars;
import type { Products } from "~/types/types"; // Import Products and ShoppingList interfaces
import { useIconType } from "~/composables/useIconType"; // Import the composable
const emit = defineEmits(["productAdded"]);
const buttonIcon = ref("carbon:shopping-cart-plus"); // Initial icon for the button

const products = ref<Products[] | null>(null);
const loading = ref(true);

// Fetch products from Supabase using filters and order
const fetchProducts = async () => {
  const {
    data: productsData,
    error,
    loading: isLoading,
  } = await useSupabaseData<Products>("products", {
    orderBy: { column: "created_at", ascending: false }, // Order by created_at in ascending order
    /*  limit: 5, */ //limited to 5
  });

  if (error) {
    console.error("Error fetching products:", error);
  }

  products.value = productsData;
  loading.value = isLoading;
};

// Fetch data when the component is mounted
onMounted(async () => {
  await fetchProducts(); // Fetch products first
});

// deleteProduct fonksiyonu

const deleteProduct = async (id: number) => {
  const { success, error } = await useSupabaseDelete("products", id);

  if (success) {
    // Silme başarılı olduğunda, ürünü listeden kaldırıyoruz
    products.value =
      products.value?.filter((product) => product.id !== id) || [];
  } else {
    // Hata durumunda kullanıcıya mesaj gösterilir
    console.error("Error deleting product:", error);
  }
};

// Listen for the 'productAdded' event and fetch products again
watchEffect(() => {
  const unwatch = emit("productAdded", () => {
    fetchProducts(); // Fetch products again when the event is emitted
  });

  return unwatch; // Optional cleanup if needed
});
</script>

<style scoped></style>

<template>
  <div>
    <!-- Compenant DIV -->
    <div
      class="border-b border-gray-100 dark:border-gray-800 my-4 flex p-2 items-center text-xl justify-between md:hover:bg-gray-800"
    >
      <!-- LEFT DIV -->
      <div class="flex space-x-2">
        <div>
          <UIcon
            class="text-gray-500"
            dark:text-green-400
            :name="iconType"
          ></UIcon>
        </div>
        <div class="text-gray-800 dark:text-gray-400 leading-6 font-sans">
          {{ props.products.name }}
        </div>
      </div>
      <!-- RIGHT DIV -->
      <div class="flex space-x-4">
        <UButton
          @click="addToShoppingList"
          icon="carbon:shopping-cart-plus"
          size="sm"
          color="primary"
          square
          variant="solid"
        />
        <UButton
          @click="deleteProduct"
          icon="i-heroicons-trash"
          size="sm"
          color="primary"
          square
          variant="solid"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Products } from "~/types/types";
const toast = useToast();
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

const supabase = useSupabaseClient<Products>();
const products = ref<Products[]>([]);

const fetchProducts = async () => {
  try {
    const { data, error } = await supabase.from("products").select();

    if (error) throw error;

    // Update the products reactive variable
    products.value = data ?? [];
  } catch (error: any) {
    console.error("Error fetching products:", error);
    toast.add({ title: "Failed to load products." });
  }
};
const emit = defineEmits(["productDeleted", "addedToShoppingList"]);

const deleteProduct = async () => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", props.products.id);

    if (error) throw error;

    toast.add({ title: "Ürün Başarıyla Silindi." });

    emit("productDeleted"); // Notify parent
  } catch (error: any) {
    console.error("Error deleting product:", error);
    toast.add({ title: "Failed to delete product." });
  }
};

const addToShoppingList = async () => {
  try {
    const { error } = await supabase
      .from("shoppingList")
      .insert({ product_id: props.products.id });

    if (error) throw error;

    toast.add({ title: "Ürün Başarıyla Alışveriş Listesine Eklendi." });
    emit("addedToShoppingList");
  } catch (error: any) {
    console.error("Error adding product:", error);
    toast.add({ title: "Failed to adding product." });
  }
};
</script>

<style></style>

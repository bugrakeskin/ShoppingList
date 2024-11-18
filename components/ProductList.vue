<template>
  <div></div>

  <div class="my-4">
    <div>
      <div
        class="md:hover:bg-green-900 p-2 cursor-pointer border-b border-gray-100 dark:border-gray-800"
      >
        <div class="flex space-x-3 items-center justify-between">
          <div
            @click="toast.add({ title: 'Alışveriş Listesine Eklendi' })"
            class="text-xl"
          >
            <span>
              {{ props.products.name }}
            </span>
          </div>
          <div class="flex space-x-2">
            <UBadge
              @click="toast.add({ title: 'Alışveriş Listesine Eklendi' })"
              color="white"
              variant="solid"
            >
              <UIcon class="text-2xl text-green-400" :name="iconType" />
            </UBadge>

            <UBadge color="white" variant="solid">
              <UIcon
                @click="deleteProduct"
                class="text-2xl text-green-400"
                name="i-heroicons-trash"
              />
            </UBadge>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const toast = useToast();
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
const emit = defineEmits(["productDeleted"]);

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
</script>

<style></style>

<template>
  <div>
    <!-- Component Container -->
    <div
      class="border-b border-gray-100 dark:border-gray-800 my-4 flex p-2 items-center text-xl justify-between md:hover:bg-gray-300 md:dark:hover:bg-gray-800"
    >
      <!-- LEFT DIV -->
      <div class="flex space-x-2">
        <UIcon
          class="text-gray-500"
          dark:text-green-400
          :name="iconType"
        ></UIcon>
        <div class="text-gray-800 dark:text-gray-400 leading-6 font-sans">
          {{ props.products.name }}
        </div>
      </div>

      <!-- RIGHT DIV -->
      <div class="flex space-x-4">
        <!-- Add to Shopping List Button -->
        <UButton
          @click="addToShoppingList"
          :icon="buttonIcon"
          size="sm"
          color="primary"
          square
          variant="solid"
        />
        <!-- Delete Product Button -->
        <UButton
          @click="deleteProduct"
          icon="i-heroicons-trash"
          size="sm"
          color="red"
          square
          variant="solid"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Products, ShoppingList } from "~/types/types";

const buttonIcon = ref("carbon:shopping-cart-plus"); // Initial icon for the button

// Props
const props = defineProps({
  products: {
    type: Object as () => Products,
    required: true,
  },
});

// Emits
const emit = defineEmits(["productDeleted", "addedToShoppingList"]);

// Toast for notifications
const toast = useToast();

// Supabase client
const supabase = useSupabaseClient<ShoppingList>();

// Icon Type Computation
const iconType = useIconType(props.products.type);

// Delete Product Function
const deleteProduct = async () => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", props.products.id);

    if (error) throw error;

    toast.add({
      title: "Silme Başaralı",
      description: "Ürün listesinden silindi.",
    });
    emit("productDeleted");
  } catch (error) {
    console.error("Error deleting product:", error);
    toast.add({
      title: "Ürün silinirken hata oluştu.",
      description: "Tekrar deneyiniz.",
      color: "red",
    });
  }
};

// Add to Shopping List Function
const addToShoppingList = async () => {
  try {
    // Alışveriş listesinde ürün var mı diye kontrol et
    const { data, error } = await supabase
      .from("shoppingList")
      .select("id")
      .eq("id", props.products.id)
      .limit(1); // single() kullanmıyoruz çünkü sıfır sonuç dönebilir

    if (error && error.code !== "PGRST116") {
      // Eğer hata başka bir nedenden kaynaklanıyorsa
      throw error;
    }

    if (data && data.length > 0) {
      // Eğer ürün zaten listeye eklenmişse
      toast.add({
        title: "Bu ürün zaten alışveriş listenizde.",
        description: "Tekrar ekleyemezsiniz.",
        color: "yellow",
      });
      return; // Hiçbir işlem yapma, fonksiyondan çık
    }

    // Eğer ürün alışveriş listesinde yoksa, yeni bir ürün ekle
    const { error: insertError } = await supabase.from("shoppingList").insert({
      id: props.products.id,
      name: props.products.name,
      type: props.products.type,
      created_at: new Date().toISOString(),
    });

    // Change the icon to "check" when clicked
    buttonIcon.value = "i-heroicons-check-circle";
    // After a short delay, revert to the original icon
    setTimeout(() => {
      buttonIcon.value = "carbon:shopping-cart-plus";
    }, 3000); // Change back after 2 seconds (2000 ms)

    if (insertError) throw insertError;

    toast.add({
      description: "Ürün alışveriş listesine eklendi.",
      timeout: 2000,
    });
    emit("addedToShoppingList"); // Parent bileşene bildir
  } catch (error) {
    console.error("Error adding product to shopping list:", error);
    toast.add({
      title: "Ürün listeye eklenirken hata oluştu.",
      description: "Lütfen tekrar deneyiniz.",
      color: "red",
    });
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>

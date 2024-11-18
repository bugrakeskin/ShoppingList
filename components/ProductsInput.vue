<template>
  <div class="p-4">
    <h1 class="text-2xl mb-4">Ürün Ekleyin</h1>

    <UForm class="space-y-4" @submit.prevent="addShoppingItem" :state="{}">
      <UFormGroup label="Ürün Adı" name="product">
        <UInput v-model="formData.name" />
      </UFormGroup>

      <UFormGroup label="Ürün Tipi" name="type">
        <USelectMenu
          v-model="formData.type"
          :options="['Yiyecek', 'Temizlik']"
        />
      </UFormGroup>

      <UButton type="submit"> Kaydet </UButton>
    </UForm>
    <!-- Success Message -->
    <p v-if="successMessage" class="mt-4 text-green-600">
      {{ successMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Products } from "~/types/types";
const toast = useToast();
// Shopping List Items
const productlist = ref<Products[]>([]);

// Form Data
const formData = ref({
  name: "",
  type: "",
});

// Success Message
const successMessage = ref("");

// Supabase Client
const supabase = useSupabaseClient<Products>();

// Add Item to Shopping List
const addShoppingItem = async () => {
  try {
    // Insert the form data into the Supabase table
    if (!formData.value.name || !formData.value.type) {
      toast.add({
        title: "Validation Error",
        description: "Please fill in all fields.",
        icon: "i-octicon-desktop-download-24",
        timeout: 3000,
      }); // Use 'error' to style it as an error notification duration: 5000, // Optional: Set duration (ms) });

      return;
    }
    const { data, error } = await supabase.from("products").insert([
      {
        name: formData.value.name,
        type: formData.value.type,
      },
    ]);

    if (error) throw error;

    // Reset the form
    formData.value.name = "";
    formData.value.type = "";

    // Add the new item to the local list
    /*   if (data && Array.isArray(data)) {
      shoppingList.value.push(...data); // Ensure data is iterable
    } */

    // Show success message
    successMessage.value = "Item added successfully!";
  } catch (err: Error | any) {
    toast.add({
      title: "Validation Error",

      timeout: 3000,
    });
  }
};
// Fetch Existing Shopping List Items
const { data, error } = await useAsyncData("products", async () => {
  const { data, error } = await supabase.from("products").select(); // Fetch all items
  if (error) throw new Error(error.message);
  return data;
});

productlist.value = data.value ?? [];
</script>

<style scoped>
/* Add any custom styles */
</style>

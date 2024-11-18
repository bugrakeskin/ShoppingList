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
const emit = defineEmits(["productAdded"]);
// Supabase Client
const supabase = useSupabaseClient<Products>();

// Fetch Existing Shopping List Items
const { data, error } = await useAsyncData("products", async () => {
  const { data, error } = await supabase.from("products").select(); // Fetch all items
  if (error) throw new Error(error.message);
  return data;
});

productlist.value = data.value ?? [];

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
      });

      return;
    }

    // Check if product already exists
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("id")
      .eq("name", formData.value.name)
      .maybeSingle(); // If no rows returned, it'll be null

    if (fetchError) {
      console.error("Error checking for existing product:", fetchError);
      toast.add({
        title: "Error",
        description: "Error checking for existing product.",
        timeout: 3000,
      });
      return;
    }

    if (existingProduct) {
      toast.add({
        title: "Var olan ürün kaydı tespit edildi.",
        description: `"${formData.value.name}" önceden listeye eklenmiştir.`,
        timeout: 3000,
      });
      return;
    }

    // Insert the new product into the database
    const { data, error } = await supabase.from("products").insert([
      {
        name: formData.value.name,
        type: formData.value.type,
      },
    ]);

    if (error) throw error;

    // Clear form fields after successful insert
    formData.value.name = "";
    formData.value.type = "";

    // Show success message
    /*   successMessage.value = "Ürün Başarıyla Eklendi!"; */
    toast.add({
      title: "Kayıt başarılı!",
      description: "Ürün Başarıyla Eklendi!",
      timeout: 3000,
    });
    emit("productAdded");
    // Fetch the updated product list after the insert to reflect the new product
    const { data: updatedProducts, error: fetchUpdatedError } = await supabase
      .from("products")
      .select(); // Get all products again

    if (fetchUpdatedError) {
      console.error("Error fetching updated product list:", fetchUpdatedError);
      toast.add({
        title: "Error",
        description: "An error occurred while updating the product list.",
        timeout: 3000,
      });
      return;
    }

    // Update local state with the new product list
    productlist.value = updatedProducts ?? [];
  } catch (err: any) {
    console.error("Error adding product:", err);
    toast.add({
      title: "Error",
      description: "An error occurred while adding the product.",
      timeout: 3000,
    });
  }
};
</script>

<style scoped>
/* Add any custom styles */
</style>

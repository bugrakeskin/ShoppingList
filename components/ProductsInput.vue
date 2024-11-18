<template>
  <div class="p-4">
    <h1 class="text-2xl mb-4 text-green-600 dark:text-green-300">
      Ürün Ekleyin
    </h1>

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
  </div>
</template>

<script setup lang="ts">
import type { Products } from "~/types/types";
const toast = useToast();

// Form Data
const formData = ref({
  name: "",
  type: "",
});

// Supabase Client
const supabase = useSupabaseClient<Products>();

// "Ürün Eklendi" olayını yakalamak için emit tanımlandı
const emit = defineEmits(["productAdded"]);

// Ürün ekleme işlemi
const addShoppingItem = async () => {
  try {
    // Boş alanları kontrol et
    if (!formData.value.name || !formData.value.type) {
      toast.add({
        title: "Eksik Alan",
        description: "Lütfen tüm alanları doldurun.",
        icon: "i-heroicons-exclamation-circle",
        timeout: 3000,
      });
      return;
    }

    // Ürünün zaten var olup olmadığını manuel kontrol et
    const { data: existingProduct, error: fetchError } = await supabase
      .from("products")
      .select("id")
      .eq("name", formData.value.name)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 "kayıt bulunamadı" anlamına gelir, hata değil
      throw fetchError;
    }

    if (existingProduct) {
      toast.add({
        title: "Ürün Zaten Mevcut",
        description: `"${formData.value.name}" daha önce eklenmiş.`,
        timeout: 3000,
      });
      return;
    }

    // Ürün yoksa ekle
    const { error } = await supabase.from("products").insert([
      {
        name: formData.value.name,
        type: formData.value.type,
      },
    ]);

    if (error) {
      throw error; // Herhangi bir hata durumunda hata fırlat
    }

    // Form alanlarını temizle
    formData.value.name = "";
    formData.value.type = "";

    // Başarılı mesajı
    toast.add({
      title: "Ürün Eklendi",
      description: "Ürün başarıyla listeye eklendi!",
      timeout: 3000,
    });

    // Ürün eklendi olayını gönder
    emit("productAdded");
  } catch (err: any) {
    console.error("Ürün ekleme hatası:", err);
    toast.add({
      title: "Hata",
      description: "Ürün eklenirken bir hata oluştu: " + err.message,
      timeout: 3000,
    });
  }
};
</script>

<style scoped>
/* Add any custom styles */
</style>

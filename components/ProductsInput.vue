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

      <UButton block type="submit"> Kaydet </UButton>
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

// Yardımcı Fonksiyon: Her kelimenin baş harfini büyüt (Türkçe desteği ile)
const capitalizeWords = (str: string): string => {
  const turkishCharMap: Record<string, string> = {
    ı: "I",
    i: "İ",
    ş: "Ş",
    ç: "Ç",
    ü: "Ü",
    ö: "Ö",
    ğ: "Ğ",
  };

  return str
    .split(" ")
    .map((word) => {
      const firstChar = word[0]?.toLocaleUpperCase("tr") || "";
      const rest = word.slice(1).toLocaleLowerCase("tr");

      // Türkçe özel harfleri kontrol et ve dönüştür
      const correctedFirstChar =
        firstChar.toLocaleLowerCase("tr") in turkishCharMap
          ? turkishCharMap[firstChar.toLocaleLowerCase("tr")]
          : firstChar;

      return correctedFirstChar + rest;
    })
    .join(" ");
};

// Ürün ekleme işlemi
const addShoppingItem = async () => {
  try {
    // Boş alanları kontrol et
    if (!formData.value.name || !formData.value.type) {
      toast.add({
        title: "Eksik Alan",
        description: "Lütfen tüm alanları doldurun.",
        color: "red",
      });
      return;
    }

    // Ürünün adını düzenle
    formData.value.name = capitalizeWords(formData.value.name);

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
        color: "yellow",
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
    });

    // Ürün eklendi olayını gönder
    emit("productAdded");
  } catch (err: any) {
    console.error("Ürün ekleme hatası:", err);
    toast.add({
      title: "Hata",
      description: "Ürün eklenirken bir hata oluştu: " + err.message,
      color: "red",
    });
  }
};
</script>

<style scoped>
/* Add any custom styles */
</style>

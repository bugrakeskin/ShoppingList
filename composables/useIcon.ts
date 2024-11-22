/* import { computed, ref } from "vue";

export function useIconType(productType: string | undefined | null) {
  const type = ref(productType); // Reactive state
  const icon = computed(() => {
    if (type.value === "Yiyecek") {
      return "fluent:food-48-regular";
    } else if (type.value === "Temizlik") {
      return "carbon:clean";
    } else if (type.value === "Kişisel Bakım") {
      return "covid:personal-hygiene-hand-soap-1";
    } else {
      return "i-heroicons-arrow-down-tray";
    }
  });

  return { type, icon };
}
 */

export const useIcon = () => {
  const getIconForType = (type: string) => {
    switch (type) {
      case "Yiyecek":
        return "fluent:food-48-regular"; // NuxtUI icon class ya da kendi özel iconlarınız
      case "Temizlik":
        return "carbon:clean";
      case "Kişisel Bakım":
        return "covid:personal-hygiene-hand-soap-1";
      default:
        return "i-heroicons-arrow-down-tray";
    }
  };

  return { getIconForType };
};

export function useIconType(productType: string) {
  return computed(() => {
    if (productType === "Yiyecek") {
      return "fluent:food-48-regular";
    } else if (productType === "Temizlik") {
      return "carbon:clean";
    } else if (productType === "Kişisel Bakım") {
      return "covid:personal-hygiene-hand-soap-1";
    } else {
      return "i-heroicons-arrow-down-tray";
    }
  });
}

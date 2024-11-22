import type { ShoppingList } from "~~/types/types";
export function useWhenAddedCalculate(items: ShoppingList[]) {
  const processedItems = computed(() =>
    items.map((item) => {
      const today = new Date();
      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const createdDate = new Date(
        new Date(item.created_at).getFullYear(),
        new Date(item.created_at).getMonth(),
        new Date(item.created_at).getDate()
      );

      const whenAdded =
        todayDate.getTime() === createdDate.getTime()
          ? "Bugün"
          : `${Math.ceil(
              (todayDate.getTime() - createdDate.getTime()) /
                (1000 * 60 * 60 * 24)
            )} gün önce`;

      return { ...item, whenAdded }; // ShoppingList yapısına "whenAdded" ekleniyor
    })
  );

  return {
    processedItems,
  };
}

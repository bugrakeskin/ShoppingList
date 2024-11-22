export function useWhenAddedCalculate(createdAt: string | Date) {
  const calculateDate = computed(() => {
    const today = new Date();
    const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const createdDate = new Date(
      new Date(createdAt).getFullYear(),
      new Date(createdAt).getMonth(),
      new Date(createdAt).getDate()
    );

    if (todayDate.getTime() === createdDate.getTime()) {
      return "Bugün";
    }

    const diffTime = todayDate.getTime() - createdDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return `${diffDays} gün önce`;
  });

  return {
    calculateDate,
  };
}

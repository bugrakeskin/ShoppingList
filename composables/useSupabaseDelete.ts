// useSupabaseDelete.ts

export const useSupabaseDelete = async (
  tableName: string,
  id: number
): Promise<{ success: boolean; error: string | null }> => {
  const client = useSupabaseClient(); // Supabase client
  const toast = useToast(); // Toast for error handling
  const success = ref(false);

  try {
    const { error } = await client.from(tableName).delete().eq("id", id);

    if (error) {
      toast.add({
        title: "Error deleting data",
        description: `Error: ${error.message}`,
      });
      return { success: false, error: error.message };
    }

    success.value = true;
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Error deleting Supabase data:", error.message);
    toast.add({
      title: "Unexpected Error",
      description: `Error: ${error.message}`,
    });
    return { success: false, error: error.message };
  }
};

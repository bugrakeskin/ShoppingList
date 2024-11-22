export const useSupabaseData = async <T>(
  tableName: string,
  queryOptions?: {
    select?: string;
    filters?: Array<{ column: string; operator: string; value: any }>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number; // Yeni limit parametresi
  }
): Promise<{ data: T[] | null; error: string | null; loading: boolean }> => {
  const client = useSupabaseClient(); // Supabase client
  const toast = useToast(); // Toast for error handling
  const loading = ref(true);

  try {
    let query = client.from(tableName).select(queryOptions?.select || "*");

    // Apply filters
    if (queryOptions?.filters) {
      queryOptions.filters.forEach((filter) => {
        query = query.eq(filter.column, filter.value);
      });
    }

    // Apply order
    if (queryOptions?.orderBy) {
      query = query.order(queryOptions.orderBy.column, {
        ascending: queryOptions.orderBy.ascending ?? true,
      });
    }

    // Apply limit if provided
    if (queryOptions?.limit) {
      query = query.limit(queryOptions.limit);
    }

    const { data, error } = await query;

    if (error) {
      toast.add({
        title: "Error fetching data",
        description: `Error: ${error.message}`,
      });
      return { data: null, error: error.message, loading: false };
    }

    return { data: data as T[], error: null, loading: false };
  } catch (error: any) {
    console.error("Error fetching Supabase data:", error.message);
    toast.add({
      title: "Unexpected Error",
      description: `Error: ${error.message}`,
    });
    return { data: null, error: error.message, loading: false };
  }
};

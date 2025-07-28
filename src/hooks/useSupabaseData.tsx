import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

function useSupabaseData<T>(tableName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: result, error: fetchError } = await supabase
        .from(tableName)
        .select('*');

      if (fetchError) {
        setError(fetchError);
      } else {
        setData(result as T[]);
      }
      setLoading(false);
    };

    fetchData();
  }, [tableName]);

  return { data, loading, error };
}

export default useSupabaseData;

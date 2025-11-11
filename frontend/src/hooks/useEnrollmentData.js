import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

export const useEnrollmentData = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: fetchedData, error: fetchError } = await supabase
        .from("enrolled")
        .select("*")
        .order("Year");
      
      if (fetchError) throw fetchError;
      
      setData(fetchedData || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscription
    const channel = supabase
      .channel("realtime-enrollments")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "enrolled" },
        () => {
          console.log("Data changed, refetching...");
          fetchData();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { 
    data, 
    isLoading, 
    error, 
    refetch: fetchData 
  };
};

export default useEnrollmentData;
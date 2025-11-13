// import { useState, useEffect } from 'react';
// import { supabase } from '../config/supabase';

// export const useGraduateData = () => {
//   const [data, setData] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchData = async () => {
//     setIsLoading(true);
//     setError(null);
    
//     try {
//       const { data: fetchedData, error: fetchError } = await supabase
//         .from("graduate")
//         .select("*")
//         .order("Year");
      
//       if (fetchError) throw fetchError;
      
//       setData(fetchedData || []);
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching graduate data:", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();

//     // Set up real-time subscription
//     const channel = supabase
//       .channel("realtime-graduates")
//       .on(
//         "postgres_changes",
//         { event: "*", schema: "public", table: "graduate" },
//         () => {
//           console.log("Graduate data changed, refetching...");
//           fetchData();
//         }
//       )
//       .subscribe();

//     // Cleanup subscription on unmount
//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, []);

//   return { 
//     data, 
//     isLoading, 
//     error, 
//     refetch: fetchData 
//   };
// };

// export default useGraduateData;

import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

export const useGraduateData = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Replace with the exact table name and columns in your Supabase DB
      const { data: fetchedData, error: fetchError } = await supabase
        .from("graduate") // <-- exact table name
        .select("*")
        .order("year", { ascending: true });

      if (fetchError) throw fetchError;

      if (!fetchedData || fetchedData.length === 0) {
        console.warn("Graduate table returned no data");
      } else {
        console.log("Fetched graduate data:", fetchedData);
      }

      setData(fetchedData || []);
    } catch (err) {
      setError(err.message || "Error fetching graduate data");
      console.error("Error fetching graduate data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Real-time subscription (optional)
const channel = supabase
  .channel("realtime-graduates")

  // Trigger on new rows
  .on(
    "postgres_changes",
    { event: "INSERT", schema: "public", table: "graduate" },
    (payload) => {
      console.log("New graduate inserted:", payload);
      fetchData();
    }
  )

  // Trigger on updates
  .on(
    "postgres_changes",
    { event: "UPDATE", schema: "public", table: "graduate" },
    (payload) => {
      console.log("Graduate updated:", payload);
      fetchData();
    }
  )

  // Trigger on deletions
  .on(
    "postgres_changes",
    { event: "DELETE", schema: "public", table: "graduate" },
    (payload) => {
      console.log("Graduate deleted:", payload);
      fetchData();
    }
  )

  .subscribe();

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

export default useGraduateData;

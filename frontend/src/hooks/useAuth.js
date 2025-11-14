import { useState } from "react";
import { supabase } from "../config/supabase"; // adjust your path

export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const loginUser = async (email, password) => {
    setLoading(true);

    // 1️⃣ Sign in with Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setLoading(false);
      return { error: "Invalid email or password" };
    }

    // 2️⃣ Lookup user details in your own `users` table
    const { data: userRecord, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    setLoading(false);

    if (userError || !userRecord) {
      return { error: "No matched user record in database" };
    }

    return { user: userRecord }; // success
  };

  const logoutUser = async () => {
    await supabase.auth.signOut();
  };

  return { loginUser, logoutUser, loading };
};

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl); // 👀 debug line
console.log('Supabase Key:', supabaseAnonKey ? '✅ Loaded' : '❌ Missing');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

// Supabase client'ı güvenli şekilde başlat
try {
  if (supabaseUrl && supabaseAnonKey && 
      supabaseUrl !== 'your-supabase-url' && 
      supabaseAnonKey !== 'your-supabase-anon-key') {
    
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
    
    console.log('✅ Supabase connected successfully');
  } else {
    console.log('⚠️ Supabase environment variables not configured, using demo mode');
  }
} catch (error) {
  console.error('❌ Supabase initialization error:', error);
  supabase = null;
}

export { supabase };

export const isSupabaseAvailable = () => {
  return supabase !== null;
};
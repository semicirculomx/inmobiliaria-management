import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Client = {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
};

export type Budget = {
  id: string;
  client_id: string;
  title: string;
  pdf_url: string;
  created_at: string;
};

export type Contract = {
  id: string;
  client_id: string;
  title: string;
  pdf_url: string;
  created_at: string;
};

export type Plan = {
  id: string;
  client_id: string;
  title: string;
  pdf_url: string;
  created_at: string;
};

export type ProjectPhoto = {
  id: string;
  client_id: string;
  image_url: string;
  description: string;
  created_at: string;
};

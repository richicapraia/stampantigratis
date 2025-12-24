import "server-only";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createServerComponentClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseEnv() {
  return { supabaseUrl, supabaseAnonKey };
}

export async function createServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables.");
  }
  return createServerComponentClient({
    cookies: async () => await cookies(),
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  });
}

export async function createApiClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables.");
  }
  return createRouteHandlerClient({
    cookies: async () => await cookies(),
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  });
}

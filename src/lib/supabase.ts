import "server-only";
import { cookies, headers } from "next/headers";
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
  const cookieStore = await cookies();
  const headerStore = await headers();
  return createServerComponentClient({
    cookies: () => cookieStore,
    headers: () => headerStore,
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  });
}

export async function createApiClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables.");
  }
  const cookieStore = await cookies();
  const headerStore = await headers();
  return createRouteHandlerClient({
    cookies: () => cookieStore,
    headers: () => headerStore,
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
  });
}

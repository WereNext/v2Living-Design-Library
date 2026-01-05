/**
 * Supabase Client Configuration
 *
 * This module initializes the Supabase client for authentication and database access.
 * The client handles missing credentials gracefully, falling back to local-only mode.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Environment variables (Vite exposes these via import.meta.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Validate configuration
const isConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isConfigured) {
  console.info(
    '[Supabase] Credentials not configured. Running in local-only mode. ' +
    'To enable cloud sync, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

// Create Supabase client (or null if not configured)
export const supabase: SupabaseClient<Database> | null = isConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Store session in localStorage under a unique key
        storageKey: 'ldl-auth-session',
      },
      // Global options
      global: {
        headers: {
          'x-client-info': 'living-design-library',
        },
      },
    })
  : null;

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return isConfigured;
}

/**
 * Get the Supabase client, throwing if not configured
 * Use this when you need to ensure Supabase is available
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.'
    );
  }
  return supabase;
}

/**
 * Helper to handle Supabase errors consistently
 */
export function handleSupabaseError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return new Error(String((error as { message: unknown }).message));
  }
  return new Error('An unknown error occurred');
}

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Check if a slug is available (not already taken)
 */
export async function isSlugAvailable(
  table: 'design_systems' | 'ldl_documents',
  slug: string
): Promise<boolean> {
  if (!supabase) return true; // If not configured, assume available

  const { data, error } = await supabase
    .from(table)
    .select('id')
    .eq('share_slug', slug)
    .maybeSingle();

  if (error) {
    console.error('Error checking slug availability:', error);
    return false;
  }

  return data === null;
}

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const hasValidConfig = supabaseUrl && supabaseKey && supabaseUrl.startsWith("https://");

export const supabase = hasValidConfig
	? createClient(supabaseUrl, supabaseKey)
	: null;

export function isReady(): boolean {
	return hasValidConfig === true;
}

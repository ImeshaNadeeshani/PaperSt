import { createClient } from "@supabase/supabase-js";
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key?.startsWith("sb_publishable_")) throw new Error("Missing project URL or publishable key.");
const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const { count, error } = await client.from("products").select("id", { count: "exact", head: true }).eq("status", "Active").abortSignal(AbortSignal.timeout(15000));
if (error) { console.error("Supabase product read failed:", error.message); process.exitCode = 1; }
else console.log(`Supabase read verified: ${count} published products.`);

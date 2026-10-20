# Supabase setup

The client is configured in `src/lib/supabaseClient.js`; `.env.local` is ignored by Git.

1. In the PaperSt Supabase project, open SQL Editor and run `migrations/001_store_foundation.sql` once.
2. Run `seed-products.sql` to import the site's demo catalog, including sample prices and stock.
3. Restart Vite after changing environment values.

The storefront now reads published products from Supabase when configured. Top-level database prices and stock override the legacy JSON details. Loading errors show a retry state; an empty database stays empty. Admin product editing and stock updates remain local demos, clearly labelled, and do not modify the live catalog. Orders and checkout also remain local. The next integration must connect Supabase Auth, enforce server-side admin permissions, and create transactional checkout with server-calculated prices and inventory.

Verify public catalog access with `node --env-file=.env.local scripts/check-supabase.mjs`. Restart Vite to load environment changes. Without Supabase configuration, the app retains its original local demo mode.

Products are publicly readable only when Active. Customer profiles and addresses are private to their owners. Orders and shipments are owner-readable; writes require trusted backend functions. Never put a secret/service-role key in frontend environment variables. SQL setup and policy behaviour must be verified against the live database before launch.

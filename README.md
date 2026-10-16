# Paperist · Phase 1

A responsive stationery storefront and a separate admin workspace built with React, Vite, JavaScript, React Router, Tailwind CSS 4, and Lucide icons. The homepage follows the supplied UI3 reference with manga artwork, brush headings, paper textures, polaroid category cards, a shop-by-price banner, and compact promotions. It uses navy, warm paper colours, and red details with DM Sans, Caveat, and Permanent Marker typography. The supplied study illustration is bundled at `public/images/paperist-hero.png`. Generated category/campaign illustrations and their exact prompts are documented in [public/images/ARTWORK.md](public/images/ARTWORK.md).

## Run locally

```sh
npm install
npm run dev -- --host 127.0.0.1
```

Store: http://localhost:5173/ · Admin: http://localhost:5173/admin

```sh
npm run build
npm run lint
npx playwright install chromium
npx playwright test
```

The browser tests check all 65 sample routes at desktop (1440px), tablet (820px), and mobile (390px), console errors, horizontal overflow, cart and wishlist persistence, checkout, product creation, order status, CMS edits, and mobile menus/filters. Screenshots are saved under `artifacts/`. Tests assume the development server is already running.

## Complete route list

| Area                 | Routes                                                                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Store                | `/`, `/shop`, `/category/:slug`, `/back-to-school`, `/product/:slug`, `/search?q=…`, `/wishlist`, `/cart`                                                          |
| Collections          | `/brands`, `/new-arrivals`, `/best-sellers`, `/sale`, `/gifts`                                                                                                     |
| Checkout             | `/checkout`, `/order-success`, `/track-order`                                                                                                                      |
| Sign in              | `/login`, `/register`, `/forgot-password`                                                                                                                          |
| Customer account     | `/account`, `/account/orders`, `/account/orders/:id`, `/account/wishlist`, `/account/addresses`, `/account/profile`, `/account/password`, `/account/notifications` |
| Information          | `/about`, `/contact`, `/faq`, `/delivery`, `/returns`, `/privacy`, `/terms`, `/blog`                                                                               |
| Business             | `/corporate`                                                                                                                                                       |
| Admin sign in        | `/admin/login` (no sidebar)                                                                                                                                        |
| Admin overview       | `/admin`                                                                                                                                                           |
| Catalogue management | `/admin/products`, `/admin/products/new`, `/admin/products/:id/edit`, `/admin/categories`, `/admin/brands`, `/admin/inventory`                                     |
| Order management     | `/admin/orders`, `/admin/orders/:id`                                                                                                                               |
| Customers            | `/admin/customers`, `/admin/customers/:id`                                                                                                                         |
| Marketing & requests | `/admin/coupons`, `/admin/reviews`, `/admin/corporate-orders`, `/admin/corporate-orders/:id`                                                                       |
| Content              | `/admin/content`, `/admin/banners`                                                                                                                                 |
| Administration       | `/admin/reports`, `/admin/users`, `/admin/settings`                                                                                                                |
| Missing pages        | `*`, `/admin/*` render a 404 state                                                                                                                                 |

Category samples: `school`, `office`, `paper`, `books`, `art`, `journals`, `gifts`, `accessories`, `notebooks`, `pens`, `planners`, `art-supplies`, `desk-organisers`.

## Structure and reusable components

```text
src/
  assets/                   Replaceable asset directory
  components/
    common/UI.jsx           Buttons, fields, modal, breadcrumb, ratings,
                            quantity, empty state, skeleton, status
    common/AdminUI.jsx      Admin heading, shared tables, sales chart
    layout/HomeSections.jsx HeroBanner, CategoryCard, ProductCollection,
                            PromoBanner, BudgetBanner
    product/ProductCard.jsx Product cards and grids
  layouts/                  StoreLayout, AccountLayout, AdminLayout
  pages/
    store/                  Home, catalogue, product, bag, information
    checkout/               Three-step checkout, success, tracking
    account/                Demo sign-in and customer account screens
    admin/                  Dashboard and all management screens
  context/                  Shared storefront/admin state provider
  data/                     24 products, customers, orders, RFQs
  hooks/                    Local persistence and shared context access
  routes/AppRoutes.jsx      Complete route configuration
  services/                 API adapter boundary for Phase 2
  utils/                    CSV export
  styles.css                Tailwind entry and responsive brand styles
  home.css                  Scoped UI3 editorial homepage styles
public/images/              Bundled homepage illustration
tests/                      Browser regression and visual capture checks
```

The sticky store header includes category dropdowns, product search, account, wishlist, and quantity-aware bag controls. Mobile adds a menu and filter drawer. Newsletter, trust badges, footer, tables, forms, and layouts are shared. Admin has its own responsive sidebar, search, notifications, profile, and dashboard visual style.

## Installed packages

Runtime: `react`, `react-dom`, `react-router-dom`, `lucide-react`, `tailwindcss`, `@tailwindcss/vite`.

Development: `vite`, `@vitejs/plugin-react`, React type definitions, `oxlint`, `prettier`, `@playwright/test`. Chromium is used for local browser verification.

## Working local interactions

- Product search across name/category/brand; category, subcategory, brand, price, colour, size, paper, rating, and availability filters; sorting and pagination.
- Image galleries, variant selection, quantity limits, wishlist toggles, and recently viewed products.
- Add/remove bag items, quantity updates, delivery progress, and the demo coupon `PAPER10`.
- Three-step delivery/payment selection and a demo order saved to the shared admin/customer order data. No card details are collected.
- Tracking with an order number and matching email/mobile. Try `PPR-1042` and `amaya@example.com`.
- Customer profile, addresses, defaults, notification preferences, password validation, order detail, print invoice, and reorder.
- Admin product creation/editing, drafts, preview, publish, duplicate/archive, local image uploads, variants, filters, and inventory adjustment history.
- Order status changes, internal notes, customer notes, coupon/category/brand/banner forms, review moderation/replies, RFQ quote/status controls, and mock role permissions.
- Homepage section visibility and order, headings/subtitles/CTAs, hero/promo image URLs, and selection of featured products using comma-separated product IDs.
- CSV reports and browser print/PDF. Excel export is a visible mock action.

State is persisted under `paperist-*` localStorage keys. Demo sign-in and checkout selection use sessionStorage. Clearing site storage resets the fixtures. Admin is deliberately accessible in the prototype: demo sign-in and role toggles are UI simulations.

## Mock boundaries

No backend, live authentication, real payments, message delivery, email recovery, carrier integration, or real fulfilment exists. Contact/newsletter actions show demo confirmations. Product photography is replaceable stock imagery and is illustrative, rather than an exact photograph of each SKU. Google Fonts and stock imagery need internet access; the supplied hero is local.

Dashboard trends, category shares, reward points, and historical customer aggregates are mock values. Report date selectors and Excel export are previews. Settings, banners, brands, categories, and permissions are saved as management previews; runtime pricing/shipping and catalogue taxonomy still use the local fixtures. Homepage hero, content visibility/order, headings, CTA links, selected collections, and promotional imagery are connected to the storefront.

## Phase 2

1. Add API clients under `services/`, server persistence, schema validation, image hosting, and server-managed catalogue/variants.
2. Add customer/admin authentication, password recovery, sessions, and enforced role permissions.
3. Calculate prices, coupons, delivery fees, taxes, stock reservation, and order totals on the server.
4. Connect Sri Lankan payment options, webhook verification, refunds, and fulfilment/tracking.
5. Connect CMS/media, all catalogue taxonomy, coupons, settings, and RFQ messaging to the live store.
6. Add transactional email/SMS, customer notifications, actual reports, and workbook exports.
7. Replace placeholder product imagery and store/legal copy, then validate security, accessibility, performance, and deployment configuration before launch.

Static hosting must rewrite unknown paths to `index.html` so direct React Router links work.

# Skincare & Beauty Shop — Frontend

React (Vite) storefront for a full-featured MERN e-commerce platform: product browsing/search, cart, checkout, order history, reviews, wishlist, an AI shopping concierge, and a full admin dashboard.

Backend repo: [E-Commerce-Platform-using-Mern](https://github.com/AshanOdi/E-Commerce-Platform-using-Mern)

## Tech stack

- **React 19** + **Vite 7**
- **react-router-dom v7** for routing
- **Tailwind CSS v4** + **shadcn/ui** components (Radix primitives) for UI
- **axios** for API calls, **react-hot-toast** for notifications
- Client-side state via React Context: `AuthContext`, `CartContext`, `WishlistContext`, `ThemeContext` (light/dark mode)
- **Supabase Storage** (via `@supabase/supabase-js`) purely for hosting uploaded image files — not used as a database

## Getting started

```bash
npm install
cp .env.example .env   # then set VITE_BACKEND_URL, see below
npm run dev             # starts Vite dev server at http://localhost:5173
```

**Always open the dev server at `http://localhost:5173`, not `127.0.0.1:5173`** — the backend's CORS is locked to that exact origin.

Other scripts: `npm run build` (production build), `npm run preview` (preview a production build locally), `npm run lint`.

## Environment variables

See [.env.example](.env.example). Just one variable:

| Variable | Purpose |
|---|---|
| `VITE_BACKEND_URL` | The backend API's base URL (e.g. `http://localhost:5000` locally, or your Render URL in production) |

Vite bakes `VITE_` variables into the build at **build time**, not runtime — on Vercel this must be set in the project's Environment Variables *before* the first deploy, and changing it later requires a redeploy.

## Demo / test accounts

All seeded accounts share the password **`Test1234`**:

| Email | Role |
|---|---|
| `ashan@gmail.com` | admin — see the full dashboard at `/admin` |
| `akasha@gmail.com` | customer |
| `ashan1@gmail.com` | customer |
| `disna@gmail.com` | customer |

## Features / routes

**Customer-facing** (all under the shared header/footer layout):
- `/` — landing page
- `/product`, `/product/:productId` — catalog with search, price filter, sort, pagination, and product detail with reviews
- `/cart` — persistent cart (works for guests too), with live re-validation against the real catalog (flags items that went out of stock or were removed since being added)
- `/checkout`, `/pay/:intentId` — checkout and mock payment flow (requires login)
- `/my-orders`, `/my-orders/:orderId` — order history (requires login)
- `/wishlist` — save products for later (requires login)
- `/profile` — edit your own name/phone/address/photo (requires login)
- `/about`, `/contact` — static/contact-form pages
- `/concierge` — AI Beauty & Style Concierge: describe what you need and get real, in-stock product recommendations
- `/login`, `/register`

**Admin dashboard** (`/admin/*`, requires an admin account):
- `/admin/products` — product CRUD, image upload
- `/admin/users` — block/unblock, promote/demote
- `/admin/orders`, `/admin/orders/:orderId` — order management, status transitions
- `/admin/reviews` — not built yet (placeholder page)

## Known limitations

- Image uploads depend on a working Supabase Storage project (`src/utils/mediaUpload.jsx`) — if that project isn't configured, product/profile images will fail to upload or display.
- No automated test suite yet (planned).
- `/admin/reviews` has no moderation UI built yet — reviews are visible on product pages but can't be moderated from the admin dashboard.

## Deployment

Deploys to **Vercel** as a static Vite build. [vercel.json](vercel.json) adds the SPA rewrite rule client-side routing needs (`react-router-dom`'s `BrowserRouter` requires every path to serve `index.html`, or deep links 404 on a static host).

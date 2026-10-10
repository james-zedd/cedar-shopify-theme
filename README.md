# Cedar — Headless Shopify Storefront

Cedar is a headless Shopify storefront built with Next.js (App Router), TypeScript and the Shopify Storefront API. It replaces a Liquid theme with a React front end: product data comes from Shopify over GraphQL, pages are server-rendered by Next.js, and checkout goes to Shopify's hosted checkout.

> **Status:** in active development. The [roadmap](#roadmap) below shows what is finished and what is in progress.

## Features

### Shopping experience
- **Home page** with a featured collection grid
- **Collection pages** (`/collections/[handle]`) with cursor-based pagination and an in-stock / out-of-stock filter
- **Product detail pages** (`/products/[handle]`) with an image gallery, variant selection (size, colour and other options), price display and add to cart
- **Cart drawer** with line items, quantity controls, item removal, a live subtotal and a checkout button that hands off to Shopify's hosted checkout
- **Responsive layout**, with a header, mobile navigation, a cart count badge and a footer

### Engineering
- **Server-side rendering** of product and collection pages, so crawlers receive fully rendered HTML
- **Typed GraphQL queries** against the Shopify Storefront API, kept in `src/lib/queries/`
- **[`@shopify/hydrogen-react`](https://shopify.dev/docs/api/hydrogen-react)** components and providers (`ShopifyProvider`, `CartProvider`, `Money`, `Image`, `AddToCartButton`) for cart state and money and image handling
- **SEO and performance**: per-page metadata and Open Graph tags through the Next.js Metadata API, optimised images, and a Lighthouse / Core Web Vitals pass
- **Loading skeletons and error boundaries** for slow or failed queries

### Testing
- **Unit and component tests** with [Vitest](https://vitest.dev) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), covering components, cart logic and utility functions
- **End-to-end tests** with [Playwright](https://playwright.dev) covering two flows: browsing to the cart, and going from the cart to checkout

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router), [React 19](https://react.dev) |
| Language | [TypeScript](https://www.typescriptlang.org) |
| Commerce | [Shopify Storefront API](https://shopify.dev/docs/api/storefront) (GraphQL), [`@shopify/hydrogen-react`](https://shopify.dev/docs/api/hydrogen-react) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Testing | [Vitest](https://vitest.dev), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), [Playwright](https://playwright.dev) |
| Hosting | [Vercel](https://vercel.com) |

## Roadmap

| Feature | Status |
| --- | --- |
| Project scaffold, Storefront API connection, Vitest setup | ✅ Done |
| Home page with featured collection grid | ✅ Done |
| Collection pages with pagination and availability filter | ✅ Done |
| Product detail page with variants and add to cart | ✅ Done |
| Cart drawer and Shopify checkout | 🚧 In progress |
| Navigation and layout | Planned |
| SEO, performance and design polish | Planned |
| Playwright end-to-end tests | Planned |
| Production deploy on Vercel | Planned |

## Running locally

**Prerequisites:** Node.js 22 (see `.nvmrc`), plus a Shopify store with a Storefront API access token.

```bash
git clone git@github.com:james-zedd/cedar-shopify-theme.git
cd cedar-shopify-theme
npm install
```

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_STOREFRONT_ACCESS_TOKEN=your-public-storefront-token
```

Start the dev server and open [http://localhost:3000](http://localhost:3000):

```bash
npm run dev
```

## Running tests

```bash
npm test
```

## Project structure

```
src/
├── app/            # Next.js App Router routes (home, collections, products)
├── components/     # UI components, with tests in __tests__/
├── lib/
│   ├── queries/    # Storefront API GraphQL queries
│   └── shopify.ts  # Storefront API fetch helper
└── providers/      # Client-side Shopify providers
```

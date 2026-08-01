# Oscar Gold Store — Frontend

The black/white/gold marketplace UI, connected to the real backend API. Cart, wishlist,
checkout, reviews, and the seller/admin dashboards all read and write real data.

## Run it

```bash
npm install
cp .env.example .env
npm run dev
```

Opens at `http://localhost:3000`. Make sure `VITE_API_URL` in `.env` points to your live
backend.

## Demo accounts (after seeding the backend)

| Role | Email | Password |
|---|---|---|
| Buyer | amara@example.com | BuyerPass123! |
| Seller | seller@maisonrho.com | SellerPass123! |
| Admin | admin@oscargold.store | AdminPass123! |

## Still a stub

Card payments create a real Stripe PaymentIntent on the backend, but this frontend doesn't
yet load Stripe.js/Elements to actually collect and confirm the card number. Bank and mobile
payments stay "pending" until an admin manually confirms them.

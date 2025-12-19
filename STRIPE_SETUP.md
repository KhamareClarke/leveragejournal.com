# Stripe Payment Integration Setup

This guide will help you set up Stripe payment integration for the Leverage Journal purchase.

## Prerequisites

1. A Stripe account (sign up at https://stripe.com)
2. Access to your Stripe Dashboard

## Setup Steps

### 1. Get Your Stripe API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_` for test mode or `pk_live_` for live mode)
4. Copy your **Secret key** (starts with `sk_test_` for test mode or `sk_live_` for live mode)
   - Click "Reveal test key" to see it

### 2. Configure Environment Variables

Create a `.env.local` file in the root of your project (if it doesn't exist) and add:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# App URL (for Stripe redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**For Production:**
- Replace `sk_test_` with `sk_live_` for your live secret key
- Replace `pk_test_` with `pk_live_` for your live publishable key
- Update `NEXT_PUBLIC_APP_URL` to your production domain (e.g., `https://leveragejournal.com`)

### 3. Create a Product in Stripe (Optional)

You can create a product in Stripe Dashboard, but the current implementation uses dynamic price creation. The product is created on-the-fly with:
- **Name**: Leverage Journal - First Edition A5
- **Price**: £19.99 (1999 pence)
- **Currency**: GBP

### 4. Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the homepage and click any "Order Now", "Get The Journal", or "Add to Cart" button

3. You'll be redirected to Stripe Checkout

4. Use Stripe test cards:
   - **Success**: `4242 4242 4242 4242`
   - **Decline**: `4000 0000 0000 0002`
   - Use any future expiry date, any CVC, and any postal code

### 5. Webhook Setup (Optional - for order fulfillment)

If you want to handle successful payments server-side (e.g., send confirmation emails, update database), set up webhooks:

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set the endpoint URL to: `https://yourdomain.com/api/webhooks/stripe`
4. Select events: `checkout.session.completed`
5. Copy the webhook signing secret

Add to your `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Payment Flow

1. User clicks a payment button on the homepage
2. Frontend calls `/api/checkout` with user info (if logged in)
3. Backend creates a Stripe Checkout Session
4. User is redirected to Stripe Checkout
5. After payment:
   - **Success**: Redirected to `/checkout/success`
   - **Cancel**: Redirected to `/checkout/cancel`

## Files Modified/Created

- `app/api/checkout/route.ts` - Stripe checkout API endpoint
- `lib/stripe.ts` - Client-side Stripe utility functions
- `app/checkout/success/page.tsx` - Success page after payment
- `app/checkout/cancel/page.tsx` - Cancel page if payment is cancelled
- `app/page.tsx` - Updated all payment buttons to trigger checkout

## Price Configuration

The journal price is set to **£19.99** (1999 pence) in `app/api/checkout/route.ts`. To change the price:

1. Update the `unit_amount` in `app/api/checkout/route.ts` (line ~25)
2. Update all price displays in `app/page.tsx`

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your secret keys secure
- Use test keys during development
- Switch to live keys only when ready for production
- Always use HTTPS in production

## Troubleshooting

**Error: "Failed to create checkout session"**
- Check that your `STRIPE_SECRET_KEY` is correct
- Ensure the key matches your environment (test vs live)

**Redirect not working**
- Verify `NEXT_PUBLIC_APP_URL` is set correctly
- Check that the URL matches your current domain

**Payment succeeds but no confirmation**
- Check browser console for errors
- Verify webhook endpoint if using webhooks


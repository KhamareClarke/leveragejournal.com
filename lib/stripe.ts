'use client';

import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export const createCheckoutSession = async (userId?: string, email?: string, cartItems?: Array<{ id: string; name: string; price: number; quantity: number; image?: string }>) => {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, email, cartItems }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    const { sessionId, url } = await response.json();
    
    // If we have a URL, redirect directly
    if (url) {
      window.location.href = url;
      return;
    }

    // Otherwise, use Stripe.js to redirect
    const stripe = await getStripe();
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw error;
      }
    }
  } catch (error: any) {
    console.error('Checkout error:', error);
    throw error;
  }
};


import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe secret key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe secret key is not configured. Please add STRIPE_SECRET_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    // Initialize Stripe inside the handler to avoid module-level initialization issues
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-12-15.clover',
    });

    const { userId, email, cartItems } = await request.json();

    // Build line items from cart items
    const lineItems = cartItems && cartItems.length > 0
      ? cartItems.map((item: { id: string; name: string; price: number; quantity: number; image?: string }) => {
          // Ensure image URL is absolute
          let imageUrl = 'https://leveragejournal.com/images/journal-product.png';
          if (item.image) {
            imageUrl = item.image.startsWith('http') 
              ? item.image 
              : `${process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com'}${item.image}`;
          }
          
          return {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: item.name,
                description: item.name.includes('Journal') 
                  ? '90-Day Transformation System - Premium goal setting journal'
                  : item.name,
                images: [imageUrl],
              },
              unit_amount: item.price, // Price in pence
            },
            quantity: item.quantity,
          };
        })
      : [
          // Fallback to single item if no cart items provided
          {
            price_data: {
              currency: 'gbp',
              product_data: {
                name: 'Leverage Journal - First Edition A5',
                description: '90-Day Transformation System - Premium goal setting journal',
                images: ['https://leveragejournal.com/images/journal-product.png'],
              },
              unit_amount: 1999, // £19.99 in pence
            },
            quantity: 1,
          },
        ];

    // Calculate total price
    const totalPrice = cartItems && cartItems.length > 0
      ? cartItems.reduce((sum: number, item: { price: number; quantity: number }) => sum + (item.price * item.quantity), 0)
      : 1999;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout/cancel`,
      customer_email: email || undefined,
      metadata: {
        userId: userId || '',
        product: 'leverage-journal',
        price: (totalPrice / 100).toFixed(2),
        itemCount: cartItems ? cartItems.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0).toString() : '1',
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}


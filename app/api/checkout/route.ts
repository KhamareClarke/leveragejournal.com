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

    // Get the origin from the request to determine the correct base URL
    const origin = request.headers.get('origin') || request.headers.get('referer') || '';
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://leveragejournal.com';
    
    // If we have an origin from the request, use it (for dynamic URL detection)
    if (origin) {
      try {
        const url = new URL(origin);
        baseUrl = `${url.protocol}//${url.host}`;
      } catch (e) {
        // If parsing fails, use the default
        console.log('Could not parse origin, using default:', baseUrl);
      }
    }

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
              unit_amount: 0, // Free for testing - Price in pence (set to 0 for testing)
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
              unit_amount: 0, // Free for testing - £0.00 in pence
            },
            quantity: 1,
          },
        ];

    // Calculate total price (free for testing)
    const totalPrice = 0; // Free for testing

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
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


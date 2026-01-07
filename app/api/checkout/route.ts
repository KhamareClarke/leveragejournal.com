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
              unit_amount: 100, // £1.00 in pence
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
              unit_amount: 100, // £1.00 in pence
            },
            quantity: 1,
          },
        ];

    // Calculate total price
    const totalPrice = cartItems && cartItems.length > 0
      ? cartItems.reduce((sum: number, item: { price: number; quantity: number }) => sum + (item.price * item.quantity), 0)
      : 100; // Default to £1.00 (100 pence) if no cart items

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/checkout/cancel`,
      customer_email: email || undefined,
      // Require shipping address collection (allows all Stripe-supported countries)
      shipping_address_collection: {
        allowed_countries: ['AC', 'AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CV', 'CW', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MK', 'ML', 'MM', 'MN', 'MO', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SZ', 'TA', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VN', 'VU', 'WF', 'WS', 'XK', 'YE', 'YT', 'ZA', 'ZM', 'ZW', 'ZZ'],
      },
      // Collect phone number
      phone_number_collection: {
        enabled: true,
      },
      // Collect billing address
      billing_address_collection: 'required',
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


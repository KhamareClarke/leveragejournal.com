import { NextRequest, NextResponse } from 'next/server';
import { handleCartAbandonment } from '@/lib/notifications/cart-abandonment';

export async function POST(request: NextRequest) {
  try {
    const { cartId } = await request.json();
    if (!cartId) {
      return NextResponse.json({ error: 'cartId is required' }, { status: 400 });
    }

    const result = await handleCartAbandonment(cartId);
    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to process abandoned cart' }, { status: 500 });
  }
}

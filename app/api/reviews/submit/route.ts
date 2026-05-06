import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, userId, rating, comment } = body;

    if (!orderId || !rating) {
      return NextResponse.json({ error: 'orderId and rating are required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'rating must be between 1 and 5' }, { status: 400 });
    }

    const { data: review, error } = await supabaseAdmin
      .from('reviews')
      .insert({
        order_id: orderId,
        user_id: userId || null,
        rating,
        comment: comment || null,
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    await supabaseAdmin.from('orders').update({ review_submitted: true }).eq('id', orderId);

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit review' }, { status: 500 });
  }
}

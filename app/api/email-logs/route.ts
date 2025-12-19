import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// GET: Retrieve all email logs
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const emailType = searchParams.get('type');
    const status = searchParams.get('status');
    const email = searchParams.get('email');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('email_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (emailType) {
      query = query.eq('email_type', emailType);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (email) {
      query = query.ilike('email', `%${email}%`);
    }

    const { data: logs, error } = await query;

    if (error) {
      console.error('Error fetching email logs:', error);
      return NextResponse.json({ error: 'Failed to fetch email logs' }, { status: 500 });
    }

    // Get total count for pagination
    let countQuery = supabase.from('email_logs').select('*', { count: 'exact', head: true });
    if (emailType) {
      countQuery = countQuery.eq('email_type', emailType);
    }
    if (status) {
      countQuery = countQuery.eq('status', status);
    }
    if (email) {
      countQuery = countQuery.ilike('email', `%${email}%`);
    }

    const { count } = await countQuery;

    // Get summary statistics
    const { data: allLogs } = await supabase
      .from('email_logs')
      .select('email_type, status');

    const stats: any = {
      total: allLogs?.length || 0,
      byType: {} as Record<string, number>,
      byStatus: { sent: 0, failed: 0 },
    };

    allLogs?.forEach((log: any) => {
      stats.byType[log.email_type] = (stats.byType[log.email_type] || 0) + 1;
      if (log.status === 'sent') stats.byStatus.sent++;
      if (log.status === 'failed') stats.byStatus.failed++;
    });

    return NextResponse.json({
      success: true,
      logs: logs || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
      stats: stats || { total: 0, byType: {}, byStatus: { sent: 0, failed: 0 } },
    });
  } catch (error: any) {
    console.error('Email logs API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch email logs' },
      { status: 500 }
    );
  }
}


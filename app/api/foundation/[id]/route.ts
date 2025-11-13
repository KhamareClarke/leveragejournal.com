import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Helper to get user from request
async function getUserFromRequest(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  // Add timeout to prevent hanging
  const getUserPromise = supabase.auth.getUser(token);
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Authentication timeout')), 5000)
  );

  try {
    const result = await Promise.race([getUserPromise, timeoutPromise]) as any;
    const { data: { user }, error } = result;
    
    if (error || !user) {
      console.error('❌ Foundation API: Auth error:', error?.message);
      return null;
    }

    return user;
  } catch (error: any) {
    console.error('❌ Foundation API: Auth timeout or error:', error?.message);
    return null;
  }
}

// GET: Retrieve a specific foundation entry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from('foundation')
      .select('*')
      .eq('id', params.id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Foundation entry not found', details: error.message },
        { status: 404 }
      );
    }

    return NextResponse.json({ foundation: data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve foundation entry' },
      { status: 500 }
    );
  }
}

// PUT: Update a foundation entry
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      entry_date,
      my_why, // Keep for backward compatibility
      what_drives_me,
      what_im_done_with,
      who_im_building_for,
      my_vision, // Keep for backward compatibility
      my_values,
      my_skills,
      influences, // Keep for backward compatibility
      books_that_shaped_me,
      mentors_role_models,
      core_principles,
      lessons_learned,
      accountability_partner
    } = body;

    // Use service role key for server-side operations (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    // Prepare update data
    const updateData: any = {};
    if (entry_date !== undefined) updateData.entry_date = entry_date;
    if (my_why !== undefined) updateData.my_why = my_why?.trim() || null; // Keep for backward compatibility
    if (what_drives_me !== undefined) updateData.what_drives_me = what_drives_me?.trim() || null;
    if (what_im_done_with !== undefined) updateData.what_im_done_with = what_im_done_with?.trim() || null;
    if (who_im_building_for !== undefined) updateData.who_im_building_for = who_im_building_for?.trim() || null;
    if (my_vision !== undefined) updateData.my_vision = my_vision?.trim() || null; // Keep for backward compatibility
    if (my_values !== undefined) updateData.my_values = my_values?.trim() || null;
    if (my_skills !== undefined) updateData.my_skills = my_skills?.trim() || null;
    if (influences !== undefined) updateData.influences = influences?.trim() || null; // Keep for backward compatibility
    if (books_that_shaped_me !== undefined) updateData.books_that_shaped_me = books_that_shaped_me?.trim() || null;
    if (mentors_role_models !== undefined) updateData.mentors_role_models = mentors_role_models?.trim() || null;
    if (core_principles !== undefined) updateData.core_principles = core_principles?.trim() || null;
    if (lessons_learned !== undefined) updateData.lessons_learned = lessons_learned?.trim() || null;
    if (accountability_partner !== undefined) updateData.accountability_partner = accountability_partner?.trim() || null;

    console.log('💾 Foundation API: Updating entry', params.id, 'for user:', user.email, 'ID:', user.id);

    // Update foundation entry
    let { data, error } = await supabase
      .from('foundation')
      .update(updateData)
      .eq('id', params.id)
      .eq('user_id', user.id)
      .select()
      .single();

    console.log('💾 Foundation API: Update result - Error:', error?.message, 'Data:', data ? JSON.stringify(data) : 'None');

    if (error) {
      console.error('❌ Foundation API: Update error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to update foundation entry', 
          details: error.message,
          code: error.code
        },
        { status: 500 }
      );
    }

    // If update succeeded but no data returned, try to fetch it
    if (!data) {
      console.warn('⚠️ Foundation API: Update succeeded but no data returned, fetching...');
      const { data: fetchedData, error: fetchError } = await supabase
        .from('foundation')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !fetchedData) {
        console.error('❌ Foundation API: Failed to fetch updated data:', fetchError?.message);
        return NextResponse.json({ 
          success: true, 
          foundation: null,
          message: 'Entry updated but could not retrieve it. Please refresh the page.'
        });
      }

      data = fetchedData;
    }

    console.log('✅ Foundation API: Successfully updated entry:', data?.id);
    return NextResponse.json({ 
      success: true, 
      foundation: data 
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update foundation entry' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a foundation entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Add timeout to prevent hanging
    const deletePromise = supabase
      .from('foundation')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.id);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Database operation timed out after 5 seconds')), 5000)
    );

    let error;
    try {
      const result = await Promise.race([deletePromise, timeoutPromise]) as any;
      error = result.error;
    } catch (timeoutErr: any) {
      return NextResponse.json(
        {
          error: 'Delete operation timed out',
          details: 'The database operation took too long. Please check your connection and try again.'
        },
        { status: 504 }
      );
    }

    if (error) {
      return NextResponse.json(
        { 
          error: 'Failed to delete foundation entry', 
          details: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete foundation entry' },
      { status: 500 }
    );
  }
}


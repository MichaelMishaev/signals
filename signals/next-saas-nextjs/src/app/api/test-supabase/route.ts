import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Check if env vars exist
    const checks = {
      url: {
        exists: !!url,
        isEmpty: url === '',
        value: url ? `${url.substring(0, 30)}...` : 'MISSING'
      },
      anonKey: {
        exists: !!anonKey,
        isEmpty: anonKey === '',
        value: anonKey ? `${anonKey.substring(0, 20)}...` : 'MISSING'
      },
      serviceKey: {
        exists: !!serviceKey,
        isEmpty: serviceKey === '',
        value: serviceKey ? `${serviceKey.substring(0, 20)}...` : 'MISSING'
      }
    };

    // Try to create a client and make a simple query
    let testResult = null;
    let testError = null;

    if (url && anonKey && serviceKey && url.trim() !== '' && anonKey.trim() !== '' && serviceKey.trim() !== '') {
      try {
        const supabase = createClient(url, serviceKey);
        const { data, error } = await supabase
          .from('signals')
          .select('id, title, created_at')
          .limit(1);

        if (error) {
          testError = {
            message: error.message,
            code: error.code,
            details: error.details
          };
        } else {
          testResult = {
            success: true,
            recordCount: data?.length || 0,
            sample: data?.[0] || null
          };
        }
      } catch (e: any) {
        testError = {
          message: e.message,
          stack: e.stack
        };
      }
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      checks,
      testResult,
      testError
    });
  } catch (error: any) {
    return NextResponse.json({
      error: 'Test failed',
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/translations - List all translations
export async function GET(request: NextRequest) {
  try {
    const translations = await prisma.translationDynamic.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      translations,
    });
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch translations' },
      { status: 500 }
    );
  }
}

// POST /api/translations - Create new translation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content_type, key, en_value, ur_value, ur_updated_by } = body;

    // Validate required fields
    if (!content_type || !key || !en_value) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create translation
    const translation = await prisma.translationDynamic.create({
      data: {
        content_type,
        key,
        en_value,
        ur_value: ur_value || null,
        ur_status: ur_value ? 'pending' : 'pending',
        ur_updated_by: ur_updated_by || null,
        ur_updated_at: ur_value ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      translation,
    });
  } catch (error) {
    console.error('Error creating translation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create translation' },
      { status: 500 }
    );
  }
}

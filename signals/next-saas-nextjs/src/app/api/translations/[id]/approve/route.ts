import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/translations/:id/approve - Approve translation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { approved_by } = body;

    const translation = await prisma.translationDynamic.update({
      where: { id: parseInt(id) },
      data: {
        ur_status: 'approved',
        ur_approved_by: approved_by,
        ur_approved_at: new Date(),
      },
    });

    // Create history record
    await prisma.translationHistory.create({
      data: {
        translation_id: translation.id,
        field: 'ur_status',
        old_value: 'pending',
        new_value: 'approved',
        changed_by: approved_by,
      },
    });

    // Sync back to Signal/Drill tables if applicable
    if (translation.content_id && translation.namespace === 'signals') {
      const signalId = parseInt(translation.content_id);
      const updateData: any = {};

      if (translation.content_type === 'signal_title') {
        updateData.title_ur = translation.ur_value;
      } else if (translation.content_type === 'signal_content') {
        updateData.content_ur = translation.ur_value;
      } else if (translation.content_type === 'signal_author') {
        updateData.author_ur = translation.ur_value;
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.signal.update({
          where: { id: signalId },
          data: updateData,
        });
      }
    }

    if (translation.content_id && translation.namespace === 'drills') {
      const drillId = parseInt(translation.content_id);
      const updateData: any = {};

      if (translation.content_type === 'drill_title') {
        updateData.title_ur = translation.ur_value;
      } else if (translation.content_type === 'drill_description') {
        updateData.description_ur = translation.ur_value;
      } else if (translation.content_type === 'drill_content') {
        updateData.content_ur = translation.ur_value;
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.drill.update({
          where: { id: drillId },
          data: updateData,
        });
      }
    }

    return NextResponse.json({
      success: true,
      translation,
    });
  } catch (error) {
    console.error('Error approving translation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to approve translation' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/translations/:id/reject - Reject translation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { rejected_by, reason } = body;

    const translation = await prisma.translationDynamic.update({
      where: { id: parseInt(id) },
      data: {
        ur_status: 'rejected',
        ur_approved_by: rejected_by, // Store who rejected it
        ur_approved_at: new Date(),
      },
    });

    // Create history record
    await prisma.translationHistory.create({
      data: {
        translation_id: translation.id,
        field: 'ur_status',
        old_value: 'pending',
        new_value: `rejected: ${reason || 'No reason provided'}`,
        changed_by: rejected_by,
      },
    });

    return NextResponse.json({
      success: true,
      translation,
    });
  } catch (error) {
    console.error('Error rejecting translation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reject translation' },
      { status: 500 }
    );
  }
}

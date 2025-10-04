import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/translations/:id - Update translation
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { ur_value, ur_updated_by } = body;

    const translation = await prisma.translationDynamic.update({
      where: { id: parseInt(id) },
      data: {
        ur_value,
        ur_status: 'pending',
        ur_updated_by,
        ur_updated_at: new Date(),
      },
    });

    // Create history record
    await prisma.translationHistory.create({
      data: {
        translation_id: translation.id,
        field: 'ur_value',
        old_value: translation.ur_value || '',
        new_value: ur_value,
        changed_by: ur_updated_by,
      },
    });

    return NextResponse.json({
      success: true,
      translation,
    });
  } catch (error) {
    console.error('Error updating translation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update translation' },
      { status: 500 }
    );
  }
}

// DELETE /api/translations/:id - Delete translation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.translationDynamic.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error deleting translation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete translation' },
      { status: 500 }
    );
  }
}

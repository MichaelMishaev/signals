import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/translations/sync-drills - Load all drills and create translation entries
export async function GET(request: NextRequest) {
  try {
    const drills = await prisma.drill.findMany({
      select: {
        id: true,
        signal_id: true,
        title: true,
        title_ur: true,
        description: true,
        description_ur: true,
        content: true,
        content_ur: true,
      },
    });

    const translations = [];

    for (const drill of drills) {
      // Title translation
      const titleKey = `drill_${drill.id}_title`;
      let titleTranslation = await prisma.translationDynamic.findUnique({
        where: { key: titleKey },
      });

      if (!titleTranslation) {
        titleTranslation = await prisma.translationDynamic.create({
          data: {
            content_type: 'drill_title',
            content_id: drill.id.toString(),
            key: titleKey,
            en_value: drill.title,
            ur_value: drill.title_ur,
            ur_status: drill.title_ur ? 'approved' : 'pending',
            namespace: 'drills',
          },
        });
      }
      translations.push(titleTranslation);

      // Description translation
      const descKey = `drill_${drill.id}_description`;
      let descTranslation = await prisma.translationDynamic.findUnique({
        where: { key: descKey },
      });

      if (!descTranslation) {
        descTranslation = await prisma.translationDynamic.create({
          data: {
            content_type: 'drill_description',
            content_id: drill.id.toString(),
            key: descKey,
            en_value: drill.description,
            ur_value: drill.description_ur,
            ur_status: drill.description_ur ? 'approved' : 'pending',
            namespace: 'drills',
          },
        });
      }
      translations.push(descTranslation);

      // Content translation
      const contentKey = `drill_${drill.id}_content`;
      let contentTranslation = await prisma.translationDynamic.findUnique({
        where: { key: contentKey },
      });

      if (!contentTranslation) {
        contentTranslation = await prisma.translationDynamic.create({
          data: {
            content_type: 'drill_content',
            content_id: drill.id.toString(),
            key: contentKey,
            en_value: drill.content,
            ur_value: drill.content_ur,
            ur_status: drill.content_ur ? 'approved' : 'pending',
            namespace: 'drills',
          },
        });
      }
      translations.push(contentTranslation);
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${drills.length} drills with ${translations.length} translation entries`,
      count: translations.length,
    });
  } catch (error) {
    console.error('Error syncing drills:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync drills' },
      { status: 500 }
    );
  }
}

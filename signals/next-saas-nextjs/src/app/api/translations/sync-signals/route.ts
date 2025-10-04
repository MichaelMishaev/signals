import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/translations/sync-signals - Load all signals and create translation entries
export async function GET(request: NextRequest) {
  try {
    const signals = await prisma.signal.findMany({
      select: {
        id: true,
        title: true,
        title_ur: true,
        content: true,
        content_ur: true,
        author: true,
        author_ur: true,
      },
    });

    const translations = [];

    for (const signal of signals) {
      // Title translation
      const titleKey = `signal_${signal.id}_title`;
      let titleTranslation = await prisma.translationDynamic.findUnique({
        where: { key: titleKey },
      });

      if (!titleTranslation) {
        titleTranslation = await prisma.translationDynamic.create({
          data: {
            content_type: 'signal_title',
            content_id: signal.id.toString(),
            key: titleKey,
            en_value: signal.title,
            ur_value: signal.title_ur,
            ur_status: signal.title_ur ? 'approved' : 'pending',
            namespace: 'signals',
          },
        });
      }
      translations.push(titleTranslation);

      // Content translation
      const contentKey = `signal_${signal.id}_content`;
      let contentTranslation = await prisma.translationDynamic.findUnique({
        where: { key: contentKey },
      });

      if (!contentTranslation) {
        contentTranslation = await prisma.translationDynamic.create({
          data: {
            content_type: 'signal_content',
            content_id: signal.id.toString(),
            key: contentKey,
            en_value: signal.content,
            ur_value: signal.content_ur,
            ur_status: signal.content_ur ? 'approved' : 'pending',
            namespace: 'signals',
          },
        });
      }
      translations.push(contentTranslation);

      // Author translation
      const authorKey = `signal_${signal.id}_author`;
      let authorTranslation = await prisma.translationDynamic.findUnique({
        where: { key: authorKey },
      });

      if (!authorTranslation) {
        authorTranslation = await prisma.translationDynamic.create({
          data: {
            content_type: 'signal_author',
            content_id: signal.id.toString(),
            key: authorKey,
            en_value: signal.author,
            ur_value: signal.author_ur,
            ur_status: signal.author_ur ? 'approved' : 'pending',
            namespace: 'signals',
          },
        });
      }
      translations.push(authorTranslation);
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${signals.length} signals with ${translations.length} translation entries`,
      count: translations.length,
    });
  } catch (error) {
    console.error('Error syncing signals:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to sync signals' },
      { status: 500 }
    );
  }
}

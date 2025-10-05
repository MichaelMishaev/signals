import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getPrisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const prisma = getPrisma();

    if (!prisma) {
      console.warn('Feature flag scopes disabled - DATABASE_URL not configured');
      return NextResponse.json({ scopes: [] });
    }

    const session = await getServerSession(authOptions);

    const searchParams = request.nextUrl.searchParams;
    const flagId = searchParams.get('flagId');
    const scope = searchParams.get('scope');
    const scopeId = searchParams.get('scopeId');

    const where: any = {};
    if (flagId) where.flagId = flagId;
    if (scope) where.scope = scope;
    if (scopeId) where.scopeId = scopeId;

    // Regular users only see active scopes
    if (!session?.user?.email?.includes('@admin')) {
      where.state = 'ACTIVE';
      where.enabled = true;
    }

    const scopes = await prisma.featureFlagScope.findMany({
      where,
      include: {
        flag: true
      }
    });

    return NextResponse.json({ scopes });
  } catch (error) {
    console.error('Error fetching feature flag scopes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feature flag scopes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const prisma = getPrisma();

    if (!prisma) {
      return NextResponse.json(
        { error: 'Feature flag scopes disabled - DATABASE_URL not configured' },
        { status: 503 }
      );
    }

    const session = await getServerSession(authOptions);

    // Allow admin access with password or email check
    const adminPassword = request.headers.get('x-admin-password');
    const isEmailAdmin = session?.user?.email?.includes('@admin');

    if (!isEmailAdmin && adminPassword !== '6262') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { flagId, scope, scopeId, enabled, state, metadata } = body;

    // Validate required fields
    if (!flagId || !scope || !scopeId) {
      return NextResponse.json(
        { error: 'FlagId, scope, and scopeId are required' },
        { status: 400 }
      );
    }

    // Create or update scope
    const scopeFlag = await prisma.featureFlagScope.upsert({
      where: {
        flagId_scope_scopeId: {
          flagId,
          scope,
          scopeId
        }
      },
      create: {
        flagId,
        scope,
        scopeId,
        enabled: enabled ?? true,
        state: state || 'ACTIVE',
        metadata
      },
      update: {
        enabled,
        state,
        metadata
      },
      include: {
        flag: true
      }
    });

    return NextResponse.json({ scope: scopeFlag });
  } catch (error) {
    console.error('Error creating/updating feature flag scope:', error);
    return NextResponse.json(
      { error: 'Failed to create/update feature flag scope' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const prisma = getPrisma();

    if (!prisma) {
      return NextResponse.json(
        { error: 'Feature flag scopes disabled - DATABASE_URL not configured' },
        { status: 503 }
      );
    }

    const session = await getServerSession(authOptions);

    // Allow admin access with password or email check
    const adminPassword = request.headers.get('x-admin-password');
    const isEmailAdmin = session?.user?.email?.includes('@admin');

    if (!isEmailAdmin && adminPassword !== '6262') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Scope ID is required' },
        { status: 400 }
      );
    }

    const scope = await prisma.featureFlagScope.update({
      where: { id },
      data: updateData,
      include: {
        flag: true
      }
    });

    return NextResponse.json({ scope });
  } catch (error: any) {
    console.error('Error updating feature flag scope:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Feature flag scope not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update feature flag scope' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const prisma = getPrisma();

    if (!prisma) {
      return NextResponse.json(
        { error: 'Feature flag scopes disabled - DATABASE_URL not configured' },
        { status: 503 }
      );
    }

    const session = await getServerSession(authOptions);

    // Allow admin access with password or email check
    const adminPassword = request.headers.get('x-admin-password');
    const isEmailAdmin = session?.user?.email?.includes('@admin');

    if (!isEmailAdmin && adminPassword !== '6262') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Scope ID is required' },
        { status: 400 }
      );
    }

    await prisma.featureFlagScope.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting feature flag scope:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Feature flag scope not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete feature flag scope' },
      { status: 500 }
    );
  }
}
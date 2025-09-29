import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const scope = searchParams.get('scope');
    const scopeId = searchParams.get('scopeId');
    const includeDisabled = searchParams.get('includeDisabled') === 'true';

    // Build query
    const where: any = {};

    // For regular users, only show enabled flags
    if (!session?.user?.email?.includes('@admin')) {
      where.enabled = true;
    }

    // If scope is provided, get flags for specific scope
    if (scope && scopeId) {
      const scopeFlags = await prisma.featureFlagScope.findMany({
        where: {
          scope,
          scopeId,
          ...(includeDisabled ? {} : { enabled: true }),
          ...(session?.user?.email?.includes('@admin')
            ? {}
            : { state: 'ACTIVE' })
        },
        include: {
          flag: true
        }
      });

      return NextResponse.json({
        flags: scopeFlags.map(sf => ({
          ...sf.flag,
          scopeEnabled: sf.enabled,
          scopeState: sf.state,
          scopeMetadata: sf.metadata
        }))
      });
    }

    // Get all flags
    const flags = await prisma.featureFlag.findMany({
      where,
      include: {
        scopeFlags: includeDisabled ? true : {
          where: { enabled: true }
        }
      }
    });

    return NextResponse.json({ flags });
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feature flags' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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
    const { key, name, description, type, value, enabled } = body;

    // Validate required fields
    if (!key || !name) {
      return NextResponse.json(
        { error: 'Key and name are required' },
        { status: 400 }
      );
    }

    // Create feature flag
    const flag = await prisma.featureFlag.create({
      data: {
        key,
        name,
        description,
        type: type || 'BOOLEAN',
        value,
        enabled: enabled ?? false
      }
    });

    return NextResponse.json({ flag }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating feature flag:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Feature flag with this key already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create feature flag' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
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
        { error: 'Flag ID is required' },
        { status: 400 }
      );
    }

    // Update feature flag
    const flag = await prisma.featureFlag.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ flag });
  } catch (error: any) {
    console.error('Error updating feature flag:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Feature flag not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update feature flag' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
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
        { error: 'Flag ID is required' },
        { status: 400 }
      );
    }

    // Delete feature flag (cascade will delete scopes)
    await prisma.featureFlag.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting feature flag:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Feature flag not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete feature flag' },
      { status: 500 }
    );
  }
}
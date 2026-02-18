import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/db-indexed';

export async function GET() {
  try {
    const blob = await dbHelpers.exportAllData();

    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="hezeerflow-vault-${Date.now()}.json"`,
      },
    });
  } catch (error) {
    console.error('Export Error:', error);
    return NextResponse.json(
      { error: 'Failed to export vault' },
      { status: 500 }
    );
  }
}

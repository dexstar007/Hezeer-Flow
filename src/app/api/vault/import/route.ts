import { NextRequest, NextResponse } from 'next/server';
import { dbHelpers } from '@/lib/db-indexed';

export async function POST(req: NextRequest) {
  try {
    const { jsonData } = await req.json();

    if (!jsonData) {
      return NextResponse.json(
        { error: 'No data provided' },
        { status: 400 }
      );
    }

    await dbHelpers.importData(jsonData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Import Error:', error);
    return NextResponse.json(
      { error: 'Failed to import vault' },
      { status: 500 }
    );
  }
}

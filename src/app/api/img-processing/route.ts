import { NextRequest, NextResponse } from 'next/server';
import { detectText } from '@/app/scripts/imgProcessing';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const blob = file as unknown as Blob;
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract mime type from the uploaded file (fallback to image/png)
    const mimeType = (file as any).type || 'image/png';
    const base64 = buffer.toString('base64');

    const text = await detectText(base64, mimeType);
    return NextResponse.json({ text });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}



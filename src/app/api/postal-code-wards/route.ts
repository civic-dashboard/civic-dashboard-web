import { fetchWardsForPostalCode } from '@/api/geoservices';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postalCode = searchParams.get('postalCode');

  if (!postalCode) {
    return NextResponse.json({ wardIds: [] });
  }

  try {
    const wardIds = await fetchWardsForPostalCode(postalCode);
    return NextResponse.json({ wardIds });
  } catch (err) {
    console.error('Error fetching wards for postal code:', err);
    return NextResponse.json(
      { error: 'Failed to fetch wards' },
      { status: 500 },
    );
  }
}

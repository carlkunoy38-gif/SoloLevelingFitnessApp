import { NextResponse } from 'next/server';
import { getAllProfiles, saveProfile } from '@/lib/db';

export async function GET() {
  try {
    return NextResponse.json(getAllProfiles());
  } catch (error) {
    console.error('GET /api/profiles error:', error);
    return NextResponse.json({ error: 'Kunne ikke hente profiler' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const profile = saveProfile({
      navn: body.navn ?? 'Min økonomi',
      incomeData: JSON.stringify(body.incomeData ?? {}),
      budgetData: JSON.stringify(body.budgetData ?? {}),
      investmentData: JSON.stringify(body.investmentData ?? {}),
      aktuelOpsparing: body.aktuelOpsparing ?? 0,
    });
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('POST /api/profiles error:', error);
    return NextResponse.json({ error: 'Kunne ikke gemme profil' }, { status: 500 });
  }
}

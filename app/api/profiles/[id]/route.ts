import { NextResponse } from 'next/server';
import { getProfile, updateProfile, deleteProfile } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = getProfile(id);
  if (!profile) return NextResponse.json({ error: 'Ikke fundet' }, { status: 404 });
  return NextResponse.json(profile);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const updated = updateProfile(id, {
    navn: body.navn,
    incomeData: body.incomeData ? JSON.stringify(body.incomeData) : undefined,
    budgetData: body.budgetData ? JSON.stringify(body.budgetData) : undefined,
    investmentData: body.investmentData ? JSON.stringify(body.investmentData) : undefined,
    aktuelOpsparing: body.aktuelOpsparing,
  });
  if (!updated) return NextResponse.json({ error: 'Ikke fundet' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = deleteProfile(id);
  if (!ok) return NextResponse.json({ error: 'Ikke fundet' }, { status: 404 });
  return NextResponse.json({ success: true });
}

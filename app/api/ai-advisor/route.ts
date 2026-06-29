import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'AI-vejlederen er ikke aktiveret endnu. Tilføj ANTHROPIC_API_KEY i dine miljøvariabler.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const { question, financialContext } = body as { question: string; financialContext: string };

    if (!question?.trim()) {
      return NextResponse.json({ error: 'Intet spørgsmål modtaget.' }, { status: 400 });
    }

    const systemPrompt = `Du er "Finansassistenten" — en venlig dansk personlig økonomi-vejleder i en finansapp.

Du taler altid dansk, er præcis og konkret. Du bruger brugerens faktiske tal i dine svar.
Du undgår finansjargon. Du er opmuntrende men ærlig.
Du anbefaler altid at konsultere en certificeret rådgiver ved store beslutninger.
Du giver IKKE autoriseret investerings- eller skatterådgivning.

Brugerens nuværende økonomi:
${financialContext}

Svar kortfattet (2-4 sætninger) medmindre brugeren beder om mere detalje.
Brug kr. og brugerens faktiske tal. Slut gerne med ét konkret handlingstip.`;

    const client = new Anthropic({ apiKey });
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: question }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    return NextResponse.json({ answer: text });
  } catch (error) {
    console.error('AI advisor error:', error);
    return NextResponse.json({ error: 'Kunne ikke kontakte AI-vejlederen. Prøv igen.' }, { status: 500 });
  }
}

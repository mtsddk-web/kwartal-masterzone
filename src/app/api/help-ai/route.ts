import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `Jesteś pomocnym asystentem MasterZone - społeczności produktywności dla przedsiębiorców.

Pomagasz użytkownikom wypełnić formularz planowania kwartału. Odpowiadasz KRÓTKO (2-4 zdania), konkretnie i po polsku.

Twoje odpowiedzi powinny być:
- Praktyczne i actionable
- Oparte na metodologii OKR, planowania kwartalnego
- Dopasowane do kontekstu sekcji formularza

NIE pisz długich elaboratów. Odpowiadaj zwięźle jak mentor, który zna się na rzeczy.`;

export async function POST(request: NextRequest) {
  try {
    const { question, context } = await request.json();

    if (!question || !context) {
      return NextResponse.json(
        { error: 'Brak pytania lub kontekstu' },
        { status: 400 }
      );
    }

    if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === 'your-api-key-here') {
      // Fallback response when no API key
      return NextResponse.json({
        response: getSmartFallback(context, question),
        fallback: true,
      });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `SEKCJA FORMULARZA: ${context.title}
OPIS SEKCJI: ${context.description}
${context.examples?.length ? `PRZYKŁADY: ${context.examples.join(', ')}` : ''}
${context.tips?.length ? `WSKAZÓWKI: ${context.tips.join(', ')}` : ''}

PYTANIE UŻYTKOWNIKA: ${question}

Odpowiedz krótko (2-4 zdania) po polsku:`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      return NextResponse.json({
        response: getSmartFallback(context, question),
        fallback: true,
      });
    }

    const data = await response.json();
    const aiResponse = data.content[0]?.text || 'Nie udało się wygenerować odpowiedzi.';

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Help AI error:', error);
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    );
  }
}

function getSmartFallback(context: { title: string; description: string; examples?: string[]; tips?: string[] }, question: string): string {
  const q = question.toLowerCase();
  const title = context.title.toLowerCase();
  const desc = context.description.toLowerCase();

  // Check for common question patterns
  if (q.includes('liczba') || q.includes('procent') || q.includes('%')) {
    if (title.includes('north star') || title.includes('metryka') || title.includes('metric')) {
      return 'North Star to zawsze konkretna liczba absolutna (np. "50 klientów", "100 000 PLN"), nie procent. Procenty są dobre dla metryk wspierających typu "konwersja 30%".';
    }
    if (title.includes('cel') || title.includes('goal')) {
      return 'Cele powinny być wyrażone jako konkretny rezultat. Możesz użyć liczby ("zdobyć 25 klientów") lub procentu ("zwiększyć konwersję o 20%") - zależy co mierzysz.';
    }
  }

  if (q.includes('ile') || q.includes('jak dużo') || q.includes('ilu')) {
    if (title.includes('cel') || title.includes('goal')) {
      return 'Maksymalnie 3 cele na kwartał. Więcej = rozproszenie. Skup się na tych, które najbardziej "przesuną igłę".';
    }
    if (title.includes('projekt')) {
      return 'Max 3 projekty jednocześnie. Jeden główny (40-50% czasu) i dwa wspierające. Suma alokacji = 100%.';
    }
    if (title.includes('ryzy') || title.includes('risk')) {
      return 'Zidentyfikuj 2-3 główne ryzyka. Każde MUSI mieć konkretne działanie zapobiegawcze (mitygację).';
    }
  }

  if (q.includes('przykład') || q.includes('jak') || q.includes('co wpisać')) {
    // Use examples from context if available
    if (context.examples && context.examples.length > 0) {
      return `Przykłady dla tej sekcji: "${context.examples[0]}"${context.examples[1] ? ` lub "${context.examples[1]}"` : ''}. Dostosuj do swojej sytuacji.`;
    }
  }

  if (q.includes('po co') || q.includes('dlaczego') || q.includes('sens')) {
    // Use description as explanation
    return context.description;
  }

  if (q.includes('różnica') || q.includes('vs') || q.includes('czy')) {
    if (title.includes('wizja')) {
      return 'Wizja to obrazowy opis przyszłości (co WIDZISZ), cel to mierzalny rezultat (CO osiągniesz), a projekt to DZIAŁANIE które do tego prowadzi.';
    }
    if (title.includes('stop') || title.includes('doing')) {
      return 'Stop-Doing to świadome "NIE" - rzeczy które ODKŁADASZ żeby mieć czas na priorytety. To nie "może później" - to aktywna decyzja.';
    }
  }

  // Default: use tips if available, otherwise description
  if (context.tips && context.tips.length > 0) {
    return context.tips[0];
  }

  // Last resort: summarize the description
  const shortDesc = context.description.slice(0, 200);
  return `${shortDesc}${context.description.length > 200 ? '...' : ''} Skup się na konkretach i mierzalnych rezultatach.`;
}

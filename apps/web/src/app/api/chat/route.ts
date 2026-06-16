import { NextRequest } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/chat-assistant';
import { getLlmConfig, MISSING_KEY_MESSAGE } from '@/lib/llm-config';

export const runtime = 'nodejs';
export const maxDuration = 60;

interface ChatRequestBody {
  messages: { role: 'user' | 'assistant'; content: string }[];
}

export async function POST(req: NextRequest) {
  let body: ChatRequestBody;

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Geçersiz istek gövdesi' }, { status: 400 });
  }

  if (!body.messages?.length) {
    return Response.json({ error: 'Mesaj bulunamadı' }, { status: 400 });
  }

  const lastMessage = body.messages[body.messages.length - 1];
  if (lastMessage.role !== 'user' || !lastMessage.content.trim()) {
    return Response.json({ error: 'Geçersiz mesaj' }, { status: 400 });
  }

  if (body.messages.length > 40) {
    return Response.json({ error: 'Sohbet çok uzun, lütfen yeni bir sohbet başlatın' }, { status: 400 });
  }

  const { apiKey, baseUrl, model } = getLlmConfig();

  if (!apiKey) {
    return Response.json({ error: MISSING_KEY_MESSAGE }, { status: 503 });
  }

  const llmMessages = [
    { role: 'system' as const, content: SYSTEM_PROMPT },
    ...body.messages.slice(-20).map((m) => ({
      role: m.role,
      content: m.content.slice(0, 8000),
    })),
  ];

  try {
    const llmRes = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: llmMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!llmRes.ok) {
      const errText = await llmRes.text().catch(() => '');
      console.error('LLM API error:', llmRes.status, errText);

      if (llmRes.status === 401) {
        return Response.json(
          { error: 'API anahtarı geçersiz. GROQ_API_KEY değerini console.groq.com üzerinden kontrol edin.' },
          { status: 502 },
        );
      }

      return Response.json(
        { error: `Yapay zeka servisi hatası (${llmRes.status}). Lütfen biraz sonra tekrar deneyin.` },
        { status: 502 },
      );
    }

    if (!llmRes.body) {
      return Response.json({ error: 'Boş yanıt alındı' }, { status: 502 });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = llmRes.body!.getReader();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data: ')) continue;
              const data = trimmed.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data) as {
                  choices?: { delta?: { content?: string } }[];
                };
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch {
                // skip malformed SSE chunks
              }
            }
          }
        } catch (err) {
          console.error('Stream error:', err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (err) {
    console.error('Chat API error:', err);
    return Response.json({ error: 'Yapay zeka servisine bağlanılamadı' }, { status: 503 });
  }
}

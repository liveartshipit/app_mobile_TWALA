// Groq call (OpenAI-compatible). The key lives only in Vercel env vars,
// never in the client. OpenRouter is used as a fallback if configured.

type Msg = { role: "system" | "user"; content: string };

async function call(base: string, key: string, model: string, messages: Msg[]) {
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, temperature: 0.6, max_tokens: 1400 }),
    signal: AbortSignal.timeout(45_000),
  });
  if (!res.ok) throw new Error(`AI provider returned ${res.status}`);
  const data = await res.json();
  const text: string = data?.choices?.[0]?.message?.content ?? "";
  if (!text) throw new Error("Empty AI response");
  return text.trim();
}

export async function ask(system: string, user: string): Promise<string> {
  const groqKey = process.env.GROQ_API_KEY;
  const orKey = process.env.OPENROUTER_API_KEY;
  const messages: Msg[] = [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
  if (groqKey) {
    try {
      return await call(
        process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1",
        groqKey,
        process.env.GROQ_MODEL || "openai/gpt-oss-120b",
        messages
      );
    } catch (e) {
      if (!orKey) throw e;
    }
  }
  if (orKey) {
    return call(
      "https://openrouter.ai/api/v1",
      orKey,
      process.env.OPENROUTER_MODEL || "openai/gpt-oss-120b:free",
      messages
    );
  }
  throw new Error("AI is not configured on this server yet.");
}

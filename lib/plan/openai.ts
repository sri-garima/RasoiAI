const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export type OpenAiChatResult = {
  content: string;
};

export async function openaiChatJsonCompletion(options: {
  system: string;
  user: string;
  apiKey: string;
  model?: string;
  signal?: AbortSignal;
}): Promise<OpenAiChatResult> {
  const model = options.model ?? process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${options.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: options.system },
        { role: "user", content: options.user },
      ],
      temperature: 0.65,
      response_format: { type: "json_object" },
    }),
    signal: options.signal,
  });

  const rawText = await res.text();
  if (!res.ok) {
    throw new Error(rawText || `OpenAI HTTP ${res.status}`);
  }

  let data: unknown;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error("Invalid JSON from OpenAI");
  }

  const root = data as Record<string, unknown>;
  const choices = root.choices;
  if (!Array.isArray(choices) || choices.length === 0) {
    throw new Error("OpenAI returned no choices");
  }
  const msg = choices[0] as Record<string, unknown>;
  const message = msg.message as Record<string, unknown> | undefined;
  const content = message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Empty assistant content");
  }
  return { content: content.trim() };
}

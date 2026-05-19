import { NextResponse } from "next/server";

import { parsePlanRequestBody } from "@/lib/plan/api-body";
import { canGenerateDailyPlan } from "@/lib/plan/generate-daily";
import { openaiChatJsonCompletion } from "@/lib/plan/openai";
import { parseOpenAiWeeklyContent } from "@/lib/plan/parse-ai-plan";
import {
  buildUserPromptContext,
  WEEKLY_JSON_INSTRUCTION,
} from "@/lib/plan/prompt-context";

export const maxDuration = 60;

const SYSTEM = `You are RasoiAI, an Indian household meal planning assistant.
Produce a full Monday–Sunday week of meals: breakfast, lunch, evening snack, dinner each day.
Vary dishes across the week, reuse sensible staples, respect diet (veg / eggetarian / non-veg / Jain strictly).
Keep tone warm and practical for busy Indian homes.`;

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "Add OPENAI_API_KEY to .env.local (see .env.example). Optional: OPENAI_MODEL=gpt-4o-mini",
      },
      { status: 503 },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = parsePlanRequestBody(raw);
  if (!parsed) {
    return NextResponse.json(
      { error: "invalid_body", message: "Expected { profile, pantry }." },
      { status: 400 },
    );
  }

  const { profile, pantry } = parsed;
  if (!canGenerateDailyPlan(profile)) {
    return NextResponse.json(
      {
        error: "profile_incomplete",
        message:
          "Profile needs diet, preferred cuisine, and cooking time before AI generation.",
      },
      { status: 422 },
    );
  }

  const user = `${buildUserPromptContext(profile, pantry)}\n\n${WEEKLY_JSON_INSTRUCTION}`;

  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 55_000);
    try {
      const { content } = await openaiChatJsonCompletion({
        system: SYSTEM,
        user,
        apiKey,
        signal: controller.signal,
      });

      const days = parseOpenAiWeeklyContent(content);
      if (!days) {
        return NextResponse.json(
          {
            error: "parse_failed",
            message:
              "AI returned JSON we could not map to 7 full days. Try Regenerate or use Rules preview.",
          },
          { status: 502 },
        );
      }
      return NextResponse.json({ days });
    } finally {
      clearTimeout(t);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    const aborted = e instanceof Error && e.name === "AbortError";
    return NextResponse.json(
      {
        error: aborted ? "timeout" : "openai_error",
        message: aborted
          ? "The AI request took too long. Try again with Rules preview or retry."
          : msg.slice(0, 500),
      },
      { status: aborted ? 504 : 502 },
    );
  }
}

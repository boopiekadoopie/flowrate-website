import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { AGENCY_SYSTEM_PROMPT } from "@/lib/agency-knowledge";
import { clientIp, isAllowedOrigin, isRateLimited } from "@/lib/requestGuard";

export const runtime = "nodejs";
export const maxDuration = 30;

const MODEL = "claude-opus-5-5";
const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_BODY_BYTES = 50_000;
const RATE_LIMIT = 20; // messages per visitor per window
const RATE_WINDOW_MS = 10 * 60 * 1000;

const FALLBACK_REPLY =
  "The chat is having trouble right now. You can reach Andrew directly at andrew@flowrate.agency or book a free call at calendly.com/flowrate/30min.";
const NO_ANSWER_REPLY =
  "I could not answer that one. Andrew will follow up personally if you email andrew@flowrate.agency or book a free call at calendly.com/flowrate/30min.";
const SLOW_DOWN_REPLY =
  "You've sent a lot of messages in a short time, so I'm taking a short break. You can reach Andrew directly at andrew@flowrate.agency or book a free call at calendly.com/flowrate/30min.";

// Created on first use so a missing API key fails one request, not the whole module.
let client: Anthropic | null = null;
function getClient() {
  client ??= new Anthropic({ timeout: 25_000, maxRetries: 1 });
  return client;
}

export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (Number(req.headers.get("content-length") || 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }
  if (isRateLimited(`chat:${clientIp(req)}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json({ reply: SLOW_DOWN_REPLY }, { status: 429 });
  }

  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const messages: Anthropic.Beta.BetaMessageParam[] = incoming
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content.slice(0, MAX_MESSAGE_LENGTH),
    }));

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "No message to answer" }, { status: 400 });
  }

  try {
    const response = await getClient().beta.messages.create({
      model: MODEL,
      // Thinking is always on for this model and counts against max_tokens, so leave headroom
      // for a short visible reply. Low effort suits a quick sales-assistant chat.
      max_tokens: 4000,
      output_config: { effort: "low" },
      // If the model declines on a safety classifier, the API re-runs the request on the fallback.
      betas: ["server-side-fallback-2026-06-01"],
      fallbacks: [{ model: "claude-opus-4-8" }],
      system: [
        {
          type: "text",
          text: AGENCY_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json({ reply: NO_ANSWER_REPLY });
    }

    const reply = response.content
      .filter((block): block is Anthropic.Beta.BetaTextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    return NextResponse.json({ reply: reply || NO_ANSWER_REPLY });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error(`Chat API error ${error.status}: ${error.message}`);
    } else {
      console.error("Chat API unexpected error:", error);
    }
    return NextResponse.json({ reply: FALLBACK_REPLY }, { status: 502 });
  }
}

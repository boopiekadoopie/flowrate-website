import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { AGENCY_SYSTEM_PROMPT } from "@/lib/agency-knowledge";

export const runtime = "nodejs";

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 2000;

const client = new Anthropic();

export async function POST(req: Request) {
  let body: { messages?: { role: string; content: string }[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const incoming = Array.isArray(body.messages) ? body.messages : [];
  const messages: Anthropic.MessageParam[] = incoming
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
    const response = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 600,
      system: [
        {
          type: "text",
          text: AGENCY_SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
    });

    const reply = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("")
      .trim();

    if (!reply) {
      return NextResponse.json({
        reply:
          "I could not answer that one. Andrew will follow up personally if you email andrew@flowrate.agency or book a free call at calendly.com/flowrate/30min.",
      });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error(`Chat API error ${error.status}: ${error.message}`);
    } else {
      console.error("Chat API unexpected error:", error);
    }
    return NextResponse.json(
      {
        reply:
          "The chat is having trouble right now. You can reach Andrew directly at andrew@flowrate.agency or book a free call at calendly.com/flowrate/30min.",
      },
      { status: 200 },
    );
  }
}

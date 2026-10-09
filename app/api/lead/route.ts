import { NextResponse } from "next/server";
import { Resend } from "resend";
import { clientIp, isAllowedOrigin, isRateLimited } from "@/lib/requestGuard";

export const runtime = "nodejs";

const LEAD_TO = "andrew@flowrate.agency";
const MAX_FIELD = 300;
const MAX_MESSAGE = 3000;
const MAX_BODY_BYTES = 20_000;
const MIN_FILL_MS = 3000; // a person takes longer than this to fill the form
const EMAIL_RE = /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[a-z]{2,}$/i;

type LeadBody = {
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  message?: string;
  website?: string; // honeypot: hidden from people, bots fill it
  startedAt?: number; // when the visitor started typing
};

function clean(value: unknown, max = MAX_FIELD): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/* For the email subject: one line, no control characters, short. */
function oneLine(value: string, max = 80): string {
  return value.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (Number(req.headers.get("content-length") || 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Request too large" }, { status: 413 });
  }
  if (isRateLimited(`lead:${clientIp(req)}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many enquiries, please email instead" }, { status: 429 });
  }

  let body: LeadBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const lead = {
    name: clean(body.name),
    phone: clean(body.phone),
    email: clean(body.email),
    company: clean(body.company),
    message: clean(body.message, MAX_MESSAGE),
  };

  // Bots: pretend it worked so they don't adapt, but send nothing.
  const elapsed = typeof body.startedAt === "number" ? Date.now() - body.startedAt : 0;
  if (clean(body.website) || elapsed < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  if (!lead.name || !EMAIL_RE.test(lead.email)) {
    return NextResponse.json({ error: "Name and a valid email are required" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Not configured yet: tell the client so it can fall back to mailto.
    console.error("Lead received but RESEND_API_KEY is not set; the visitor was offered email instead.");
    return NextResponse.json({ error: "Email delivery not configured" }, { status: 503 });
  }

  const text = [
    "New enquiry from the website.",
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Business: ${lead.company || "not given"}`,
    `Phone: ${lead.phone || "not given"}`,
    "",
    "The job they want to stop doing by hand:",
    lead.message || "(not given)",
  ].join("\n");

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from: process.env.LEAD_FROM || "Flowrate Website <onboarding@resend.dev>",
    to: [LEAD_TO],
    replyTo: lead.email,
    subject: `New enquiry: ${oneLine(lead.name)}${lead.company ? ` (${oneLine(lead.company)})` : ""}`,
    text,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id: data?.id });
}

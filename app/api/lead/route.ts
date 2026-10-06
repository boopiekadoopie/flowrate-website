import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

const LEAD_TO = "andrew@flowrate.agency";
const MAX_FIELD = 300;
const MAX_MESSAGE = 3000;

type LeadBody = {
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  message?: string;
};

function clean(value: unknown, max = MAX_FIELD): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
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

  if (!lead.name || !lead.email || !lead.email.includes("@")) {
    return NextResponse.json({ error: "Name and a valid email are required" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Not configured yet: tell the client so it can fall back to mailto.
    console.error("Lead received but RESEND_API_KEY is not set:", JSON.stringify(lead));
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
    subject: `New enquiry: ${lead.name}${lead.company ? ` (${lead.company})` : ""}`,
    text,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true, id: data?.id });
}

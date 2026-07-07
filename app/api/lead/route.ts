import { NextResponse } from "next/server";

export const runtime = "nodejs";

const LEAD_TO = "andrew@flowrate.agency";
const MAX_FIELD = 300;

type LeadBody = {
  name?: string;
  phone?: string;
  email?: string;
  website?: string;
  jobs?: string;
};

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().slice(0, MAX_FIELD) : "";
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
    website: clean(body.website),
    jobs: clean(body.jobs),
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
    "New free breakdown request from the website.",
    "",
    `Name: ${lead.name}`,
    `Phone: ${lead.phone || "not given"}`,
    `Email: ${lead.email}`,
    `Website: ${lead.website || "none / not given"}`,
    `Jobs per week: ${lead.jobs || "not given"}`,
    "",
    "SOP: docs/free-breakdown-sop.md in the flowrate-website repo.",
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.LEAD_FROM || "Flowrate Website <onboarding@resend.dev>",
        to: [LEAD_TO],
        reply_to: lead.email,
        subject: `New lead: ${lead.name} (free breakdown request)`,
        text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error(`Resend error ${res.status}: ${detail}`);
      return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Lead email send failed:", error);
    return NextResponse.json({ error: "Email delivery failed" }, { status: 502 });
  }
}

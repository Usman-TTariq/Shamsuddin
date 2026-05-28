import { NextResponse } from "next/server";
import {
  submitPrismatechLead,
  type LeadPayload,
  type LeadSource,
} from "@/lib/prismatech-leads";

/**
 * Server proxy to FormSubmit. On Vercel/production, FormSubmit often returns Cloudflare
 * “Just a moment…” HTML — use submitPrismatechLead() from the browser instead (see EngageLeadModal).
 */

const LEAD_SOURCES: LeadSource[] = ["popup", "contact_desktop", "contact_mobile"];

function parseLeadSource(value: unknown): LeadSource {
  if (typeof value === "string" && LEAD_SOURCES.includes(value as LeadSource)) {
    return value as LeadSource;
  }
  return "popup";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const record = body as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name : "";
  const email = typeof record.email === "string" ? record.email : "";
  const phone = typeof record.phone === "string" ? record.phone : "";
  const message = typeof record.message === "string" ? record.message : "";
  const source = parseLeadSource(record.source);

  if (!name.trim() || !email.trim() || !phone.trim()) {
    return NextResponse.json(
      { ok: false, error: "Name, email, and phone are required." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const payload: LeadPayload = {
    name,
    email,
    phone,
    message,
    source,
  };

  const result = await submitPrismatechLead(payload);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

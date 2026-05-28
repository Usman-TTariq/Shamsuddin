/** Inbox for all site leads (popup + contact forms). */
export const PRISMATECH_LEAD_EMAIL = "Waheedshamsuddin@gmail.com";

export type LeadSource = "popup" | "contact_desktop" | "contact_mobile";

export type LeadPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
  source: LeadSource;
};

type FormSubmitSuccess = { success?: boolean; message?: string };

/**
 * Delivers lead to {@link PRISMATECH_LEAD_EMAIL} via FormSubmit (no API key).
 * First submission from a new domain may require activating the inbox (FormSubmit sends a one-time link).
 *
 * Call from the **browser** (popup / contact forms). Server-side calls from Vercel/AWS IPs are often
 * blocked by Cloudflare (“Just a moment…” HTML instead of JSON).
 */
export async function submitPrismatechLead(
  payload: LeadPayload
): Promise<{ ok: true } | { ok: false; error: string }> {
  const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(PRISMATECH_LEAD_EMAIL)}`;
  const body = {
    name: payload.name.trim(),
    email: payload.email.trim(),
    phone: payload.phone.trim(),
    message: payload.message.trim(),
    _subject: `Prismatech lead — ${payload.source.replace(/_/g, " ")}`,
    _template: "table",
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const raw = await res.text();

    if (
      raw.includes("Just a moment") ||
      raw.trimStart().startsWith("<!DOCTYPE") ||
      raw.trimStart().startsWith("<html")
    ) {
      return {
        ok: false,
        error:
          "Form delivery was blocked (bot protection). Submit from the website in your browser.",
      };
    }

    let data: FormSubmitSuccess = {};
    try {
      data = JSON.parse(raw) as FormSubmitSuccess;
    } catch {
      /* FormSubmit sometimes returns non-JSON on error */
    }

    if (!res.ok) {
      return {
        ok: false,
        error: data.message || raw.slice(0, 180) || `Request failed (${res.status})`,
      };
    }

    if (data.success === false) {
      return { ok: false, error: data.message || "Submission was not accepted." };
    }

    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

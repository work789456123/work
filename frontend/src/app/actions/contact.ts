"use server";

function getBackendUrl(): string {
  const env = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (env !== undefined && env !== "") return env;
  if (process.env.NODE_ENV === "production") return "";
  return "http://localhost:8000";
}

export type ContactActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function submitContactMessage(data: {
  name: string;
  email: string;
  message: string;
}): Promise<ContactActionResult> {
  const name = data.name.trim();
  const email = data.email.trim();
  const message = data.message.trim();
  if (!name || !email || !message) {
    return { ok: false, error: "Please fill in all fields." };
  }

  const base = getBackendUrl();
  if (!base && process.env.NODE_ENV === "production") {
    return { ok: false, error: "Service is not configured." };
  }

  try {
    const res = await fetch(`${base}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    const json = (await res.json().catch(() => ({}))) as { message?: string; detail?: string };
    if (!res.ok) {
      const detail = json.detail;
      return {
        ok: false,
        error: typeof detail === "string" ? detail : "Failed to send message",
      };
    }
    return {
      ok: true,
      message: typeof json.message === "string" ? json.message : "Message sent",
    };
  } catch {
    return { ok: false, error: "Failed to send message" };
  }
}

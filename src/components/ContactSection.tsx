"use client";

import { useState } from "react";
import { profile } from "../../data/profile";

/** Web3Forms access key. Public by design (it only allows sending to Omar's inbox). */
const FORM_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Fields = { name: string; email: string; subject: string; message: string };
type Status = "idle" | "sending" | "success" | "error";

function validate(f: Fields): Partial<Record<keyof Fields, string>> {
  const errors: Partial<Record<keyof Fields, string>> = {};
  if (f.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(f.email.trim())) errors.email = "Please enter a valid email address.";
  if (f.message.trim().length < 10) errors.message = "Please write at least 10 characters.";
  return errors;
}

const mailtoHref = (f?: Fields) =>
  f
    ? `mailto:${profile.email}?subject=${encodeURIComponent(f.subject || `Message from ${f.name}`)}&body=${encodeURIComponent(
        `${f.message}\n\n${f.name} <${f.email}>`
      )}`
    : `mailto:${profile.email}`;

export default function ContactSection() {
  const [fields, setFields] = useState<Fields>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 2500);
    } catch {
      // Clipboard can be blocked; the address is still visible to copy by hand.
    }
  };

  const update = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length) return;

    // No form service configured: fall back to the visitor's mail app.
    if (!FORM_KEY) {
      window.location.href = mailtoHref(fields);
      return;
    }

    const honeypot = (e.currentTarget.elements.namedItem("botcheck") as HTMLInputElement | null)?.checked;
    if (honeypot) return;

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: FORM_KEY,
          subject: fields.subject || `Portfolio message from ${fields.name}`,
          from_name: fields.name,
          name: fields.name,
          email: fields.email,
          message: fields.message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error("send failed");
      setStatus("success");
      setFields({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputClass = (key: keyof Fields) =>
    `w-full px-4 py-2.5 rounded-xl border bg-surface text-ink text-sm placeholder:text-subtle ${
      errors[key] ? "border-red-600 dark:border-red-400" : "border-line-strong"
    }`;

  const fieldError = (key: keyof Fields) =>
    errors[key] ? (
      <p id={`${key}-error`} className="mt-1 text-xs font-medium text-red-700 dark:text-red-300">
        {errors[key]}
      </p>
    ) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-5">
        <div className="card p-6 sm:p-8 rounded-xl space-y-6 border border-line">
          <div>
            <h3 className="text-xl font-bold text-ink mb-2 font-display">Let&apos;s connect</h3>
            <p className="text-sm text-muted leading-relaxed">
              Open to PhD positions, research collaborations in CFD and scientific machine learning, and aerospace R&D roles.
            </p>
          </div>

          <ul className="space-y-3">
            {[
              { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
              ...profile.academicEmails.map((a) => ({ label: `${a.label} email`, value: a.address, href: `mailto:${a.address}` })),
              { label: "Phone / WhatsApp", value: profile.phone, href: `tel:${profile.phone.replace(/\s+/g, "")}` },
            ].map((item) => (
              <li
                key={item.value}
                className="p-4 rounded-lg bg-surface-2 border border-line flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-subtle">
                    {item.label}
                  </span>
                  <a href={item.href} className="text-sm font-semibold text-ink break-all hover:underline">
                    {item.value}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => copy(item.value)}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-surface-2 text-ink hover:bg-line flex-shrink-0"
                >
                  {copied === item.value ? "Copied ✓" : "Copy"}
                  <span className="sr-only"> {item.label}</span>
                </button>
              </li>
            ))}
            <li className="p-4 rounded-lg bg-surface-2 border border-line">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-subtle">
                Affiliation
              </span>
              <span className="text-sm font-semibold text-ink">{profile.affiliation.location}</span>
            </li>
          </ul>

          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2.5 px-4 rounded-xl text-xs font-bold bg-[#0A66C2] text-white hover:opacity-90"
            >
              LinkedIn
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2.5 px-4 rounded-xl text-xs font-bold bg-ink text-bg hover:opacity-90"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="lg:col-span-7">
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-labelledby="contact-form-title"
          className="card p-6 sm:p-8 rounded-xl border border-line space-y-4"
        >
          <h3 id="contact-form-title" className="text-xl font-bold text-ink mb-2 font-display">
            Send a message
          </h3>

          {/* Honeypot: hidden from people, often filled in by bots. */}
          <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold text-ink mb-1.5">
                Your name
              </label>
              <input
                id="contact-name"
                type="text"
                autoComplete="name"
                value={fields.name}
                onChange={update("name")}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
                className={inputClass("name")}
              />
              {fieldError("name")}
            </div>
            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold text-ink mb-1.5">
                Your email
              </label>
              <input
                id="contact-email"
                type="email"
                autoComplete="email"
                value={fields.email}
                onChange={update("email")}
                placeholder="name@university.edu"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                className={inputClass("email")}
              />
              {fieldError("email")}
            </div>
          </div>

          <div>
            <label htmlFor="contact-subject" className="block text-xs font-semibold text-ink mb-1.5">
              Subject <span className="font-normal text-subtle">(optional)</span>
            </label>
            <input id="contact-subject" type="text" value={fields.subject} onChange={update("subject")} className={inputClass("subject")} />
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-xs font-semibold text-ink mb-1.5">
              Message
            </label>
            <textarea
              id="contact-message"
              rows={5}
              value={fields.message}
              onChange={update("message")}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
              className={`${inputClass("message")} resize-y`}
            />
            {fieldError("message")}
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="px-6 py-3 rounded-xl bg-accent hover:bg-accent-strong disabled:opacity-60 text-on-accent font-bold text-sm transition-colors"
            >
              {status === "sending" ? "Sending…" : FORM_KEY ? "Send message" : "Open in email app"}
            </button>

            <p role="status" aria-live="polite" className="text-sm font-medium">
              {status === "success" && (
                <span className="text-good">Thanks! Your message was sent.</span>
              )}
              {status === "error" && (
                <span className="text-red-700 dark:text-red-300">
                  Sending failed.{" "}
                  <a href={mailtoHref(fields)} className="underline">
                    Email me directly
                  </a>{" "}
                  instead.
                </span>
              )}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { submitPrismatechLead } from "@/lib/prismatech-leads";

const TRIGGER_SELECTOR = ".tq-engage-modal-trigger";

export function EngageLeadModal() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const titleId = useId();
  const descId = useId();
  const errorId = useId();
  const firstFieldRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setSubmitted(false);
    setSubmitting(false);
    setSubmitError(null);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onTriggerClick = (e: MouseEvent) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      const trigger = t.closest(TRIGGER_SELECTOR);
      if (!trigger) return;
      e.preventDefault();
      e.stopPropagation();
      setSubmitted(false);
      setSubmitError(null);
      setOpen(true);
    };
    document.addEventListener("click", onTriggerClick, true);
    return () => document.removeEventListener("click", onTriggerClick, true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      close();
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open]);

  const onBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) close();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;

    const fd = new FormData(form);
    const name = String(fd.get("fullName") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").trim();
    const message = String(fd.get("about") ?? "").trim();

    setSubmitting(true);
    setSubmitError(null);

    try {
      const result = await submitPrismatechLead({
        name,
        email,
        phone,
        message,
        source: "popup",
      });

      if (!result.ok) {
        setSubmitError(result.error);
        return;
      }

      setSubmitted(true);
      form.reset();
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    open ? (
      <div
        className="tq-engage-modal-backdrop"
        role="presentation"
        onMouseDown={onBackdropMouseDown}
      >
        <div
          className="tq-engage-modal-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descId}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="tq-engage-modal-header">
            <div className="tq-engage-modal-header-text">
              <h2 id={titleId} className="tq-engage-modal-title text-white">
                We&apos;d love to hear from you
              </h2>
              <p id={descId} className="tq-engage-modal-subtitle text-white">
                Share your details and we&apos;ll get back to you.
              </p>
            </div>
            <button
              type="button"
              className="tq-engage-modal-close"
              aria-label="Close dialog"
              onClick={close}
              disabled={submitting}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="tq-engage-modal-body">
            {submitted ? (
              <div className="tq-engage-modal-thanks">
                <p className="tq-engage-modal-thanks-title">Thank you!</p>
                <p className="mb-0">
                  Your details were sent successfully. We will be in touch soon.
                </p>
                <button
                  type="button"
                  className="tq-engage-modal-btn tq-engage-modal-btn-primary"
                  onClick={close}
                >
                  Close
                </button>
              </div>
            ) : (
              <form className="tq-engage-modal-form" onSubmit={onSubmit}>
                {submitError ? (
                  <p
                    id={errorId}
                    className="tq-engage-modal-error mb-0"
                    role="alert"
                  >
                    {submitError}
                  </p>
                ) : null}
                <div className="tq-engage-modal-field">
                  <label
                    className="tq-engage-modal-label"
                    htmlFor="tq-engage-fullname"
                  >
                    Full Name <span className="tq-engage-modal-req">*</span>
                  </label>
                  <input
                    ref={firstFieldRef}
                    id="tq-engage-fullname"
                    name="fullName"
                    className="tq-engage-modal-input"
                    type="text"
                    autoComplete="name"
                    required
                    disabled={submitting}
                    placeholder="Your full name"
                  />
                </div>
                <div className="tq-engage-modal-field">
                  <label
                    className="tq-engage-modal-label"
                    htmlFor="tq-engage-email"
                  >
                    Email <span className="tq-engage-modal-req">*</span>
                  </label>
                  <input
                    id="tq-engage-email"
                    name="email"
                    className="tq-engage-modal-input"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={submitting}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="tq-engage-modal-field">
                  <label
                    className="tq-engage-modal-label"
                    htmlFor="tq-engage-phone"
                  >
                    Phone <span className="tq-engage-modal-req">*</span>
                  </label>
                  <input
                    id="tq-engage-phone"
                    name="phone"
                    className="tq-engage-modal-input"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    required
                    disabled={submitting}
                    placeholder="+1 555 000 0000"
                  />
                </div>
                <div className="tq-engage-modal-field">
                  <label
                    className="tq-engage-modal-label"
                    htmlFor="tq-engage-about"
                  >
                    Tell us about yourself
                  </label>
                  <textarea
                    id="tq-engage-about"
                    name="about"
                    className="tq-engage-modal-input tq-engage-modal-textarea"
                    rows={4}
                    disabled={submitting}
                    placeholder="Optional — interests, questions, or how we can help"
                  />
                </div>
                <div className="tq-engage-modal-actions">
                  <button
                    type="button"
                    className="tq-engage-modal-btn tq-engage-modal-btn-ghost"
                    onClick={close}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="tq-engage-modal-btn tq-engage-modal-btn-primary"
                    disabled={submitting}
                    aria-busy={submitting}
                  >
                    {submitting ? "Sending…" : "Submit"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    ) : null,
    document.body
  );
}

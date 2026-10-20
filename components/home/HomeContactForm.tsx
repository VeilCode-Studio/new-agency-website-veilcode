"use client";

import {
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

const services = [
  "Web Solutions (Design & Development)",
  "Mobile Application Development",
  "AI Automation",
  "Multiple Services",
  "Not Sure Yet",
];
const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function HomeContactForm() {
  const hydrated = useSyncExternalStore(subscribe, clientReady, serverReady);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const pending = useRef(false);
  const focusResult = useCallback((element: HTMLDivElement | null) => {
    element?.focus();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    pending.current = true;
    setStatus("pending");
    setError("");
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(fields)),
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok)
        throw new Error(
          "We couldn’t send your message. Please try again or email frank@veilcode.studio.",
        );
      setStatus("success");
      form.reset();
    } catch (cause) {
      setError(
        cause instanceof Error && cause.name !== "TimeoutError"
          ? cause.message
          : "The request timed out. Please try again or email frank@veilcode.studio.",
      );
      setStatus("error");
    } finally {
      pending.current = false;
    }
  }

  return (
    <div className="home-contact-panel">
      <span className="home-eyebrow">Let’s make it happen</span>
      <h2 id="home-form-title">
        Tell us what you
        <br />
        have in mind.
      </h2>
      <p>
        A new website, a better product, or less manual work. It starts with a
        conversation.
      </p>
      {status === "success" ? (
        <div
          className="home-form-success"
          role="status"
          tabIndex={-1}
          ref={focusResult}
        >
          <CheckCircle2 size={32} aria-hidden="true" />
          <h3>Message received.</h3>
          <p>
            Thank you for getting in touch. Check your inbox for your
            confirmation.
          </p>
          <button
            className="home-button home-button-outline"
            type="button"
            onClick={() => setStatus("idle")}
          >
            Send another message
          </button>
        </div>
      ) : (
        <form
          method="post"
          onSubmit={submit}
          aria-labelledby="home-form-title"
          aria-busy={status === "pending"}
        >
          <div className="home-form-row">
            <label htmlFor="home-name">
              Full name <span aria-hidden="true">*</span>
              <input
                id="home-name"
                name="name"
                autoComplete="name"
                required
                maxLength={120}
                placeholder="Your name"
              />
            </label>
            <label htmlFor="home-email">
              Email address <span aria-hidden="true">*</span>
              <input
                id="home-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={320}
                placeholder="you@company.com"
              />
            </label>
          </div>
          <label htmlFor="home-company">
            Company <span className="home-optional">(optional)</span>
            <input
              id="home-company"
              name="company"
              autoComplete="organization"
              maxLength={160}
              placeholder="Your company"
            />
          </label>
          <label htmlFor="home-service">
            I’m interested in <span aria-hidden="true">*</span>
            <select id="home-service" name="service" required defaultValue="">
              <option value="" disabled>
                Select a service
              </option>
              {services.map((service) => (
                <option key={service}>{service}</option>
              ))}
            </select>
          </label>
          <label htmlFor="home-message">
            What would you like to build? <span aria-hidden="true">*</span>
            <textarea
              id="home-message"
              name="message"
              required
              minLength={20}
              maxLength={5000}
              rows={4}
              placeholder="A little about your project, your goals, and what success looks like…"
            />
          </label>
          {error ? (
            <p className="home-form-error" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={!hydrated || status === "pending"}
            className="home-button home-button-primary"
          >
            {status === "pending" ? "Sending your message…" : "Send Message"}
            <ArrowUpRight size={17} aria-hidden="true" />
          </button>
          <p className="home-form-note">
            By submitting, you agree to our{" "}
            <a href="/privacy-policy">privacy policy</a>.
          </p>
          <noscript>
            <p>
              To discuss your project without JavaScript,{" "}
              <a href="mailto:frank@veilcode.studio">
                email frank@veilcode.studio
              </a>
              .
            </p>
          </noscript>
        </form>
      )}
    </div>
  );
}

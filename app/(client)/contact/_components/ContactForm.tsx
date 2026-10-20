"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type SyntheticEvent,
} from "react";
import { PrimaryButton } from "@/components/extras/Primitives";
import { toast } from "sonner";
import axios from "axios";

interface FormData {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  timeline: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
}

type SubmitState = "idle" | "loading" | "success" | "error";

const SERVICES = [
  "Web Solutions (Design & Development)",
  "Mobile Application Development",
  "AI Automation",
  "Multiple Services",
  "Not Sure Yet",
] as const;

const BUDGETS = [
  "Under $1,500",
  "$1,500 – $5,000",
  "$5,000 – $15,000",
  "$15,000 – $30,000",
  "$30,000 - $60,000",
  "$60,000",
  "Let's Discuss",
] as const;

const TIMELINES = [
  "ASAP — urgent project",
  "Within 1 month",
  "1–3 months",
  "3–6 months",
  "Just exploring for now",
] as const;

const inputBase =
  "w-full bg-surface-hi border border-line rounded-lg px-4 py-3.5 \
  font-sans text-sm text-ink placeholder:text-ink-faint \
  outline-none transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-200 \
  focus:border-brand focus:shadow-[0_0_0_3px_var(--color-brand-dim)] \
  hover:border-line-hi";

const inputError =
  "border-red-500/60 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]";

function Label({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block font-sans text-[13px] font-medium text-ink-muted mb-2"
    >
      {children}
      {required && (
        <span className="text-brand ml-1" aria-hidden>
          *
        </span>
      )}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  return (
    <>
      {message && (
        <p
          className="public-form-error mt-1.5 font-sans text-[12px]"
          role="alert"
        >
          {message}
        </p>
      )}
    </>
  );
}

function PillSelector<T extends string>({
  id,
  options,
  value,
  onChange,
  error,
}: {
  id: string;
  options: readonly T[];
  value: string;
  onChange: (val: T) => void;
  error?: string;
}) {
  return (
    <div>
      <div id={id} role="group" className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            aria-pressed={value === opt}
            onClick={() => onChange(opt)}
            className={`font-sans text-[13px] px-3.5 py-2 rounded-lg border
              transition-[color,background-color,border-color,box-shadow,transform,opacity] duration-150 cursor-pointer outline-none
              focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2
              focus-visible:ring-offset-page
              ${
                value === opt
                  ? "bg-brand-dim border-brand-border text-brand"
                  : "bg-surface-hi border-line text-ink-muted hover:border-line-hi hover:text-ink"
              }`}
          >
            {opt}
          </button>
        ))}
      </div>
      <FieldError message={error} />
    </div>
  );
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Your name is required.";
  if (!data.email.trim()) errors.email = "Your email address is required.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Please enter a valid email address.";
  if (!data.service) errors.service = "Please select a service.";
  if (!data.message.trim())
    errors.message = "Please tell us a little about your project.";
  else if (data.message.trim().length < 20)
    errors.message = "Please provide a bit more detail (20+ characters).";
  return errors;
}

function SuccessMessage({ onReset }: { onReset: () => void }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center text-center py-16 px-8"
    >
      <div
        className="size-16 rounded-full bg-brand-dim border border-brand-border
        flex items-center justify-center mb-6"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 13l4 4L19 7"
            stroke="var(--color-brand)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="font-display text-2xl font-bold tracking-tight text-ink mb-3">
        Message Received!
      </h2>
      <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-90 mb-8">
        Thank you for reaching out. We&apos;ll get back to you within one
        business day.
      </p>
      <PrimaryButton onClick={onReset} className="px-8 py-3">
        Send Another Message
      </PrimaryButton>
    </div>
  );
}

const EMPTY: FormData = {
  name: "",
  email: "",
  company: "",
  service: "",
  budget: "",
  timeline: "",
  message: "",
};

export function ContactForm({ standalone = false }: { standalone?: boolean }) {
  const [formData, setFormData] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [showDetails, setShowDetails] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  function handleServiceChange(val: string) {
    setFormData((prev) => ({ ...prev, service: val }));
    if (errors.service) setErrors((prev) => ({ ...prev, service: undefined }));
  }

  const resetForm = () => {
    setFormData(EMPTY);
    setErrors({});
    setSubmitState("idle");
    setShowDetails(false);
  };

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    const newErrors = validate(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const first = Object.keys(newErrors)[0];
      const target =
        first === "service"
          ? document.querySelector<HTMLButtonElement>("#service-group button")
          : document.getElementById(first);
      target?.focus();
      return;
    }
    setSubmitState("loading");

    try {
      const { status, data } = await axios.post("/api/messages", formData);

      if (status === 201 && data?.success) {
        setSubmitState("success");
        setFormData(EMPTY);
        toast.success(data?.message || "Check your email!");
      } else {
        throw new Error("Your message could not be sent. Please try again.");
      }
    } catch (error) {
      console.log("Something went wrong!", error);
      setSubmitState("error");
      toast.error(
        (error as Error).message || "Something went wrong! Try again!",
      );
    }
  }

  return (
    <div className={standalone ? "w-full" : "lg:col-span-7"} id="form-message">
      <noscript>
        <p className="mb-5 rounded-xl border border-line bg-surface p-5 text-sm leading-relaxed">
          Enable JavaScript to use the enquiry form, or{" "}
          <a
            className="text-brand underline"
            href="mailto:support@veilcode.studio"
          >
            email support@veilcode.studio
          </a>
          .
        </p>
      </noscript>
      <div className="bg-surface border border-line rounded-2xl overflow-hidden">
        {/* Form header */}
        <div className="px-8 py-6 border-b border-line flex items-center gap-3">
          <div className="size-2 rounded-full bg-brand shadow-[0_0_8px_var(--color-brand)]" />
          <span className="font-mono text-[11px] tracking-widest uppercase text-ink-muted">
            Project Enquiry Form
          </span>
        </div>

        <>
          {submitState === "success" ? (
            <SuccessMessage key="success" onReset={resetForm} />
          ) : (
            <form
              key="form"
              method="post"
              aria-busy={submitState === "loading"}
              onSubmit={handleSubmit}
              noValidate
              className="p-8 space-y-7"
            >
              <fieldset
                disabled={!ready || submitState === "loading"}
                aria-label="Project enquiry"
                className="min-w-0 space-y-7 border-0 p-0"
              >
                {/* Row 1 — Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name" required>
                      Full Name
                    </Label>
                    <input
                      id="name"
                      name="name"
                      required
                      aria-invalid={Boolean(errors.name)}
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`${inputBase} ${errors.name ? inputError : ""}`}
                    />
                    <FieldError message={errors.name} />
                  </div>
                  <div>
                    <Label htmlFor="email" required>
                      Email Address
                    </Label>
                    <input
                      id="email"
                      name="email"
                      required
                      aria-invalid={Boolean(errors.email)}
                      type="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`${inputBase} ${errors.email ? inputError : ""}`}
                    />
                    <FieldError message={errors.email} />
                  </div>
                </div>

                {/* Row 2 — Company */}
                <div>
                  <Label htmlFor="service-group" required>
                    Which service are you interested in?
                  </Label>
                  <PillSelector
                    id="service-group"
                    options={SERVICES}
                    value={formData.service}
                    onChange={handleServiceChange}
                    error={errors.service}
                  />
                </div>

                {/* Project context */}
                <div>
                  <Label htmlFor="message" required>
                    Tell Us About Your Project
                  </Label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="What are you building, or what problem would you like us to solve?"
                    value={formData.message}
                    onChange={handleChange}
                    className={`${inputBase} resize-none ${
                      errors.message ? inputError : ""
                    }`}
                  />
                  <div className="flex items-start justify-between mt-1">
                    <FieldError message={errors.message} />
                    <span className="font-mono text-[10px] text-ink-faint ml-auto">
                      {formData.message.length} chars
                    </span>
                  </div>
                </div>

                <div className="border-t border-line pt-5">
                  <button
                    type="button"
                    onClick={() => setShowDetails((value) => !value)}
                    aria-expanded={showDetails}
                    aria-controls="optional-project-details"
                    className="flex w-full items-center justify-between text-left font-sans text-sm font-medium
                    text-ink-muted hover:text-ink transition-colors cursor-pointer"
                  >
                    <span>
                      Add project details{" "}
                      <span className="font-normal text-ink-faint">
                        (optional)
                      </span>
                    </span>
                    <span
                      aria-hidden
                      className={`text-brand transition-transform duration-200 ${showDetails ? "rotate-45" : ""}`}
                    >
                      +
                    </span>
                  </button>
                  <>
                    {showDetails && (
                      <div
                        id="optional-project-details"
                        className="overflow-hidden"
                      >
                        <div className="space-y-6 pt-6">
                          <div>
                            <Label htmlFor="company">
                              Company / Organisation
                            </Label>
                            <input
                              id="company"
                              name="company"
                              type="text"
                              autoComplete="organization"
                              placeholder="Your company (optional)"
                              value={formData.company}
                              onChange={handleChange}
                              className={inputBase}
                            />
                          </div>
                          <div>
                            <Label htmlFor="budget-group">
                              Approximate Budget
                            </Label>
                            <PillSelector
                              id="budget-group"
                              options={BUDGETS}
                              value={formData.budget}
                              onChange={(val) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  budget: val,
                                }))
                              }
                            />
                          </div>
                          <div>
                            <Label htmlFor="timeline-group">
                              Project Timeline
                            </Label>
                            <PillSelector
                              id="timeline-group"
                              options={TIMELINES}
                              value={formData.timeline}
                              onChange={(val) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  timeline: val,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                </div>

                {/* Submit */}
                <div>
                  {submitState === "error" && (
                    <p
                      className="mb-4 font-sans public-form-error text-sm bg-red-500/10
                    border border-red-500/20 rounded-lg px-4 py-3"
                    >
                      Something went wrong. Please try again or email us
                      directly at{" "}
                      <a
                        href="mailto:support@veilcode.studio"
                        className="underline"
                      >
                        support@veilcode.studio
                      </a>
                    </p>
                  )}

                  <PrimaryButton
                    type="submit"
                    disabled={submitState === "loading"}
                    className="w-full justify-center py-4! text-[15px]!
                    disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitState === "loading" ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin size-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-hidden
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray="31.4"
                            strokeDashoffset="10"
                          />
                        </svg>
                        Sending…
                      </span>
                    ) : (
                      "Start the conversation →"
                    )}
                  </PrimaryButton>

                  <p className="mt-4 text-center font-sans text-[12px] text-ink-faint">
                    We respond within one business day. No spam, ever.
                  </p>
                </div>
              </fieldset>
            </form>
          )}
        </>
      </div>
    </div>
  );
}

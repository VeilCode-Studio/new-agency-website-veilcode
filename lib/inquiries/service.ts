import { db } from "../../db/drizzle.ts";
import { clientInquiries } from "../../db/schema.ts";
import { resend } from "../resend.ts";
import {
  adminLeadConfirmationTemplate,
  clientContactFormTemplate,
} from "../template.ts";
import {
  normalizeInquiryBudget,
  normalizeInquiryGoals,
  normalizeInquiryService,
  normalizeInquiryTimeline,
  type InquiryBudget,
  type InquiryGoal,
  type InquiryService,
  type InquiryTimeline,
} from "./normalize.ts";

export type CreateInquiryInput = {
  name?: string | null;
  email?: string | null;
  company?: string | null;
  service?: string | null;
  budget?: string | null;
  timeline?: string | null;
  message?: string | null;
  goals?: string[] | null;
};

type InquiryInsertValues = {
  name: string;
  email: string;
  company: string | null;
  service: InquiryService;
  budget: InquiryBudget | null;
  timeline: InquiryTimeline | null;
  message: string;
  goals: InquiryGoal[];
};

type EmailPayload = {
  from: string;
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
};

export type InquiryServiceDeps = {
  insertInquiry?: (values: InquiryInsertValues) => Promise<{ id?: number }>;
  sendEmail?: (payload: EmailPayload) => Promise<{ error?: unknown }>;
};

function clean(value: string | null | undefined) {
  return value?.trim() ?? "";
}

function prepareInquiryValues(input: CreateInquiryInput): InquiryInsertValues {
  const values = {
    name: clean(input.name),
    email: clean(input.email),
    company: clean(input.company) || null,
    service: normalizeInquiryService(input.service),
    budget: normalizeInquiryBudget(input.budget),
    timeline: normalizeInquiryTimeline(input.timeline),
    message: clean(input.message),
    goals: normalizeInquiryGoals(input.goals),
  };

  if (!values.name || !values.email || !values.service || !values.message) {
    throw new Error("Name, email, service and message are required!");
  }

  return values;
}

async function insertInquiry(values: InquiryInsertValues) {
  const [inquiry] = await db.insert(clientInquiries).values(values).returning();
  return inquiry;
}

async function sendEmail(payload: EmailPayload) {
  return resend.emails.send(payload);
}

export async function createClientInquiry(
  input: CreateInquiryInput,
  deps: InquiryServiceDeps = {},
) {
  const values = prepareInquiryValues(input);
  const insert = deps.insertInquiry ?? insertInquiry;
  const mail = deps.sendEmail ?? sendEmail;

  const inquiry = await insert(values);
  if (!inquiry.id) {
    throw new Error("Failed to submit data! Try again");
  }

  const templateProps: ContactFormProps = {
    name: values.name,
    email: values.email,
    service: values.service,
    budget: values.budget ?? "",
    timeline: values.timeline ?? "",
    company: values.company ?? "",
    message: values.message,
    goals: values.goals,
  };

  const clientEmail = await mail({
    from: "VeilCode <frank@veilcode.studio>",
    to: [values.email],
    subject: "Thank you for reaching out - VeilCode",
    html: await clientContactFormTemplate(templateProps),
  });

  if (clientEmail.error) {
    throw new Error("Failed to send client confirmation email!");
  }

  const adminEmail = await mail({
    from: "VeilCode <frank@veilcode.studio>",
    to: ["ecommercedock@gmail.com", "frank@veilcode.studio"],
    replyTo: values.email,
    subject: `New Project Enquiry from ${values.name}`,
    html: await adminLeadConfirmationTemplate(templateProps),
  });

  if (adminEmail.error) {
    throw new Error("Failed to send lead alert email!");
  }

  return inquiry;
}

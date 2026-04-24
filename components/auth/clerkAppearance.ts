import { dark } from "@clerk/themes";

const sharedVariables = {
  colorPrimary: "#00E5FF",
  colorTextOnPrimaryBackground: "#080A0F",
  colorDanger: "#F87171",
  colorSuccess: "#10D9A0",
  colorWarning: "#F5A623",
  borderRadius: "0.65rem",
  fontFamily: '"DM Sans", sans-serif',
  fontFamilyButtons: '"DM Sans", sans-serif',
  fontSize: "0.9rem",
  spacingUnit: "0.9rem",
} as const;

const darkVariables = {
  ...sharedVariables,
  colorBackground: "#0D1117",
  colorText: "#F0F4F8",
  colorTextSecondary: "#8A9BB0",
  colorInputBackground: "#131920",
  colorInputText: "#F0F4F8",
  colorNeutral: "#F0F4F8",
} as const;

const lightVariables = {
  ...sharedVariables,
  colorBackground: "#FFFFFF",
  colorText: "#0B111B",
  colorTextSecondary: "#54627A",
  colorInputBackground: "#F4F6F9",
  colorInputText: "#0B111B",
  colorNeutral: "#0B111B",
} as const;

const sharedElements = {
  rootBox: "w-full",
  cardBox: "bg-transparent shadow-none w-full border-0",
  card: "bg-transparent shadow-none border-0 p-0",
  header: "mb-2",
  headerTitle: "font-display text-2xl font-semibold tracking-tight text-ink",
  headerSubtitle: "text-sm text-ink-muted",
  socialButtonsBlockButton:
    "border border-line bg-surface-hi hover:bg-surface-top text-ink normal-case",
  socialButtonsBlockButtonText: "text-ink font-medium",
  dividerRow: "my-4",
  dividerLine: "bg-line",
  dividerText: "text-ink-muted text-xs uppercase tracking-wider",
  formFieldLabel: "text-xs text-ink-muted uppercase tracking-wider",
  formFieldInput:
    "bg-base border border-line text-ink placeholder:text-ink-faint focus:border-brand focus:ring-0",
  formFieldInputShowPasswordButton: "text-ink-muted hover:text-ink",
  formButtonPrimary:
    "bg-brand text-base hover:bg-brand/90 normal-case font-semibold shadow-[0_0_24px_var(--color-brand-dim)] transition-all",
  footer: "bg-transparent border-0",
  footerAction: "text-ink-muted",
  footerActionText: "text-ink-muted text-sm",
  footerActionLink: "text-brand hover:text-brand/80 font-medium",
  identityPreview: "bg-surface-hi border border-line rounded-lg",
  identityPreviewText: "text-ink",
  identityPreviewEditButton: "text-brand",
  alertText: "text-sm",
  formFieldSuccessText: "text-svc-data",
  formFieldErrorText: "text-destructive",
  otpCodeFieldInput: "bg-base border border-line text-ink focus:border-brand",
  formResendCodeLink: "text-brand hover:text-brand/80",
  badge: "bg-brand-dim border border-brand-border text-brand",
  userButtonPopoverCard:
    "bg-surface border border-line shadow-[0_0_40px_var(--color-brand-dim)]",
  userButtonPopoverActionButton: "text-ink hover:bg-surface-hi",
  userButtonPopoverActionButtonText: "text-ink",
  userButtonPopoverFooter: "bg-surface border-t border-line",
} as const;

export function getClerkAppearance(theme: "light" | "dark") {
  return {
    baseTheme: theme === "dark" ? dark : undefined,
    variables: theme === "dark" ? darkVariables : lightVariables,
    elements: sharedElements,
  };
}

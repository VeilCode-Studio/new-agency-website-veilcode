import crypto from "crypto";
import type { EmailBlock } from "@/types/content";

function secret(): string {
  return (process.env.CLERK_SECRET_KEY ?? "newsletter-fallback") + ":unsub";
}

export function generateUnsubscribeToken(email: string): string {
  return crypto.createHmac("sha256", secret()).update(email.toLowerCase()).digest("hex");
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  try {
    const expected = generateUnsubscribeToken(email);
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(token, "hex"));
  } catch {
    return false;
  }
}

function renderBlock(block: EmailBlock): string {
  switch (block.type) {
    case "heading": {
      const fs = { 1: "26px", 2: "20px", 3: "16px" } as const;
      const fw = { 1: "800",  2: "700",  3: "600"  } as const;
      return `<h${block.level} style="margin:0 0 16px;font-size:${fs[block.level]};font-weight:${fw[block.level]};color:#e0e0e0;line-height:1.3;">${block.text}</h${block.level}>`;
    }

    case "text":
      return `<div style="margin:0 0 16px;font-size:15px;color:#aaa;line-height:1.7;">${block.html}</div>`;

    case "button": {
      const align = block.align ?? "left";
      return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;"><tr><td align="${align}"><a href="${block.url}" style="display:inline-block;padding:12px 28px;background:#7c5cfc;color:#fff;font-size:14px;font-weight:600;border-radius:8px;text-decoration:none;letter-spacing:0.3px;">${block.label}</a></td></tr></table>`;
    }

    case "divider":
      return `<hr style="margin:24px 0;border:none;border-top:1px solid #222;" />`;

    case "quote":
      return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 16px;"><tr><td style="padding:16px 20px;background:#1a1a1a;border-left:3px solid #7c5cfc;border-radius:0 8px 8px 0;"><p style="margin:0;font-size:15px;color:#ccc;line-height:1.6;font-style:italic;">${block.text}</p>${block.attribution ? `<p style="margin:8px 0 0;font-size:12px;color:#666;">— ${block.attribution}</p>` : ""}</td></tr></table>`;

    case "list": {
      const tag = block.ordered ? "ol" : "ul";
      const items = block.items
        .map((item) => `<li style="margin-bottom:8px;font-size:15px;color:#aaa;line-height:1.6;">${item}</li>`)
        .join("");
      return `<${tag} style="margin:0 0 16px;padding-left:24px;">${items}</${tag}>`;
    }

    case "image": {
      const img = `<img src="${block.src}" alt="${block.alt}" style="display:block;max-width:100%;height:auto;border-radius:8px;" />`;
      const wrapped = block.link ? `<a href="${block.link}" style="display:block;">${img}</a>` : img;
      const caption = block.caption
        ? `<p style="margin:8px 0 0;font-size:12px;color:#666;text-align:center;">${block.caption}</p>`
        : "";
      return `<div style="margin:0 0 16px;">${wrapped}${caption}</div>`;
    }

    case "spacer": {
      const h = { sm: "16px", md: "32px", lg: "48px" } as const;
      return `<div style="height:${h[block.size]};font-size:0;line-height:0;">&nbsp;</div>`;
    }

    default:
      return "";
  }
}

export function buildCampaignHtml(opts: {
  subject: string;
  previewText: string;
  body: EmailBlock[];
  toEmail: string;
  unsubscribeUrl: string;
  frontendUrl: string;
}): string {
  const { subject, previewText, body, toEmail, unsubscribeUrl, frontendUrl } = opts;
  const blocksHtml = body.map(renderBlock).join("\n          ");
  const year = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',system-ui,sans-serif;">
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;color:#0a0a0a;font-size:1px;line-height:1px;">${previewText}&nbsp;&zwnj;&zwnj;&zwnj;&zwnj;</div>` : ""}
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0"
          style="background:#111;border:1px solid #222;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:24px 40px;border-bottom:1px solid #1e1e1e;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.12em;
                      text-transform:uppercase;color:#7c5cfc;font-family:monospace;">
                      VeilCode Newsletter
                    </p>
                  </td>
                  <td align="right">
                    <a href="${frontendUrl}" style="font-size:12px;color:#555;text-decoration:none;">
                      veilcode.studio
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              ${blocksHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;background:#0d0d0d;border-top:1px solid #1e1e1e;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-size:12px;color:#555;line-height:1.5;">
                      You&rsquo;re receiving this because you subscribed at
                      <a href="${frontendUrl}" style="color:#666;text-decoration:underline;">veilcode.studio</a>.
                    </p>
                    <p style="margin:0;font-size:11px;color:#444;">
                      Sent to ${toEmail} &middot;
                      <a href="${unsubscribeUrl}" style="color:#666;text-decoration:underline;">
                        Unsubscribe
                      </a>
                    </p>
                  </td>
                  <td align="right" style="vertical-align:bottom;white-space:nowrap;padding-left:16px;">
                    <p style="margin:0;font-size:11px;color:#333;">
                      &copy; ${year} VeilCode
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

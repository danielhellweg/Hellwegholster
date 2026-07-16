import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.strato.de",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true, // SSL
  auth: {
    user: process.env.SMTP_USER || "info@hellweg.eu",
    pass: process.env.SMTP_PASS,
  },
});

export interface ContactFormData {
  type: "contact" | "configurator" | "b2b" | "b2g";
  name: string;
  email: string;
  phone?: string;
  message?: string;
  // Konfigurator
  holsterType?: string;
  weapon?: string;
  color?: string;
  side?: string;
  options?: string[];
  // B2B
  company?: string;
  businessType?: string;
  orderVolume?: string;
  customerNumber?: string;
  reorderItems?: string;
  // B2G
  authority?: string;
  authorityType?: string;
  quantity?: string;
  classification?: string;
}

function buildSubject(data: ContactFormData): string {
  switch (data.type) {
    case "contact":
      return `[Kontaktanfrage] ${data.name}`;
    case "configurator":
      return `[Konfigurator-Anfrage] ${data.name} – ${data.holsterType || "Holster"} für ${data.weapon || "unbekannte Waffe"}`;
    case "b2b":
      return `[B2B-Anfrage] ${data.company || data.name}`;
    case "b2g":
      return `[B2G-Behördenanfrage] ${data.authority || data.name}`;
    default:
      return `[Anfrage] ${data.name}`;
  }
}

function buildHtml(data: ContactFormData): string {
  const gold = "#C9A227";
  const rows: string[] = [];

  const row = (label: string, value?: string) => {
    if (!value) return;
    rows.push(`
      <tr>
        <td style="padding:8px 12px;font-weight:600;color:${gold};width:180px;border-bottom:1px solid #222;">${label}</td>
        <td style="padding:8px 12px;color:#e0e0e0;border-bottom:1px solid #222;">${value}</td>
      </tr>`);
  };

  row("Name", data.name);
  row("E-Mail", data.email);
  row("Telefon", data.phone);

  if (data.type === "configurator") {
    row("Holster-Typ", data.holsterType);
    row("Waffe / Modell", data.weapon);
    row("Kydex-Farbe / Muster", data.color);
    row("Trageseite", data.side);
    row("Optionen", data.options?.join(", "));
    row("Nachricht", data.message);
  } else if (data.type === "b2b") {
    row("Unternehmen", data.company);
    row("Geschäftstyp", data.businessType);
    row("Bestellvolumen", data.orderVolume);
    row("Kundennummer", data.customerNumber);
    row("Nachbestellung", data.reorderItems);
    row("Nachricht", data.message);
  } else if (data.type === "b2g") {
    row("Behörde / Organisation", data.authority);
    row("Behördentyp", data.authorityType);
    row("Stückzahl", data.quantity);
    row("Klassifizierung", data.classification);
    row("Nachricht", data.message);
  } else {
    row("Nachricht", data.message);
  }

  const typeLabels: Record<string, string> = {
    contact: "Kontaktanfrage",
    configurator: "Konfigurator-Anfrage",
    b2b: "B2B Händleranfrage",
    b2g: "B2G Behördenanfrage",
  };

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border:1px solid #222;border-radius:8px;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:#000;padding:24px 32px;border-bottom:2px solid ${gold};">
            <span style="color:${gold};font-size:22px;font-weight:700;letter-spacing:3px;">HELLWEG®</span>
            <span style="color:#666;font-size:13px;margin-left:12px;">Neue ${typeLabels[data.type] || "Anfrage"}</span>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding:24px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #222;border-radius:4px;overflow:hidden;">
              ${rows.join("")}
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:16px 32px;border-top:1px solid #222;background:#0a0a0a;">
            <p style="margin:0;color:#444;font-size:12px;">Diese E-Mail wurde automatisch von der Hellweg Europe Website generiert. Bitte antworte direkt an ${data.email}.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  const contactEmail = process.env.CONTACT_EMAIL || "info@hellweg.eu";

  await transporter.sendMail({
    from: `"Hellweg Europe Website" <${process.env.SMTP_USER || "info@hellweg.eu"}>`,
    to: contactEmail,
    replyTo: data.email,
    subject: buildSubject(data),
    html: buildHtml(data),
  });
}

export async function verifySmtpConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    return true;
  } catch {
    return false;
  }
}

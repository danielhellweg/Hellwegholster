import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock nodemailer to avoid real SMTP calls in tests
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: "test-id" }),
      verify: vi.fn().mockResolvedValue(true),
    })),
  },
}));

import { sendContactEmail, verifySmtpConnection } from "./email";

describe("email helpers", () => {
  beforeEach(() => {
    process.env.SMTP_HOST = "smtp.strato.de";
    process.env.SMTP_PORT = "465";
    process.env.SMTP_USER = "info@hellweg.eu";
    process.env.SMTP_PASS = "test-pass";
    process.env.CONTACT_EMAIL = "info@hellweg.eu";
  });

  it("sendContactEmail resolves without throwing for contact type", async () => {
    await expect(
      sendContactEmail({
        type: "contact",
        name: "Test User",
        email: "test@example.com",
        message: "Test message",
      })
    ).resolves.not.toThrow();
  });

  it("sendContactEmail resolves without throwing for configurator type", async () => {
    await expect(
      sendContactEmail({
        type: "configurator",
        name: "Test User",
        email: "test@example.com",
        holsterType: "IWB",
        weapon: "Glock 17",
        color: "Black",
        side: "Rechts",
        options: ["sweatguard", "claw"],
      })
    ).resolves.not.toThrow();
  });

  it("sendContactEmail resolves without throwing for b2b type", async () => {
    await expect(
      sendContactEmail({
        type: "b2b",
        name: "Max Mustermann",
        email: "shop@example.com",
        company: "Mustermann GmbH",
        businessType: "gun-shop",
        orderVolume: "50-100",
      })
    ).resolves.not.toThrow();
  });

  it("sendContactEmail resolves without throwing for b2g type", async () => {
    await expect(
      sendContactEmail({
        type: "b2g",
        name: "Beamter Müller",
        email: "behoerde@polizei.de",
        authority: "Polizeipräsidium Köln",
        authorityType: "police",
        quantity: "200",
      })
    ).resolves.not.toThrow();
  });

  it("verifySmtpConnection returns true when transport verify succeeds", async () => {
    const result = await verifySmtpConnection();
    expect(result).toBe(true);
  });
});

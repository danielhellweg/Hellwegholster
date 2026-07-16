/*
 * HELLWEG EUROPE – Contact Section + Footer
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Send, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const LOGO_GROUP = "/manus-storage/logo-group-tagline-transparent_1f457936.png";

export default function ContactSection() {
  const { t } = useLanguage();
  const headerRef = useScrollReveal(0);
  const formRef = useScrollReveal(150);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const sendMutation = trpc.contact.send.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success(t("Nachricht gesendet! Wir melden uns innerhalb von 48 Stunden.", "Message sent! We'll get back to you within 48 hours."));
    },
    onError: () => {
      toast.error(t("Fehler beim Senden. Bitte versuche es erneut oder schreibe direkt an info@hellweg.eu", "Error sending. Please try again or write directly to info@hellweg.eu"));
    },
    onSettled: () => setSending(false),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error(t("Bitte fülle alle Pflichtfelder aus.", "Please fill in all required fields."));
      return;
    }
    setSending(true);
    sendMutation.mutate({
      type: "contact",
      name,
      email,
      phone: phone || undefined,
      message: subject ? `[${subject}] ${message}` : message,
    });
  };

  return (
    <>
      {/* Contact Section */}
      <section id="contact" className="bg-[#0A0A0A] py-24 md:py-36">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">

            {/* Left: Info */}
            <div ref={headerRef} className="reveal">
              <p className="font-mono-custom text-[#C9A227] text-xs tracking-[0.3em] uppercase mb-4">
                {t("Kontakt", "Contact")}
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                {t("Lass uns reden.", "Let's Talk.")}
              </h2>
              <div className="gold-line w-16 mb-8" />
              <p className="font-body text-white/55 text-lg leading-relaxed mb-10">
                {t(
                  "Du hast eine Frage, eine Idee oder einen besonderen Wunsch? Wir sind für dich da – persönlich, direkt, ohne Umwege. Du sprichst direkt mit Daniel oder Benjamin.",
                  "Got a question, an idea, or a special request? We're here for you – personal, direct, no detours. You speak directly with Daniel or Benjamin."
                )}
              </p>

              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 border border-[#C9A227]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={14} className="text-[#C9A227]" />
                  </div>
                  <div>
                    <p className="font-mono-custom text-white/30 text-[10px] tracking-widest uppercase mb-1">
                      {t("Firmensitz", "Headquarters")}
                    </p>
                    <p className="font-body text-white/70 text-sm leading-relaxed">
                      Hellweg Group Europe<br />
                      Daniel Hellweg<br />
                      Auelsweg 22<br />
                      53797 Lohmar<br />
                      {t("Deutschland", "Germany")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 border border-[#C9A227]/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail size={14} className="text-[#C9A227]" />
                  </div>
                  <div>
                    <p className="font-mono-custom text-white/30 text-[10px] tracking-widest uppercase mb-1">
                      E-Mail
                    </p>
                    <a href="mailto:info@hellweg.eu" className="font-body text-white/70 text-sm hover:text-[#C9A227] transition-colors">
                      info@hellweg.eu
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-white/6">
                <p className="font-mono-custom text-white/25 text-[10px] tracking-widest uppercase mb-2">
                  {t("Antwortzeit", "Response Time")}
                </p>
                <p className="font-body text-white/50 text-sm">
                  {t("Wir antworten innerhalb von 48 Stunden.", "We respond within 48 hours.")}
                </p>
              </div>
            </div>

            {/* Right: Form */}
            <div ref={formRef} className="reveal">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-mono-custom text-white/30 text-[10px] tracking-widest uppercase block mb-2">
                        {t("Name *", "Name *")}
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        className="w-full bg-[#111111] border border-white/10 text-white placeholder-white/20 px-4 py-3.5 font-body text-sm focus:outline-none focus:border-[#C9A227] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-mono-custom text-white/30 text-[10px] tracking-widest uppercase block mb-2">
                        {t("E-Mail *", "Email *")}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full bg-[#111111] border border-white/10 text-white placeholder-white/20 px-4 py-3.5 font-body text-sm focus:outline-none focus:border-[#C9A227] transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-mono-custom text-white/30 text-[10px] tracking-widest uppercase block mb-2">
                      {t("Telefon (optional)", "Phone (optional)")}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-[#111111] border border-white/10 text-white placeholder-white/20 px-4 py-3.5 font-body text-sm focus:outline-none focus:border-[#C9A227] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-mono-custom text-white/30 text-[10px] tracking-widest uppercase block mb-2">
                      {t("Betreff", "Subject")}
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="w-full bg-[#111111] border border-white/10 text-white placeholder-white/20 px-4 py-3.5 font-body text-sm focus:outline-none focus:border-[#C9A227] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-mono-custom text-white/30 text-[10px] tracking-widest uppercase block mb-2">
                      {t("Nachricht *", "Message *")}
                    </label>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      required
                      rows={5}
                      className="w-full bg-[#111111] border border-white/10 text-white placeholder-white/20 px-4 py-3.5 font-body text-sm focus:outline-none focus:border-[#C9A227] transition-colors resize-none"
                    />
                  </div>
                  <button type="submit" disabled={sending} className="btn-gold w-full inline-flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Send size={14} />
                    {sending ? t("Wird gesendet...", "Sending...") : t("Nachricht senden", "Send Message")}
                  </button>
                </form>
              ) : (
                <div className="text-center py-16 border border-white/6 bg-[#111111]">
                  <div className="w-16 h-16 border-2 border-[#C9A227] flex items-center justify-center mx-auto mb-6">
                    <Send size={24} className="text-[#C9A227]" />
                  </div>
                  <h3 className="font-display text-2xl text-white mb-3">
                    {t("Nachricht gesendet!", "Message Sent!")}
                  </h3>
                  <p className="font-body text-white/50 text-sm">
                    {t("Wir melden uns innerhalb von 48 Stunden.", "We'll get back to you within 48 hours.")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#060606] border-t border-white/6 py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            {/* Brand */}
            <div>
              <img src={LOGO_GROUP} alt="Hellweg Group" className="h-10 w-auto object-contain mb-4 brightness-0 invert opacity-80" />
              <p className="font-body text-white/35 text-sm leading-relaxed">
                {t(
                  "Handgefertigte Custom-Holster. Designed in Germany. Produced in Europe.",
                  "Handcrafted Custom Holsters. Designed in Germany. Produced in Europe."
                )}
              </p>
              <p className="font-mono-custom text-[#C9A227] text-[11px] tracking-[0.2em] uppercase mt-4 mb-1">
                Protect today, secure tomorrow.
              </p>
              <p className="font-mono-custom text-[#C9A227]/40 text-[10px] tracking-widest uppercase">
                Hellweg® — {t("Eingetragene Marke", "Registered Trademark")}
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p className="font-mono-custom text-white/25 text-[10px] tracking-widest uppercase mb-4">
                {t("Navigation", "Navigation")}
              </p>
              <nav className="space-y-2">
                {[
                  { href: "#products", de: "Produkte", en: "Products" },
                  { href: "#configurator", de: "Konfigurator", en: "Configurator" },
                  { href: "#story", de: "Unsere Geschichte", en: "Our Story" },
                  { href: "#contact", de: "Kontakt", en: "Contact" },
                  { href: "#b2b", de: "Händler / B2B", en: "Trade / B2B" },
                  { href: "/impressum", de: "Impressum", en: "Imprint" },
                ].map(link => (
                  <a key={link.href} href={link.href} className="block font-body text-white/40 text-sm hover:text-[#C9A227] transition-colors">
                    {t(link.de, link.en)}
                  </a>
                ))}
              </nav>
            </div>

            {/* Contact */}
            <div>
              <p className="font-mono-custom text-white/25 text-[10px] tracking-widest uppercase mb-4">
                {t("Kontakt", "Contact")}
              </p>
              <div className="space-y-1 font-body text-white/40 text-sm">
                <p>Hellweg Group Europe</p>
                <p>Daniel Hellweg</p>
                <p>Auelsweg 22, 53797 Lohmar</p>
                <a href="mailto:info@hellweg.eu" className="hover:text-[#C9A227] transition-colors block">
                  info@hellweg.eu
                </a>
              </div>
            </div>
          </div>

          <div className="gold-line mb-6" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-mono-custom text-white/20 text-[10px] tracking-widest">
              © {new Date().getFullYear()} Hellweg Group Europe. {t("Alle Rechte vorbehalten.", "All rights reserved.")}
            </p>
            <p className="font-mono-custom text-white/20 text-[10px] tracking-widest">
              Protect today, secure tomorrow.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

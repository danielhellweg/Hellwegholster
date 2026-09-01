import { ArrowUpRight, Mail } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "../contexts/LanguageContext";

export default function ContactCTA() {
  const { t } = useLanguage();
  return (
    <>
      <section id="kontakt" className="border-y border-white/10 bg-[var(--gold)] py-20 text-black md:py-28">
        <div className="container flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono-custom text-[10px] uppercase tracking-[0.22em] text-black/55">06 · {t("Dein Projekt", "Your project")}</p>
            <h2 className="mt-4 max-w-4xl font-display text-5xl leading-none md:text-7xl">{t("Welches Modell dürfen wir für dich bauen?", "Which model may we build for you?")}</h2>
          </div>
          <a href="mailto:info@hellweg.eu?subject=Anfrage%20individuelles%20Holster" className="inline-flex shrink-0 items-center gap-3 border border-black bg-black px-7 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-black/80"><Mail size={17} /> info@hellweg.eu <ArrowUpRight size={17} /></a>
        </div>
      </section>
      <footer className="bg-black py-10">
        <div className="container flex flex-col gap-5 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <img src="/hellweg-products/hellweg-h.png" alt="" className="h-9 w-9 object-contain" />
            <span><span className="block tracking-[0.2em] text-white/70">HELLWEG</span><span className="mt-1 block text-[9px] uppercase tracking-[0.12em]">Protect Tomorrow. Secure Today.</span></span>
          </div>
          <div className="flex gap-5"><Link href="/impressum" className="hover:text-white">{t("Impressum", "Legal notice")}</Link><a href="mailto:info@hellweg.eu" className="hover:text-white">info@hellweg.eu</a></div>
        </div>
      </footer>
    </>
  );
}

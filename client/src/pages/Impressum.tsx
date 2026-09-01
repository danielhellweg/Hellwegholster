import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "../contexts/LanguageContext";

export default function Impressum() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen bg-black py-20 text-white">
      <div className="container max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[var(--gold)]"><ArrowLeft size={16} /> {t("Zurück zur Startseite", "Back to home")}</Link>
        <h1 className="mt-12 font-display text-6xl md:text-8xl">{t("Impressum", "Legal notice")}</h1>
        <div className="mt-12 space-y-8 text-base leading-relaxed text-white/65">
          <section>
            <h2 className="font-display text-3xl text-white">Hellweg GmbH i. G.</h2>
            <p className="mt-3">Auelsweg 22<br />53797 Lohmar<br />Deutschland</p>
          </section>
          <section>
            <h2 className="font-display text-3xl text-white">{t("Vertretung", "Representation")}</h2>
            <p className="mt-3">{t("Geschäftsführer", "Managing Director")}: Daniel Hellweg</p>
          </section>
          <section>
            <h2 className="font-display text-3xl text-white">{t("Registerangaben", "Register information")}</h2>
            <p className="mt-3">{t("Registergericht", "Register court")}: Amtsgericht Siegburg<br />{t("Handelsregisternummer", "Commercial register number")}: {t("folgt nach Eintragung", "to follow after registration")}</p>
            <p className="mt-3 text-sm text-white/40">{t("Die Gesellschaft befindet sich derzeit in Gründung. Die Registernummer wird nach erfolgter Eintragung ergänzt.", "The company is currently being incorporated. The registration number will be added after registration.")}</p>
          </section>
          <section><h2 className="font-display text-3xl text-white">{t("Kontakt", "Contact")}</h2><p className="mt-3">E-Mail: <a className="text-[var(--gold)]" href="mailto:info@hellweg.eu">info@hellweg.eu</a></p></section>
          <p>Hellweg® {t("ist eine eingetragene Marke.", "is a registered trademark.")}</p>
        </div>
      </div>
    </main>
  );
}

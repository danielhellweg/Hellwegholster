import { ArrowDownRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();
  return (
    <section id="top" className="relative min-h-screen overflow-hidden bg-black pt-20">
      <img src="/hellweg-products/duty-hero.webp" alt={t("Beispiel eines individuell gefertigten Duty-Holsters", "Example of a custom-made duty holster")} className="absolute inset-0 h-full w-full object-cover object-center opacity-70" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
      <div className="container relative flex min-h-[calc(100vh-5rem)] items-end pb-16 pt-24 md:items-center md:pb-0">
        <div className="max-w-4xl">
          <span className="gold-badge">Handcrafted · Made for you</span>
          <h1 className="mt-7 font-display text-[clamp(4rem,10vw,9rem)] leading-[0.83] tracking-[-0.045em] text-white">
            {t("Kein Holster von der Stange.", "No off-the-shelf holster.")}<br />
            <span className="text-[var(--gold)]">{t("Deins.", "Yours.")}</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg font-light leading-relaxed text-white/70 md:text-xl">
            {t("Passgenau für dein Waffen- oder Einsatzmodell gefertigt. Verwendung, Optik, Licht, Farbe, Muster und Befestigung werden persönlich abgestimmt.", "Made to fit your exact weapon or equipment model. Use, optics, light, colour, pattern and mounting are personally coordinated.")}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#produkte" className="btn-gold">{t("Modellauswahl ansehen", "View model selection")} <ArrowDownRight size={16} /></a>
            <a href="#individualisierung" className="btn-ghost">{t("Möglichkeiten entdecken", "Explore options")}</a>
          </div>
          <div className="mt-10 max-w-2xl border-l-2 border-[var(--gold)] bg-black/60 px-5 py-4 backdrop-blur-sm">
            <p className="font-mono-custom text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]">{t("Wichtig · Das Bild ist ein Beispiel", "Important · The image is an example")}</p>
            <p className="mt-2 text-sm text-white/70">{t("Jedes Holster wird passend für das von dir angegebene Modell individuell hergestellt.", "Every holster is individually made for the model you specify.")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

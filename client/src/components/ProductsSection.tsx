/*
 * HELLWEG EUROPE – Products Section v2
 * Apple-Inspired: Full-bleed imagery, massive type, H-Logo on holsters
 * Emotional storytelling through product presentation
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ArrowRight, Lock, CheckCircle2 } from "lucide-react";

const HOLSTER_IMG = "/manus-storage/holster-hero-v3_5a39ec52.jpg";
const HOLSTER_DETAIL = "/manus-storage/holster-detail-v3_1531ff40.jpg";
const HOLSTER_COLLECTION = "/manus-storage/holster-collection-v3_8f873685.jpg";
const HERO_DARK = "/manus-storage/holster-hero-v3_5a39ec52.jpg";

const H_SYMBOL = "/manus-storage/h-symbol-only_701841e6.png";
const HShieldLogo = ({ size = 40, className = "" }: { size?: number; className?: string }) => (
  <img src={H_SYMBOL} alt="Hellweg H" width={size} height={size} className={className} style={{ objectFit: 'contain' }} />
);

const holsterTypes = [
  { de: "IWB – Inside Waistband", en: "IWB – Inside Waistband" },
  { de: "OWB – Outside Waistband", en: "OWB – Outside Waistband" },
  { de: "Schulterholster", en: "Shoulder Holster" },
  { de: "Magazintaschen", en: "Magazine Carriers" },
  { de: "Tactical / Duty Holster", en: "Tactical / Duty Holster" },
  { de: "Sonderanfertigungen", en: "Custom Special Orders" },
];

export default function ProductsSection() {
  const { t } = useLanguage();
  const headerRef = useScrollReveal(0);
  const card1Ref = useScrollReveal(100);
  const card2Ref = useScrollReveal(150);
  const card3Ref = useScrollReveal(200);

  return (
    <section id="products" className="bg-[#080808]">

      {/* ── SECTION INTRO ── */}
      <div className="container py-32 md:py-48">
        <div ref={headerRef} className="reveal max-w-3xl">
          <p className="font-mono-custom text-[#C9A227] text-[11px] tracking-[0.35em] uppercase mb-6">
            {t("Sortiment", "Product Range")}
          </p>
          <h2 className="section-headline text-white mb-8">
            {t("Drei Linien.", "Three Lines.")}
            <br />
            <span className="text-[#C9A227]">{t("Eine Philosophie.", "One Philosophy.")}</span>
          </h2>
          <p className="section-subline max-w-xl">
            {t(
              "Kompromisslose Qualität. Präzise Fertigung. Persönlicher Service. Jedes Produkt trägt das Hellweg-Versprechen.",
              "Uncompromising quality. Precise manufacturing. Personal service. Every product carries the Hellweg promise."
            )}
          </p>
        </div>
      </div>

      {/* ── CARD 1: KYDEX HOLSTER – FULL BLEED ── */}
      <div ref={card1Ref} className="reveal">
        <div className="relative min-h-[85vh] flex items-end overflow-hidden">
          {/* Full-bleed background image */}
          <img
            src={HOLSTER_IMG}
            alt={t("Hellweg Kydex Holster", "Hellweg Kydex Holster")}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/80 via-transparent to-transparent" />

          {/* Content */}
          <div className="relative z-10 container pb-16 md:pb-24">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <HShieldLogo size={32} />
                <span className="font-mono-custom text-[#C9A227] text-[10px] tracking-[0.3em] uppercase">
                  {t("Aktuelles Sortiment · Sofort verfügbar", "Current Range · Available Now")}
                </span>
              </div>

              <p className="font-mono-custom text-white/30 text-[10px] tracking-[0.3em] uppercase mb-3">
                Kydex · Handmade · Custom
              </p>
              <h3 className="font-display text-5xl md:text-7xl font-bold text-white mb-2 leading-none">
                {t("Kydex-Holster", "Kydex Holsters")}
              </h3>
              <p className="font-mono-custom text-[#C9A227] text-[10px] tracking-[0.2em] uppercase mb-6">
                Designed in Germany · Produced in Europe · 100% Handmade
              </p>
              <p className="font-body text-white/60 text-base leading-relaxed mb-6 max-w-lg">
                {t(
                  "Vom klassischen IWB bis zum taktischen Duty-Holster – exakt für deine Waffe, exakt nach deinen Wünschen. Über 50 Kydex-Farben und Tarnmuster. Das Hellweg-H auf der Außenfläche ist unser Qualitätsversprechen.",
                  "From classic IWB to tactical duty holsters – exactly for your firearm, exactly to your specs. Over 50 Kydex colors and camo patterns. The Hellweg H on the outer surface is our quality promise."
                )}
              </p>

              {/* Holster types */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 mb-8">
                {holsterTypes.map((item, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <span className="text-[#C9A227] text-xs">—</span>
                    <span className="font-body text-white/50 text-sm">{t(item.de, item.en)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#configurator" className="btn-gold inline-flex items-center gap-2">
                  {t("Jetzt konfigurieren", "Configure Now")}
                  <ArrowRight size={14} />
                </a>
                <a href="#contact" className="btn-ghost">
                  {t("Anfrage stellen", "Request Information")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── DETAIL SHOT: H-Logo close-up ── */}
      <div className="relative h-[50vh] md:h-[70vh] overflow-hidden">
        <img src={HOLSTER_DETAIL} alt="Hellweg H Logo Detail" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]" />
      </div>
      {/* Caption below the image */}
      <div className="container py-10 md:py-14">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-10">
          <p className="font-mono-custom text-[#C9A227] text-[11px] tracking-[0.4em] uppercase opacity-80 shrink-0">
            {t("Das Zeichen der Qualität", "The Mark of Quality")}
          </p>
          <div className="w-px h-6 bg-[#C9A227]/30 hidden md:block" />
          <p className="font-display text-2xl md:text-4xl text-white font-bold">
            {t("Jedes Stück trägt das H.", "Every piece bears the H.")}
          </p>
        </div>
      </div>

      {/* ── CARDS 2 & 3: Munition + Drohnen ── */}
      <div className="container py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-px bg-white/6">

          {/* CARD 2: Munition */}
          <div ref={card2Ref} className="reveal bg-[#080808] flex flex-col">
            {/* Product Image */}
            <div className="relative overflow-hidden" style={{ aspectRatio: '3/2' }}>
              <img
                src="/manus-storage/product-ammunition_8ce086b6.jpg"
                alt="Hellweg Munition"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/20 to-transparent" />
            </div>
            <div className="p-10 md:p-16 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-8">
              <CheckCircle2 size={14} className="text-[#C9A227]" />
              <span className="font-mono-custom text-[#C9A227] text-[10px] tracking-[0.25em] uppercase">
                {t("Ab sofort lieferbar", "Available Now")}
              </span>
              <span className="mx-2 text-white/20">·</span>
              <Lock size={11} className="text-white/30" />
              <span className="font-mono-custom text-white/30 text-[10px] tracking-[0.2em] uppercase">
                {t("Nur auf Anfrage", "By Request Only")}
              </span>
            </div>

            <p className="font-mono-custom text-white/25 text-[10px] tracking-[0.3em] uppercase mb-3">
              {t("Munition", "Ammunition")}
            </p>
            <h3 className="font-display text-4xl md:text-5xl font-bold text-white mb-2 leading-none">
              {t("Hellweg Munition", "Hellweg Ammunition")}
            </h3>

            <div className="w-16 h-px bg-[#C9A227]/30 mb-8" />

            <p className="font-body text-white/50 text-base leading-relaxed mb-10 flex-1">
              {t(
                "Hochpräzise Munition für Sport, Jagd und professionellen Einsatz. Verfügbar in verschiedenen Kalibern – ausschließlich für berechtigte Personen und Institutionen.",
                "High-precision ammunition for sport, hunting, and professional use. Available in various calibers – exclusively for authorized individuals and institutions."
              )}
            </p>

            <a href="#contact" className="btn-ghost inline-flex items-center gap-2 self-start">
              {t("Anfrage stellen", "Request Information")}
              <ArrowRight size={14} />
            </a>
            </div>
          </div>

          {/* CARD 3: Drohnen-Kapseln */}
          <div ref={card3Ref} className="reveal bg-[#0A0A0A] flex flex-col">
            {/* Product Image */}
            <div className="relative overflow-hidden" style={{ aspectRatio: '3/2' }}>
              <img
                src="/manus-storage/product-drone-explosion_11f25565.jpg"
                alt="Suicide Drohnen-Kapseln"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/20 to-transparent" />
            </div>
            <div className="p-10 md:p-16 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-8">
              <CheckCircle2 size={14} className="text-[#C9A227]" />
              <span className="font-mono-custom text-[#C9A227] text-[10px] tracking-[0.25em] uppercase">
                {t("Ab sofort lieferbar", "Available Now")}
              </span>
              <span className="mx-2 text-white/20">·</span>
              <Lock size={11} className="text-white/30" />
              <span className="font-mono-custom text-white/30 text-[10px] tracking-[0.2em] uppercase">
                {t("Streng reguliert", "Strictly Regulated")}
              </span>
            </div>

            <p className="font-mono-custom text-white/25 text-[10px] tracking-[0.3em] uppercase mb-3">
              {t("Drohnen-Munition", "Drone Munitions")}
            </p>
            <h3 className="font-display text-4xl md:text-5xl font-bold text-white mb-2 leading-none">
              {t("Suicide Drohnen-Kapseln", "Suicide Drone Capsules")}
            </h3>

            <div className="w-16 h-px bg-[#C9A227]/30 mb-8" />

            <p className="font-body text-white/50 text-base leading-relaxed mb-10 flex-1">
              {t(
                "Hochpräzise Drohnen-Munitionskapseln für professionelle und militärische Anwendungen. Unterliegen strengen Export- und Lizenzbestimmungen – ausschließlich für autorisierte Behörden und Streitkräfte.",
                "High-precision drone munition capsules for professional and military applications. Subject to strict export and licensing regulations – exclusively for authorized agencies and armed forces."
              )}
            </p>

            <a href="#contact" className="btn-ghost inline-flex items-center gap-2 self-start">
              {t("Anfrage stellen", "Request Information")}
              <ArrowRight size={14} />
            </a>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

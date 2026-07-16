/*
 * HELLWEG EUROPE – Gallery Section
 * Dark Forge: Full-bleed cinematic gallery, Apple-style scroll reveal
 * Categories: Sportschützen, Militär, Polizei, Grenzschutz, Security
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const GALLERY_ITEMS = [
  {
    img: "/manus-storage/gallery-sport-v2_3e59ffdf.jpg",
    labelDe: "Sportschützen",
    labelEn: "Sport Shooters",
    descDe: "Präzision trifft Leidenschaft. Für den Wettkampf optimiert.",
    descEn: "Precision meets passion. Optimized for competition.",
    tag: "B2C",
  },
  {
    img: "/manus-storage/gallery-military-v2_d30c0929.jpg",
    labelDe: "Militär",
    labelEn: "Military",
    descDe: "Taktische Zuverlässigkeit. Wenn es darauf ankommt.",
    descEn: "Tactical reliability. When it matters most.",
    tag: "B2G",
  },
  {
    img: "/manus-storage/gallery-police-v2_e40c9685.jpg",
    labelDe: "Polizei",
    labelEn: "Police",
    descDe: "Duty-Holster für den täglichen Einsatz. Zertifiziert. Verlässlich.",
    descEn: "Duty holsters for daily service. Certified. Reliable.",
    tag: "B2G",
  },
  {
    img: "/manus-storage/gallery-border-v2_7c26e17f.jpg",
    labelDe: "Grenzschutz",
    labelEn: "Border Protection",
    descDe: "Entwickelt für Extrembedingungen. Jederzeit einsatzbereit.",
    descEn: "Built for extreme conditions. Always mission-ready.",
    tag: "B2G",
  },
  {
    img: "/manus-storage/gallery-security-v2_65e9e178.jpg",
    labelDe: "Security",
    labelEn: "Security",
    descDe: "Professioneller Schutz für Sicherheitsunternehmen.",
    descEn: "Professional protection for security companies.",
    tag: "B2B",
  },
];

export default function GallerySection() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const headerRef = useScrollReveal(0);

  return (
    <section id="gallery" className="bg-[#060606] py-24 md:py-36 overflow-hidden">
      <div className="container mb-16 md:mb-24">
        <div ref={headerRef} className="reveal max-w-3xl">
          <p className="font-mono-custom text-[#C9A227] text-[11px] tracking-[0.35em] uppercase mb-6">
            {t("Einsatzbereiche", "Applications")}
          </p>
          <h2 className="section-headline text-white mb-6">
            {t("Vertrauen.", "Trust.")}
            <br />
            <span className="text-[#C9A227]">
              {t("In jeder Uniform.", "In every uniform.")}
            </span>
          </h2>
          <p className="section-subline max-w-xl">
            {t(
              "Von der Schießbahn bis zum Einsatz – Hellweg® Holster werden von Sportschützen, Sicherheitskräften, Polizei, Militär und Grenzschutz in ganz Europa getragen.",
              "From the shooting range to active duty – Hellweg® holsters are trusted by sport shooters, security professionals, police, military, and border protection across Europe."
            )}
          </p>
        </div>
      </div>

      {/* Horizontal scroll gallery on mobile, masonry-style grid on desktop */}
      <div className="relative">
        {/* Desktop: asymmetric 5-column grid */}
        <div className="hidden md:grid grid-cols-5 gap-px bg-[#C9A227]/10">
          {GALLERY_ITEMS.map((item, i) => (
            <div
              key={i}
              className="relative group overflow-hidden cursor-pointer"
              style={{ height: i % 2 === 0 ? "600px" : "520px", marginTop: i % 2 === 0 ? "0" : "80px" }}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <img
                src={item.img}
                alt={t(item.labelDe, item.labelEn)}
                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ filter: activeIndex === i ? "grayscale(0%) brightness(1)" : "grayscale(20%) brightness(0.75)" }}
              />
              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/90 via-[#060606]/20 to-transparent transition-opacity duration-500" />

              {/* Tag badge */}
              <div className="absolute top-4 right-4">
                <span className="font-mono-custom text-[9px] tracking-[0.2em] uppercase px-2 py-1 border border-[#C9A227]/50 text-[#C9A227] bg-[#060606]/60 backdrop-blur-sm">
                  {item.tag}
                </span>
              </div>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <p className="font-mono-custom text-[#C9A227] text-[10px] tracking-[0.25em] uppercase mb-2">
                  {t(item.labelDe, item.labelEn)}
                </p>
                <p className="font-body text-white/70 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {t(item.descDe, item.descEn)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: horizontal scroll */}
        <div className="md:hidden flex gap-4 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide">
          {GALLERY_ITEMS.map((item, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-72 h-96 overflow-hidden snap-center"
            >
              <img
                src={item.img}
                alt={t(item.labelDe, item.labelEn)}
                className="w-full h-full object-cover object-top"
                style={{ filter: "grayscale(10%) brightness(0.8)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060606]/85 via-transparent to-transparent" />

              {/* Tag badge */}
              <div className="absolute top-4 right-4">
                <span className="font-mono-custom text-[9px] tracking-[0.2em] uppercase px-2 py-1 border border-[#C9A227]/50 text-[#C9A227] bg-[#060606]/60">
                  {item.tag}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-mono-custom text-[#C9A227] text-[10px] tracking-[0.25em] uppercase mb-1">
                  {t(item.labelDe, item.labelEn)}
                </p>
                <p className="font-body text-white/60 text-sm leading-relaxed">
                  {t(item.descDe, item.descEn)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA strip */}
      <div className="container mt-20">
        <div className="border-t border-white/6 pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-mono-custom text-white/30 text-[10px] tracking-[0.3em] uppercase mb-2">
              {t("B2C · B2B · B2G", "B2C · B2B · B2G")}
            </p>
            <p className="font-display text-xl md:text-2xl text-white">
              {t(
                "Für Privatpersonen, Händler und Behörden.",
                "For individuals, retailers and government agencies."
              )}
            </p>
          </div>
          <a
            href="#b2b"
            className="btn-ghost inline-flex items-center gap-2 shrink-0"
          >
            {t("Händler & Behörden", "Retailers & Agencies")}
            <span className="text-[#C9A227]">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

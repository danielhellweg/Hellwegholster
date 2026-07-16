/*
 * HELLWEG EUROPE – Story Section
 * Dark Forge: Asymmetric layout, family story, "Designed in Germany – Produced in Europe – Handmade"
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const CRAFTSMAN_IMG = "/manus-storage/craftsman-hands_13139efe.jpg";
const DANIEL_IMG = "/manus-storage/daniel-hellweg_67021339.jpg";
const BENJAMIN_IMG = "/manus-storage/benjamin-hellweg_c1df0485.png";
const TOGETHER_IMG = "/manus-storage/daniel-benjamin-together_0b1767c1.png";

export default function StorySection() {
  const { t, tJsx } = useLanguage();
  const ref1 = useScrollReveal(0);
  const ref2 = useScrollReveal(150);
  const ref3 = useScrollReveal(300);

  return (
    <section id="story" className="bg-[#0D0D0D] py-24 md:py-36 overflow-hidden">
      <div className="container">

        {/* Badge Strip – Designed in Germany */}
        <div className="flex flex-wrap gap-6 mb-20 border-b border-white/6 pb-10">
          {[
            { label: "Designed in Germany" },
            { label: "Produced in Europe" },
            { label: "100% Handmade" },
            { label: "Hellweg® – Eingetragene Marke" },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[#C9A227] text-xs">✦</span>
              <span className="font-mono-custom text-white/50 text-xs tracking-[0.2em] uppercase">
                {badge.label}
              </span>
            </div>
          ))}
        </div>

        {/* Main Story Layout */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center mb-24">
          {/* Left: Text */}
          <div ref={ref1} className="reveal">
            <p className="font-mono-custom text-[#C9A227] text-xs tracking-[0.3em] uppercase mb-4">
              {t("Unsere Geschichte", "Our Story")}
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              {tJsx(
                <>Eine Familie.<br />Eine Leidenschaft.<br /><span className="text-[#C9A227]">Zwei Kontinente.</span></>,
                <>One Family.<br />One Passion.<br /><span className="text-[#C9A227]">Two Continents.</span></>
              )}
            </h2>
            <div className="gold-line w-16 mb-8" />
            <div className="space-y-5 font-body text-white/60 text-base leading-relaxed">
              <p>
                {t(
                  "Alles begann in Australien. Albert Hellweg gründete Hellweg Australia 1979 in Melbourne als kleinen Familienbetrieb – mit nichts weiter als handwerklichem Können, einem tiefen Respekt vor dem Material und dem Anspruch, niemals Kompromisse einzugehen. Jeder Holster, der seine Werkstatt verließ, war ein Versprechen: Qualität, die hält.",
                  "It all started in Australia. Albert Hellweg founded Hellweg Australia in 1979 in Melbourne as a small family business – with nothing more than craftsmanship, a deep respect for materials, and the commitment to never compromise. Every holster that left his workshop was a promise: quality that lasts."
                )}
              </p>
              <p className="text-white/80 font-medium">
                {t(
                  "Er ist nicht mehr unter uns. Aber sein Vermächtnis lebt weiter.",
                  "He is no longer with us. But his legacy lives on."
                )}
              </p>
              <p>
                {t(
                  "Ich bin Daniel Hellweg – und zusammen mit Benjamin Hellweg führe ich die Hellweg-Tradition jetzt in Europa fort. Was Albert in Melbourne aufgebaut hat, findet hier seine europäische Heimat. Dieselbe Philosophie, dieselbe Präzision, dieselbe Leidenschaft – jetzt für den europäischen Markt.",
                  "I am Daniel Hellweg – and together with Benjamin Hellweg, I carry the Hellweg tradition forward in Europe. What Albert built in Melbourne now finds its European home. The same philosophy, the same precision, the same passion – now for the European market."
                )}
              </p>
            </div>
          </div>

          {/* Right: Image */}
          <div ref={ref2} className="reveal relative">
            <div className="relative overflow-hidden">
              <img
                src={CRAFTSMAN_IMG}
                alt={t("Handwerk bei Hellweg", "Hellweg Craftsmanship")}
                className="w-full h-80 md:h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D]/60 to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-6 -left-6 bg-[#C9A227] p-6 hidden md:block">
              <p className="font-mono-custom text-[#0A0A0A] text-[10px] tracking-[0.2em] uppercase font-bold">
                Designed in Germany
              </p>
              <p className="font-mono-custom text-[#0A0A0A] text-[10px] tracking-[0.2em] uppercase">
                Produced in Europe
              </p>
              <p className="font-mono-custom text-[#0A0A0A] text-[10px] tracking-[0.2em] uppercase">
                100% Handmade
              </p>
            </div>
          </div>
        </div>

        {/* Second row: Team portraits side by side */}
        <div ref={ref3} className="reveal">
          {/* Quote */}
          <div className="mb-16">
            <blockquote className="border-l-2 border-[#C9A227] pl-6 max-w-2xl">
              <p className="font-display text-2xl md:text-3xl text-white italic leading-relaxed">
                {t(
                  "\"Hellweg Europe ist kein Konzern. Wir sind eine Familie, die ihr Handwerk liebt.\"",
                  "\"Hellweg Europe is not a corporation. We are a family that loves its craft.\""
                )}
              </p>
              <footer className="mt-4 font-mono-custom text-[#C9A227] text-xs tracking-widest uppercase">
                — Daniel Hellweg
              </footer>
            </blockquote>
          </div>

          {/* Combined portrait */}
          <div className="relative group overflow-hidden max-w-2xl">
            <div className="relative overflow-hidden" style={{ aspectRatio: '3/2' }}>
              <img
                src={TOGETHER_IMG}
                alt="Daniel und Benjamin Hellweg"
                className="w-full h-full object-cover object-top transition-all duration-700"
                style={{ filter: "grayscale(20%) brightness(0.9)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-5 flex gap-6">
              <p className="font-mono-custom text-[#C9A227] text-[10px] tracking-[0.2em] uppercase font-bold">
                Daniel Hellweg
              </p>
              <span className="text-[#C9A227]/30 text-[10px]">·</span>
              <p className="font-mono-custom text-[#C9A227] text-[10px] tracking-[0.2em] uppercase font-bold">
                Benjamin Hellweg
              </p>
            </div>
          </div>

          {/* Values strip below portraits */}
          <div className="mt-12 space-y-4 max-w-2xl">
            {[
              {
                de: "Jedes Produkt trägt das Hellweg-H – nicht nur als Logo, sondern als Versprechen.",
                en: "Every product carries the Hellweg H – not just as a logo, but as a promise.",
              },
              {
                de: "Designed in Germany. Produziert in Europa. 100% handgefertigt.",
                en: "Designed in Germany. Produced in Europe. 100% handmade.",
              },
              {
                de: "Hellweg® ist eine eingetragene Marke – für Qualität ohne Kompromisse.",
                en: "Hellweg® is a registered trademark – for quality without compromise.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="text-[#C9A227] mt-1 shrink-0">✦</span>
                <p className="font-body text-white/55 text-sm leading-relaxed">
                  {t(item.de, item.en)}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

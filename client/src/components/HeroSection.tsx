/*
 * HELLWEG EUROPE – Hero Section v2
 * Apple-Inspired: Full-viewport cinematic, scroll-storytelling
 * Massive typography, extreme whitespace, emotional copy
 */
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowDown } from "lucide-react";

const HERO_IMAGE = "/manus-storage/holster-hero-v3_5a39ec52.jpg";
const HERO_FALLBACK = "/manus-storage/hero-holster_e5658468.jpg";

const H_SYMBOL = "/manus-storage/h-symbol-only_701841e6.png";
const HShieldLogo = ({ size = 48, className = "" }: { size?: number; className?: string }) => (
  <img src={H_SYMBOL} alt="Hellweg H" width={size} height={size} className={className} style={{ objectFit: 'contain' }} />
);

export default function HeroSection() {
  const { t, tJsx } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      const bg = heroRef.current.querySelector('.hero-bg') as HTMLElement;
      if (bg) bg.style.transform = `translateY(${scrollY * 0.4}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col overflow-hidden bg-[#080808]">

      {/* Background Image with Parallax */}
      <div className="hero-bg absolute inset-0 will-change-transform">
        <img
          src={HERO_IMAGE}
          alt=""
          className="w-full h-full object-cover scale-110"
          onError={(e) => { (e.target as HTMLImageElement).src = HERO_FALLBACK; }}
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/75 to-[#080808]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-[#080808]/50" />
        <div className="absolute inset-0 bg-[#080808]/20" />
      </div>

      {/* Hex grid overlay */}
      <div className="absolute inset-0 hex-pattern opacity-20 pointer-events-none" />

      {/* Main Content */}
      <div
        ref={textRef}
        className="relative z-10 flex-1 flex flex-col justify-center container pt-28 pb-16"
        style={{
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'none' : 'translateY(20px)',
          transition: 'opacity 1.2s cubic-bezier(0.23,1,0.32,1), transform 1.2s cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        {/* H Logo mark */}
        <div
          className="mb-8"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(10px)',
            transition: 'opacity 1s cubic-bezier(0.23,1,0.32,1) 0.2s, transform 1s cubic-bezier(0.23,1,0.32,1) 0.2s',
          }}
        >
          <HShieldLogo size={52} />
        </div>

        {/* Eyebrow */}
        <p
          className="font-mono-custom text-[#C9A227] text-[11px] tracking-[0.35em] uppercase mb-8"
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 1s ease 0.3s',
          }}
        >
          Hellweg® — {t("Handgefertigte Custom-Holster Europe", "Handcrafted Custom Holsters Europe")}
        </p>

        {/* Main Headline – Apple-scale */}
        <h1
          className="section-headline text-white max-w-4xl mb-8"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(30px)',
            transition: 'opacity 1.1s cubic-bezier(0.23,1,0.32,1) 0.4s, transform 1.1s cubic-bezier(0.23,1,0.32,1) 0.4s',
          }}
        >
          {tJsx(
            <>
              Kein Holster<br />
              <em className="text-[#C9A227] not-italic">von der Stange.</em><br />
              Deins.
            </>,
            <>
              Not off<br />
              <em className="text-[#C9A227] not-italic">the shelf.</em><br />
              Yours.
            </>
          )}
        </h1>

        {/* Subline */}
        <p
          className="section-subline max-w-xl mb-12"
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 1s ease 0.7s',
          }}
        >
          {t(
            "Handgefertigte Custom-Holster aus Kydex. Designed in Germany, Produced in Europe. Jedes Stück trägt das Hellweg-H – unser Versprechen an Präzision.",
            "Handcrafted custom Kydex holsters. Designed in Germany, Produced in Europe. Every piece bears the Hellweg H – our promise of precision."
          )}
        </p>

        {/* Claim */}
        <p
          className="font-mono-custom text-[#C9A227] text-[13px] tracking-[0.25em] uppercase mb-10 flex items-center gap-3"
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 1s ease 0.65s',
          }}
        >
          <span className="w-8 h-px bg-[#C9A227]/50 inline-block" />
          Protect today, secure tomorrow.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row gap-4"
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 1s ease 0.9s',
          }}
        >
          <a href="#configurator" className="btn-gold">
            {t("Jetzt konfigurieren", "Configure Yours")}
          </a>
          <a href="#story" className="btn-ghost">
            {t("Unsere Geschichte", "Our Story")}
          </a>
        </div>
      </div>

      {/* USP Strip – Apple-style bottom bar */}
      <div className="relative z-10 border-t border-white/6 bg-[#080808]/80 backdrop-blur-md">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/6">
            {[
              {
                label: { de: "100% Handgefertigt", en: "100% Handcrafted" },
                sub: { de: "Jedes Stück ein Unikat", en: "Every piece unique" }
              },
              {
                label: { de: "Designed in Germany", en: "Designed in Germany" },
                sub: { de: "Produced in Europe", en: "Produced in Europe" }
              },
              {
                label: { de: "Custom Made", en: "Custom Made" },
                sub: { de: "Exakt nach deinen Wünschen", en: "Exactly to your specs" }
              },
            ].map((item, i) => (
              <div key={i} className="py-6 px-6 md:px-8">
                <p className="font-body text-white/80 text-sm font-medium mb-0.5">
                  {t(item.label.de, item.label.en)}
                </p>
                <p className="font-mono-custom text-[#C9A227]/70 text-[10px] tracking-widest uppercase">
                  {t(item.sub.de, item.sub.en)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-32 right-12 z-10 hidden lg:flex flex-col items-center gap-3">
        <span className="font-mono-custom text-white/20 text-[9px] tracking-[0.3em] uppercase" style={{ writingMode: 'vertical-rl' }}>
          Scroll
        </span>
        <ArrowDown size={12} className="text-white/20 animate-bounce" />
      </div>
    </section>
  );
}

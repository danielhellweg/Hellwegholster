/*
 * HELLWEG EUROPE – Navbar
 * Dark Forge Design: Transparent → Opaque on scroll, Gold accent, Language toggle
 */
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Menu, X } from "lucide-react";

const LOGO_STACKED = "/manus-storage/logo-stacked-transparent_de1a8f87.png";

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "#products", de: "Produkte", en: "Products" },
    { href: "#configurator", de: "Konfigurator", en: "Configurator" },
    { href: "#story", de: "Unsere Geschichte", en: "Our Story" },
    { href: "#b2b", de: "Händler", en: "Trade" },
    { href: "#contact", de: "Kontakt", en: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/8"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 shrink-0">
          <img
            src={LOGO_STACKED}
            alt="Hellweg Europe"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white/70 hover:text-[#C9A227] transition-colors duration-200 text-sm font-body tracking-wide uppercase font-medium"
            >
              {t(link.de, link.en)}
            </a>
          ))}
        </nav>

        {/* Right side: Language + CTA */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language Toggle */}
          <div className="flex items-center gap-1 font-mono-custom text-xs">
            <button
              onClick={() => setLang("de")}
              className={`px-2 py-1 transition-colors duration-200 ${
                lang === "de" ? "text-[#C9A227]" : "text-white/40 hover:text-white/70"
              }`}
            >
              DE
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 transition-colors duration-200 ${
                lang === "en" ? "text-[#C9A227]" : "text-white/40 hover:text-white/70"
              }`}
            >
              EN
            </button>
          </div>

          <a href="#configurator" className="btn-gold text-xs">
            {t("Jetzt konfigurieren", "Configure Now")}
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <div className="flex items-center gap-1 font-mono-custom text-xs">
            <button
              onClick={() => setLang("de")}
              className={`px-2 py-1 ${lang === "de" ? "text-[#C9A227]" : "text-white/40"}`}
            >
              DE
            </button>
            <span className="text-white/20">|</span>
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 ${lang === "en" ? "text-[#C9A227]" : "text-white/40"}`}
            >
              EN
            </button>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white/80 hover:text-[#C9A227] transition-colors p-1"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0A0A0A]/98 backdrop-blur-xl border-t border-white/8">
          <nav className="container py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-white/70 hover:text-[#C9A227] transition-colors text-base font-body tracking-wide uppercase py-2 border-b border-white/5"
              >
                {t(link.de, link.en)}
              </a>
            ))}
            <a
              href="#configurator"
              onClick={() => setMenuOpen(false)}
              className="btn-gold text-center mt-2"
            >
              {t("Jetzt konfigurieren", "Configure Now")}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}

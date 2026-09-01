import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const links = [
    ["produkte", t("Modelle", "Models")],
    ["galerie", t("Impressionen", "Gallery")],
    ["individualisierung", t("Individualisierung", "Customisation")],
    ["geschichte", t("Geschichte", "Story")],
    ["manufaktur", t("Manufaktur", "Craft")],
    ["kontakt", t("Kontakt", "Contact")],
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="container flex h-20 items-center justify-between">
        <a href="#top" className="flex items-center gap-3" aria-label="Hellweg Startseite">
          <img src="/hellweg-products/hellweg-h.png" alt="" className="h-10 w-10 object-contain" />
          <span className="leading-none">
            <span className="block font-mono-custom text-[12px] tracking-[0.25em] text-white">HELLWEG</span>
            <span className="mt-1.5 block text-[8px] uppercase tracking-[0.16em] text-white/45">Protect Tomorrow. Secure Today.</span>
          </span>
        </a>
        <nav className="hidden items-center gap-7 lg:flex" aria-label={t("Hauptnavigation", "Main navigation")}>
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="text-xs uppercase tracking-[0.14em] text-white/60 transition hover:text-white">{label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="flex border border-white/15 p-1 text-[10px] font-semibold tracking-widest">
            <button onClick={() => setLang("de")} className={`px-2 py-1 ${lang === "de" ? "bg-[var(--gold)] text-black" : "text-white/50"}`}>DE</button>
            <button onClick={() => setLang("en")} className={`px-2 py-1 ${lang === "en" ? "bg-[var(--gold)] text-black" : "text-white/50"}`}>EN</button>
          </div>
          <button className="p-2 text-white lg:hidden" onClick={() => setOpen(!open)} aria-label={t("Menü öffnen", "Open menu")}>{open ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-white/10 bg-black px-6 py-5 lg:hidden">
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="block border-b border-white/10 py-4 text-sm uppercase tracking-[0.16em] text-white/70">{label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}

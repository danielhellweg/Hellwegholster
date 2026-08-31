import { Crosshair, Layers3, ShieldCheck } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

export default function CraftSection() {
  const { t } = useLanguage();
  const pillars = [
    [Crosshair, t("Modellgenaue Passform", "Model-specific fit"), t("Abgestimmt auf Modell, Optik, Licht und Einsatzzweck.", "Matched to model, optics, light and intended use.")],
    [ShieldCheck, t("Kontrollierte Retention", "Controlled retention"), t("Sicherer Halt und ein auf deinen Ablauf abgestimmtes Ziehverhalten.", "Secure retention and draw behaviour tuned to your workflow.")],
    [Layers3, t("Persönliche Gestaltung", "Personal design"), t("Motiv, Farbe, Tragesystem und Befestigung werden individuell gewählt.", "Motif, colour, carry system and mounting are chosen individually.")],
  ] as const;
  return (
    <section id="manufaktur" className="bg-black py-24 md:py-36">
      <div className="container">
        <p className="font-mono-custom text-xs uppercase tracking-[0.22em] text-[var(--gold)]">04 · {t("Unser Standard", "Our standard")}</p>
        <h2 className="mt-5 max-w-5xl font-display text-5xl leading-none md:text-8xl">{t("Individuell heißt bei uns: von Anfang an.", "For us, custom means from the very start.")}</h2>
        <div className="mt-16 grid gap-px bg-white/10 md:grid-cols-3">
          {pillars.map(([Icon, title, text]) => (
            <article key={title} className="bg-[var(--black-2)] p-8 md:p-10">
              <Icon className="text-[var(--gold)]" size={30} strokeWidth={1.4} />
              <h3 className="mt-8 font-display text-3xl">{title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/55">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

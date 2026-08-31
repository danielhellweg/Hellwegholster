import { ArrowRight, Check } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const finishGroups = [
  ["22", "Unifarben", "solid colours"],
  ["18", "Camouflage-Muster", "camouflage patterns"],
  ["27", "DesignLab-Farben", "DesignLab colours"],
  ["7", "Carbon-Varianten", "carbon variants"],
];

export default function ConfiguratorSection() {
  const { t } = useLanguage();
  const details = [
    t("Grafik- und Einhornmotive", "Graphic and unicorn motifs"),
    t("Neonfarben und klassisches Schwarz", "Neon colours and classic black"),
    t("6 Holsterarten", "6 holster types"),
    t("3 Trage-Seiten", "3 carry sides"),
    t("6 Extras", "6 extras"),
    t("Individuelle Halterungen und Befestigungen", "Individual mounts and attachments"),
  ];

  return (
    <section id="individualisierung" className="relative overflow-hidden bg-[var(--black-2)] py-24 md:py-36">
      <div className="absolute inset-0 hex-pattern opacity-50" />
      <div className="container relative">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="font-mono-custom text-xs uppercase tracking-[0.22em] text-[var(--gold)]">03 · {t("Individualisierung", "Customisation")}</p>
            <h2 className="mt-5 font-display text-5xl leading-none md:text-8xl">{t("74 Oberflächen. Ein Holster: deins.", "74 finishes. One holster: yours.")}</h2>
            <p className="mt-7 max-w-2xl text-lg font-light leading-relaxed text-white/60">{t("Der bisherige Online-Konfigurator wird bewusst durch persönliche Beratung ersetzt. Du nennst uns Modell und Einsatzzweck – wir stimmen Passform, Aufbau und Gestaltung direkt mit dir ab.", "The online configurator is intentionally replaced by personal advice. Tell us your model and intended use – we coordinate fit, setup and design directly with you.")}</p>
            <ul className="mt-9 grid gap-3 sm:grid-cols-2">
              {details.map((detail) => <li key={detail} className="flex items-start gap-3 text-sm text-white/70"><Check size={16} className="mt-0.5 shrink-0 text-[var(--gold)]" />{detail}</li>)}
            </ul>
            <a href="mailto:info@hellweg.eu?subject=Individuelle%20Holster-Anfrage" className="btn-gold mt-10">{t("Persönlich abstimmen", "Discuss personally")} <ArrowRight size={16} /></a>
          </div>

          <div className="grid grid-cols-2 border-l border-t border-white/10">
            {finishGroups.map(([number, de, en]) => (
              <div key={de} className="border-b border-r border-white/10 bg-black/30 p-7 md:p-10">
                <div className="stat-number">{number}</div>
                <p className="mt-3 text-sm text-white/60">{t(de, en)}</p>
              </div>
            ))}
            <div className="col-span-2 border-b border-r border-white/10 bg-[var(--gold-dim)] p-8 text-center">
              <div className="font-display text-6xl text-[var(--gold)] md:text-8xl">74</div>
              <p className="mt-2 font-mono-custom text-[10px] uppercase tracking-[0.22em] text-white/60">{t("Oberflächen zur Auswahl", "finishes to choose from")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

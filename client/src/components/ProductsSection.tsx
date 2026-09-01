import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const picturedModels = [
  { name: "Glock 17", group: "Glock", finish: "Schulterholster · Schwarz", image: "/hellweg-products/glock17-schulter-v2.png" },
  { name: "Walther Q5 SF", group: "Walther", finish: "Tropical", image: "/hellweg-products/walther-q5sf.webp" },
  { name: "Walther PDP 5\"", group: "Walther", finish: "Multicam · Surefire X300", image: "/hellweg-products/walther-pdp5-x300.png" },
  { name: "CZ Shadow 2", group: "CZ", finish: "Floral Skull", image: "/hellweg-products/cz-shadow2.webp" },
  { name: "Taser 10", group: "Taser", finish: "Neon Gelb", image: "/hellweg-products/taser10.webp" },
  { name: "Duty-System", group: "Duty", finish: "Tiger Stripe Camouflage", image: "/hellweg-products/duty-hero.webp" },
];

const supportedModels = [
  "Glock 17", "Glock 34", "Walther Q5 SF", "Walther PDP 4\"", "Walther PDP 4,5\"", "Walther PDP 5\"",
  "SIG Sauer P320", "CZ Shadow 2", "Beretta 92FS", "Taser 10", "Duty-Systeme",
];

export default function ProductsSection() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(0);
  const current = picturedModels[selected];
  return (
    <section id="produkte" className="bg-[var(--black-2)] py-24 md:py-36">
      <div className="container">
        <p className="font-mono-custom text-xs uppercase tracking-[0.22em] text-[var(--gold)]">01 · {t("Modellauswahl", "Model selection")}</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <h2 className="font-display text-5xl leading-none md:text-7xl">{t("Das Modell entscheidet über die Passform.", "The model determines the fit.")}</h2>
          <p className="section-subline">{t("Alle Bilder sind Beispielausführungen für das jeweils genannte Modell. Farben, Muster, Licht-, Optik- und Befestigungsvarianten werden unabhängig davon persönlich abgestimmt.", "All images are sample configurations for the named model. Colours, patterns, light, optic and mounting options are coordinated separately and personally.")}</p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div className="grid grid-cols-2 gap-2">
            {picturedModels.map((model, index) => (
              <button key={model.name} onClick={() => setSelected(index)} className={`border px-4 py-5 text-left transition ${selected === index ? "border-[var(--gold)] bg-[var(--gold-dim)]" : "border-white/10 bg-white/[0.02] hover:border-white/30"}`}>
                <span className="font-mono-custom text-[9px] uppercase tracking-[0.18em] text-white/35">{model.group}</span>
                <span className="mt-2 block text-sm font-medium text-white">{model.name}</span>
              </button>
            ))}
          </div>
          <div className="overflow-hidden border border-white/10 bg-black">
            <div className="flex min-h-[420px] items-center justify-center bg-[#111] p-6 md:p-10">
              <img src={current.image} alt={`${current.name} – ${current.finish}`} className="max-h-[420px] w-full object-contain" />
            </div>
            <div className="border-t border-white/10 p-6 md:p-8">
              <span className="gold-badge">{t("Beispielexemplar", "Sample item")}</span>
              <h3 className="mt-4 font-display text-4xl">{current.name}</h3>
              <p className="mt-1 text-sm text-[var(--gold)]">{current.finish}</p>
              <p className="mt-3 max-w-xl text-sm text-white/65">{t("Das Bild zeigt ausschließlich ein Gestaltungsbeispiel für dieses Modell – jede Bestellung wird individuell konfiguriert.", "The image shows one design example for this model only – every order is individually configured.")}</p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-white/40">
          {t("Die Bilder zeigen ausschließlich vollständige Beispielholster. Weitere Modelle sind in der Übersicht aufgeführt und werden nach deiner Angabe passgenau gefertigt.", "The images show complete sample holsters only. Additional models are listed below and are made to fit your specification.")}
        </p>

        <div className="mt-20 border border-white/10 bg-black/40 p-7 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="font-mono-custom text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]">{t("Aktuelle Modellübersicht", "Current model overview")}</p>
              <h3 className="mt-4 font-display text-4xl md:text-5xl">{t("Für diese Modelle fertigen wir bereits.", "We already manufacture for these models.")}</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/50">{t("Die Liste wird laufend erweitert. Weitere Modelle prüfen wir gern auf Anfrage.", "The list is continuously expanded. We are happy to check additional models on request.")}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {supportedModels.map((model) => <div key={model} className="border border-white/10 bg-white/[0.02] px-4 py-4 text-sm text-white/70">{model}</div>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

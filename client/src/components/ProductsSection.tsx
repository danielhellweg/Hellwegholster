import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const models = [
  { name: "Glock 17 / 34", group: "Glock", image: "/hellweg-products/duty-hero.webp" },
  { name: "Walther Q5 / PDP", group: "Walther", image: "/hellweg-products/walther-q5sf.webp" },
  { name: "SIG Sauer P320", group: "SIG Sauer", image: "/hellweg-products/duty-hero.webp" },
  { name: "CZ Shadow 2", group: "CZ", image: "/hellweg-products/cz-shadow2.webp" },
  { name: "Beretta 92FS", group: "Beretta", image: "/hellweg-products/magazinhalter-einfach.jpg" },
  { name: "Taser 10", group: "Taser", image: "/hellweg-products/taser10.webp" },
  { name: "Duty-Systeme", group: "Duty", image: "/hellweg-products/duty-hero.webp" },
];

const examples = [
  ["Walther Q5 SF", "Tropical", "/hellweg-products/walther-q5sf.webp"],
  ["CZ Shadow 2", "Floral Skull", "/hellweg-products/cz-shadow2.webp"],
  ["Taser 10", "Neon Gelb", "/hellweg-products/taser10.webp"],
];

export default function ProductsSection() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(0);
  const current = models[selected];
  return (
    <section id="produkte" className="bg-[var(--black-2)] py-24 md:py-36">
      <div className="container">
        <p className="font-mono-custom text-xs uppercase tracking-[0.22em] text-[var(--gold)]">01 · {t("Modellauswahl", "Model selection")}</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <h2 className="font-display text-5xl leading-none md:text-7xl">{t("Das Modell entscheidet über die Passform.", "The model determines the fit.")}</h2>
          <p className="section-subline">{t("Die Fotos zeigen Beispielausführungen. Farbe, Muster und Aufbau lassen sich unabhängig vom Waffenmodell individuell wählen.", "The photos show example configurations. Colour, pattern and setup can be selected independently of the weapon model.")}</p>
        </div>
        <div className="mt-14 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2">
            {models.map((model, index) => (
              <button key={model.name} onClick={() => setSelected(index)} className={`border px-4 py-5 text-left transition ${selected === index ? "border-[var(--gold)] bg-[var(--gold-dim)]" : "border-white/10 bg-white/[0.02] hover:border-white/30"}`}>
                <span className="font-mono-custom text-[9px] uppercase tracking-[0.18em] text-white/35">{model.group}</span>
                <span className="mt-2 block text-sm font-medium text-white">{model.name}</span>
              </button>
            ))}
          </div>
          <div className="relative min-h-[360px] overflow-hidden border border-white/10 bg-black">
            <img src={current.image} alt={`${current.name} ${t("Beispiel", "example")}`} className="h-full min-h-[360px] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <span className="gold-badge">{t("Beispielexemplar", "Sample item")}</span>
              <h3 className="mt-4 font-display text-4xl">{current.name}</h3>
              <p className="mt-2 max-w-xl text-sm text-white/65">{t("Passgenau für dieses Modell gefertigt – die sichtbare Oberfläche ist nur eine von 74 Möglichkeiten.", "Made to fit this model – the visible finish is only one of 74 options.")}</p>
            </div>
          </div>
        </div>
        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {examples.map(([model, finish, image]) => (
            <article key={model} className="product-card overflow-hidden border border-white/10 bg-black">
              <img src={image} alt={`${model} ${finish}`} className="aspect-[4/3] w-full object-cover" />
              <div className="p-6">
                <p className="font-mono-custom text-[9px] uppercase tracking-[0.18em] text-[var(--gold)]">{t("Beispielholster", "Sample holster")}</p>
                <h3 className="mt-3 font-display text-3xl">{model}</h3>
                <p className="mt-1 text-sm text-white/50">{finish}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

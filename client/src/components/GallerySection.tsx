import { useLanguage } from "../contexts/LanguageContext";

const gallery = [
  { image: "/hellweg-products/glock17-schulter-v2.png", title: "Glock 17", models: "Schulterholster · Schwarz", type: "holster" },
  { image: "/hellweg-products/duty-hero.webp", title: "Duty-System", models: "Tiger Stripe Camouflage", type: "holster" },
  { image: "/hellweg-products/walther-q5sf.webp", title: "Walther Q5 SF", models: "Tropical", type: "holster" },
  { image: "/hellweg-products/walther-pdp5-x300.png", title: "Walther PDP 5\"", models: "Multicam · Surefire X300", type: "holster" },
  { image: "/hellweg-products/cz-shadow2.webp", title: "CZ Shadow 2", models: "Floral Skull", type: "holster" },
  { image: "/hellweg-products/taser10.webp", title: "Taser 10", models: "Neon Gelb", type: "holster" },
  { image: "/hellweg-products/magazinhalter-einfach-v2.png", title: "Magazinhalter · einfach", models: "Beretta 92FS", type: "magazine" },
  { image: "/hellweg-products/magazinhalter-doppelt.jpg", title: "Magazinhalter · doppelt", models: "Glock / SIG Sauer P320", type: "magazine" },
];

export default function GallerySection() {
  const { t } = useLanguage();
  return (
    <section id="galerie" className="bg-black py-24 md:py-36">
      <div className="container">
        <p className="font-mono-custom text-xs uppercase tracking-[0.22em] text-[var(--gold)]">02 · {t("Fotogalerie", "Photo gallery")}</p>
        <h2 className="mt-5 max-w-5xl font-display text-5xl leading-none md:text-8xl">{t("Impressionen aus der Manufaktur.", "Impressions from the workshop.")}</h2>
        <p className="mt-6 max-w-2xl text-lg font-light leading-relaxed text-white/60">{t("Mehr als Holster: Beispiele für Duty-, Sport- und Einsatzlösungen sowie individuell gefertigte Magazinhalter.", "More than holsters: examples of duty, sport and operational solutions plus custom-made magazine carriers.")}</p>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {gallery.map((item) => (
            <figure key={item.image} className="group overflow-hidden border border-white/10 bg-[var(--black-3)]">
              <div className="flex aspect-[4/3] items-center justify-center bg-[#111] p-5 md:p-7">
                <img src={item.image} alt={`${item.title} – ${item.models}`} className="max-h-full w-full object-contain transition duration-700 group-hover:scale-[1.02]" />
              </div>
              <figcaption className="border-t border-white/10 p-6">
                <p className="font-mono-custom text-[9px] uppercase tracking-[0.18em] text-[var(--gold)]">
                  {item.type === "magazine" ? t("Magazinhalter", "Magazine carrier") : "Holster"}
                </p>
                <h3 className="mt-2 font-display text-3xl">{item.title}</h3>
                <p className="mt-1 text-sm text-white/55">{t("Beispiel passend für", "Example made for")} {item.models}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useLanguage } from "../contexts/LanguageContext";

const gallery = [
  { image: "/hellweg-products/duty-hero.webp", title: "Duty-Holster", models: "Duty-Systeme", large: true },
  { image: "/hellweg-products/magazinhalter-einfach.jpg", title: "Magazinhalter · einfach", models: "Beretta 92FS" },
  { image: "/hellweg-products/magazinhalter-doppelt.jpg", title: "Magazinhalter · doppelt", models: "Glock 17 / SIG Sauer P320" },
  { image: "/hellweg-products/walther-q5sf.webp", title: "Sport-Holster", models: "Walther Q5 SF" },
  { image: "/hellweg-products/taser10.webp", title: "Taser-Holster", models: "Taser 10" },
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
            <figure key={item.title} className={`group relative min-h-[340px] overflow-hidden border border-white/10 bg-[var(--black-3)] ${item.large ? "md:col-span-2 lg:row-span-2 lg:min-h-[700px]" : ""}`}>
              <img src={item.image} alt={`${item.title} – ${item.models}`} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-transparent" />
              <figcaption className="absolute bottom-0 left-0 right-0 p-6">
                <p className="font-mono-custom text-[9px] uppercase tracking-[0.18em] text-[var(--gold)]">{t("Beispielausführung", "Sample configuration")}</p>
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

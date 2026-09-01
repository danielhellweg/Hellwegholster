import { useLanguage } from "../contexts/LanguageContext";

export default function StorySection() {
  const { t } = useLanguage();
  const values = [
    t("Handwerk ohne Kompromisse", "Craft without compromise"),
    t("Respekt vor Material und Funktion", "Respect for material and function"),
    t("Persönliche Fertigung statt Massenware", "Personal craftsmanship instead of mass production"),
  ];

  return (
    <section id="geschichte" className="bg-[var(--black-2)] py-24 md:py-36">
      <div className="container">
        <p className="font-mono-custom text-xs uppercase tracking-[0.22em] text-[var(--gold)]">
          04 · {t("Unsere Geschichte", "Our story")}
        </p>
        <div className="mt-7 grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          <div>
            <h2 className="font-display text-5xl leading-none md:text-8xl">
              {t("Von Melbourne nach Europa.", "From Melbourne to Europe.")}
            </h2>
            <blockquote className="mt-10 border-l-2 border-[var(--gold)] pl-6 font-display text-2xl italic leading-relaxed text-white/85 md:text-3xl">
              {t("Qualität, die hält – und ein Handwerk, das weiterlebt.", "Quality that lasts – and a craft that lives on.")}
            </blockquote>
          </div>

          <div className="space-y-6 text-base font-light leading-relaxed text-white/65 md:text-lg">
            <p>
              {t(
                "Die Geschichte von Hellweg begann 1979 in Melbourne. Albert Hellweg gründete Hellweg Australia als kleinen Familienbetrieb – getragen von handwerklichem Können, einem tiefen Respekt vor dem Material und dem Anspruch, bei Sicherheit und Qualität keine Kompromisse einzugehen.",
                "The Hellweg story began in Melbourne in 1979. Albert Hellweg founded Hellweg Australia as a small family business – built on craftsmanship, deep respect for materials and the determination never to compromise on safety or quality."
              )}
            </p>
            <p>
              {t(
                "In den 1990er-Jahren erweiterte Hellweg seine Fertigung um moderne Schutz- und Tragesysteme. Zu Beginn der 2000er-Jahre lieferte das Unternehmen Schutzwesten an verschiedene Polizeikräfte und an die Australian Defence Force – Ausrüstung, die unter anderem im Irak und in Afghanistan eingesetzt wurde.",
                "In the 1990s, Hellweg expanded its manufacturing into modern protective and load-carrying systems. By the early 2000s, the company was supplying body armour to various police forces and the Australian Defence Force – equipment used in Iraq and Afghanistan, among other deployments."
              )}
            </p>
            <p>
              {t(
                "Heute wird Hellweg-Ausrüstung nach Angaben von Hellweg Australia von nahezu jeder Polizeibehörde Australiens genutzt – ebenso von Justizvollzug, kommunalen Behörden, Krankenhaussicherheit, Vollzugsdiensten und führenden privaten Sicherheitsunternehmen. Entwicklung, Konstruktion und Fertigung erfolgen in Australien mit eigener Technik, CAD-Modellierung und internen Prüfverfahren.",
                "Today, according to Hellweg Australia, Hellweg equipment is used by almost every police force in Australia, as well as corrections, councils, hospital security, enforcement departments and leading private security providers. Design, engineering and manufacturing take place in Australia with in-house technology, CAD modelling and testing."
              )}
            </p>
            <p>
              {t(
                "Jedes Produkt steht dabei für dieselbe Idee: präzise gefertigt, funktional durchdacht und für Menschen gemacht, die sich im Einsatz darauf verlassen müssen. Diese Philosophie bildet bis heute das Fundament von Hellweg.",
                "Every product stands for the same idea: precisely made, functionally considered and created for people who must rely on it in service. This philosophy remains the foundation of Hellweg today."
              )}
            </p>
            <p className="text-white/85">
              {t(
                "Heute wird das Unternehmen von Daniel Hellweg geführt. Er führt die Familientradition in Europa fort – mit derselben Präzision, derselben Leidenschaft und dem Anspruch, jedes Holster individuell für seinen späteren Einsatz zu fertigen.",
                "Today, the company is led by Daniel Hellweg. He continues the family tradition in Europe – with the same precision, the same passion and the commitment to make every holster individually for its intended use."
              )}
            </p>
            <div className="grid gap-3 pt-5 sm:grid-cols-3">
              {values.map((value) => (
                <div key={value} className="border border-white/10 bg-black/30 px-5 py-5 text-sm text-white/70">
                  <span className="mb-3 block text-[var(--gold)]">✦</span>{value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

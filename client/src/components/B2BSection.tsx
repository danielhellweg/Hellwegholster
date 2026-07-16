/*
 * HELLWEG EUROPE – B2C / B2B / B2G Sektion
 * Apple-Inspired Dark Forge Design
 * Drei Bereiche:
 *   1. B2C – Endkunden (Konfigurator-Link)
 *   2. B2B – Wiederverkäufer-Anfrage + Nachbestellung
 *   3. B2G – Behörden, Polizei, Militär, Sicherheitsdienste
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Check, ArrowRight, Send, Store, RefreshCw, Package, TrendingUp, Shield, Handshake, Building2, User, BadgeCheck } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const H_SYMBOL = "/manus-storage/h-symbol-only_701841e6.png";
const HShieldLogo = ({ size = 32 }: { size?: number }) => (
  <img src={H_SYMBOL} alt="Hellweg H" width={size} height={size} style={{ objectFit: 'contain' }} />
);

type MainTab = "b2c" | "b2b" | "b2g";
type B2BSubTab = "reseller" | "reorder";

const advantages = [
  {
    icon: <Package size={20} />,
    de: "Exklusives Sortiment",
    en: "Exclusive Range",
    textDe: "Handgefertigte Kydex-Holster, die kein Massenanbieter liefert.",
    textEn: "Handcrafted Kydex holsters no mass supplier can provide.",
  },
  {
    icon: <TrendingUp size={20} />,
    de: "Attraktive Margen",
    en: "Attractive Margins",
    textDe: "Faire Händlerkonditionen mit Staffelpreisen ab Mindestabnahme.",
    textEn: "Fair dealer terms with tiered pricing from minimum order.",
  },
  {
    icon: <Shield size={20} />,
    de: "Hellweg® Markenrecht",
    en: "Hellweg® Brand Rights",
    textDe: "Verkauf unter einer eingetragenen, geschützten Premiummarke.",
    textEn: "Selling under a registered, protected premium brand.",
  },
  {
    icon: <Handshake size={20} />,
    de: "Persönlicher Ansprechpartner",
    en: "Personal Contact",
    textDe: "Daniel oder Benjamin stehen dir direkt zur Verfügung.",
    textEn: "Daniel or Benjamin are directly available to you.",
  },
];

const storeTypes = [
  { id: "gun-shop", de: "Waffengeschäft", en: "Gun Shop" },
  { id: "outdoor", de: "Outdoor / Jagd / Angeln", en: "Outdoor / Hunting / Fishing" },
  { id: "tactical", de: "Tactical / Security", en: "Tactical / Security" },
  { id: "police", de: "Behördenausstatter", en: "Law Enforcement Supplier" },
  { id: "online", de: "Online-Händler", en: "Online Retailer" },
  { id: "other", de: "Sonstiges", en: "Other" },
];

const govTypes = [
  { id: "police", de: "Polizei / Landespolizei", en: "Police / State Police" },
  { id: "bundespolizei", de: "Bundespolizei / BGS", en: "Federal Police" },
  { id: "military", de: "Bundeswehr / Militär", en: "Military / Armed Forces" },
  { id: "customs", de: "Zoll / Steuerfahndung", en: "Customs / Tax Investigation" },
  { id: "security", de: "Behördlicher Sicherheitsdienst", en: "Government Security Service" },
  { id: "other-gov", de: "Sonstige Behörde", en: "Other Government Body" },
];

export default function B2BSection() {
  const { t } = useLanguage();
  const headerRef = useScrollReveal(0);
  const tabsRef = useScrollReveal(100);
  const contentRef = useScrollReveal(200);

  const [activeTab, setActiveTab] = useState<MainTab>("b2b");
  const [b2bSubTab, setB2bSubTab] = useState<B2BSubTab>("reseller");

  // Reseller form
  const [company, setCompany] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [storeType, setStoreType] = useState("");
  const [message, setMessage] = useState("");
  const [resellerSubmitted, setResellerSubmitted] = useState(false);

  // Reorder form
  const [roCustomerId, setRoCustomerId] = useState("");
  const [roCompany, setRoCompany] = useState("");
  const [roEmail, setRoEmail] = useState("");
  const [roProducts, setRoProducts] = useState("");
  const [roQuantity, setRoQuantity] = useState("");
  const [roNotes, setRoNotes] = useState("");
  const [reorderSubmitted, setReorderSubmitted] = useState(false);

  // B2G form
  const [govAgency, setGovAgency] = useState("");
  const [govContact, setGovContact] = useState("");
  const [govEmail, setGovEmail] = useState("");
  const [govPhone, setGovPhone] = useState("");
  const [govType, setGovType] = useState("");
  const [govRequirement, setGovRequirement] = useState("");
  const [govQuantity, setGovQuantity] = useState("");
  const [govSubmitted, setGovSubmitted] = useState(false);

  const [resellerSending, setResellerSending] = useState(false);
  const [reorderSending, setReorderSending] = useState(false);
  const [govSending, setGovSending] = useState(false);

  const sendMutation = trpc.contact.send.useMutation({
    onError: () => {
      toast.error(t("Fehler beim Senden. Bitte schreibe direkt an info@hellweg.eu", "Error sending. Please write directly to info@hellweg.eu"));
    },
  });

  const handleResellerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !contactName || !email || !storeType) {
      toast.error(t("Bitte fülle alle Pflichtfelder aus.", "Please fill in all required fields."));
      return;
    }
    setResellerSending(true);
    sendMutation.mutate({
      type: "b2b",
      name: contactName,
      email,
      phone: phone || undefined,
      company,
      businessType: storeType,
      message: [city && `Stadt: ${city}`, country && `Land: ${country}`, message].filter(Boolean).join(" | ") || undefined,
    }, {
      onSuccess: () => {
        setResellerSubmitted(true);
        toast.success(t("Händleranfrage gesendet! Wir melden uns innerhalb von 48 Stunden.", "Dealer request sent! We'll get back to you within 48 hours."));
      },
      onSettled: () => setResellerSending(false),
    });
  };

  const handleReorderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roCustomerId || !roCompany || !roEmail || !roProducts) {
      toast.error(t("Bitte fülle alle Pflichtfelder aus.", "Please fill in all required fields."));
      return;
    }
    setReorderSending(true);
    sendMutation.mutate({
      type: "b2b",
      name: roCompany,
      email: roEmail,
      customerNumber: roCustomerId,
      company: roCompany,
      reorderItems: roProducts,
      orderVolume: roQuantity || undefined,
      message: roNotes || undefined,
    }, {
      onSuccess: () => {
        setReorderSubmitted(true);
        toast.success(t("Nachbestellung eingegangen! Wir bearbeiten deine Bestellung umgehend.", "Reorder received! We'll process your order promptly."));
      },
      onSettled: () => setReorderSending(false),
    });
  };

  const handleGovSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!govAgency || !govContact || !govEmail || !govType) {
      toast.error(t("Bitte fülle alle Pflichtfelder aus.", "Please fill in all required fields."));
      return;
    }
    setGovSending(true);
    sendMutation.mutate({
      type: "b2g",
      name: govContact,
      email: govEmail,
      phone: govPhone || undefined,
      authority: govAgency,
      authorityType: govType,
      quantity: govQuantity || undefined,
      message: govRequirement || undefined,
    }, {
      onSuccess: () => {
        setGovSubmitted(true);
        toast.success(t("Behördenanfrage eingegangen! Wir melden uns vertraulich und diskret.", "Government inquiry received! We'll respond confidentially and discreetly."));
      },
      onSettled: () => setGovSending(false),
    });
  };

  const mainTabs: { id: MainTab; icon: React.ReactNode; de: string; en: string }[] = [
    { id: "b2c", icon: <User size={14} />, de: "Endkunden", en: "End Customers" },
    { id: "b2b", icon: <Store size={14} />, de: "Händler / B2B", en: "Dealers / B2B" },
    { id: "b2g", icon: <Building2 size={14} />, de: "Behörden / B2G", en: "Government / B2G" },
  ];

  return (
    <section id="b2b" className="bg-[#050505] py-24 md:py-40 border-t border-white/4">
      <div className="container">

        {/* ── HEADER ── */}
        <div ref={headerRef} className="reveal mb-16">
          <div className="flex items-center gap-4 mb-6">
            <HShieldLogo size={36} />
            <p className="font-mono-custom text-[#C9A227] text-[11px] tracking-[0.35em] uppercase">
              {t("Unsere Kunden", "Our Customers")}
            </p>
          </div>
          <h2 className="section-headline text-white mb-6">
            {t("Für jeden", "For every")}
            <br />
            <span className="text-[#C9A227]">{t("der Schutz ernst nimmt.", "who takes protection seriously.")}</span>
          </h2>
          <p className="section-subline max-w-2xl">
            {t(
              "Hellweg® bedient Endkunden, den stationären Handel und Behörden gleichermaßen – mit demselben Anspruch an Qualität und Präzision.",
              "Hellweg® serves end customers, retail trade and government agencies alike – with the same standard of quality and precision."
            )}
          </p>

          {/* B2C / B2B / B2G Badges */}
          <div className="flex flex-wrap gap-4 mt-8">
            {[
              { label: "B2C", sub: t("Endkunden", "End Customers"), icon: <User size={12} /> },
              { label: "B2B", sub: t("Handel & Wiederverkäufer", "Trade & Resellers"), icon: <Store size={12} /> },
              { label: "B2G", sub: t("Behörden & Militär", "Government & Military"), icon: <Building2 size={12} /> },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-3 border border-[#C9A227]/20 px-5 py-3 bg-[#C9A227]/4">
                <span className="text-[#C9A227]">{badge.icon}</span>
                <div>
                  <p className="font-mono-custom text-[#C9A227] text-[11px] tracking-[0.2em] font-bold">{badge.label}</p>
                  <p className="font-body text-white/40 text-[10px]">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ADVANTAGES GRID (nur für B2B/B2G sichtbar) ── */}
        {activeTab !== "b2c" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/4 mb-16">
            {advantages.map((adv, i) => (
              <div key={i} className="bg-[#050505] p-8 group hover:bg-[#0E0E0E] transition-colors">
                <div className="text-[#C9A227] mb-4 opacity-70 group-hover:opacity-100 transition-opacity">
                  {adv.icon}
                </div>
                <p className="font-body text-white/80 text-sm font-medium mb-2">{t(adv.de, adv.en)}</p>
                <p className="font-body text-white/35 text-xs leading-relaxed">{t(adv.textDe, adv.textEn)}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── MAIN TABS ── */}
        <div ref={tabsRef} className="reveal mb-10">
          <div className="flex border border-white/6 overflow-hidden max-w-2xl">
            {mainTabs.map((tab, i) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 transition-all duration-200 font-mono-custom text-[10px] tracking-[0.15em] uppercase ${
                  activeTab === tab.id
                    ? "bg-[#C9A227] text-[#0A0A0A]"
                    : `bg-transparent text-white/30 hover:text-white/60 ${i < mainTabs.length - 1 ? "border-r border-white/6" : ""}`
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{t(tab.de, tab.en)}</span>
                <span className="sm:hidden">{tab.id.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div ref={contentRef} className="reveal">

          {/* ══ B2C ══ */}
          {activeTab === "b2c" && (
            <div className="max-w-3xl">
              <div className="mb-10">
                <h3 className="font-display text-3xl md:text-4xl text-white mb-4">
                  {t("Dein Holster. Deine Regeln.", "Your Holster. Your Rules.")}
                </h3>
                <p className="font-body text-white/50 text-base leading-relaxed mb-8">
                  {t(
                    "Als Endkunde konfigurierst du deinen Holster direkt über unseren Konfigurator – Waffe, Kydex-Farbe, Trageseite, Optionen. Alles nach deinen Wünschen, handgefertigt in Europa.",
                    "As an end customer, you configure your holster directly through our configurator – firearm, Kydex colour, carry side, options. Everything to your specifications, handcrafted in Europe."
                  )}
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-10">
                  {[
                    { de: "Konfigurator nutzen", en: "Use Configurator", sub: t("Schritt für Schritt", "Step by step"), href: "#configurator" },
                    { de: "Anfrage senden", en: "Send Request", sub: t("Direktkontakt", "Direct contact"), href: "#contact" },
                    { de: "Alle Holster-Typen", en: "All Holster Types", sub: t("IWB, OWB, Schulter...", "IWB, OWB, Shoulder..."), href: "#products" },
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="border border-white/6 p-6 hover:border-[#C9A227]/40 hover:bg-[#C9A227]/4 transition-all group"
                    >
                      <p className="font-body text-white/80 text-sm font-medium mb-1 group-hover:text-[#C9A227] transition-colors">
                        {t(item.de, item.en)}
                      </p>
                      <p className="font-mono-custom text-white/30 text-[10px] tracking-widest uppercase">{item.sub}</p>
                      <ArrowRight size={14} className="text-[#C9A227]/0 group-hover:text-[#C9A227] mt-3 transition-all" />
                    </a>
                  ))}
                </div>
                <div className="bg-[#C9A227]/5 border border-[#C9A227]/20 px-6 py-5 flex items-start gap-4">
                  <BadgeCheck size={18} className="text-[#C9A227] shrink-0 mt-0.5" />
                  <p className="font-body text-white/50 text-sm leading-relaxed">
                    {t(
                      "Jeder Hellweg®-Holster trägt das goldene H-Symbol auf der Außenfläche – Zeichen für Qualität, Herkunft und handwerkliche Präzision.",
                      "Every Hellweg® holster bears the golden H symbol on the outer surface – a sign of quality, origin and artisan precision."
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ══ B2B ══ */}
          {activeTab === "b2b" && (
            <div>
              {/* B2B Sub-Tabs */}
              <div className="flex border border-white/6 overflow-hidden max-w-lg mb-10">
                <button
                  onClick={() => setB2bSubTab("reseller")}
                  className={`flex-1 py-4 px-6 flex items-center justify-center gap-3 transition-all duration-200 font-mono-custom text-[10px] tracking-[0.2em] uppercase ${
                    b2bSubTab === "reseller"
                      ? "bg-white/8 text-white border-b-2 border-[#C9A227]"
                      : "bg-transparent text-white/30 hover:text-white/60 border-r border-white/6"
                  }`}
                >
                  <Store size={14} />
                  {t("Wiederverkäufer werden", "Become a Reseller")}
                </button>
                <button
                  onClick={() => setB2bSubTab("reorder")}
                  className={`flex-1 py-4 px-6 flex items-center justify-center gap-3 transition-all duration-200 font-mono-custom text-[10px] tracking-[0.2em] uppercase ${
                    b2bSubTab === "reorder"
                      ? "bg-white/8 text-white border-b-2 border-[#C9A227]"
                      : "bg-transparent text-white/30 hover:text-white/60"
                  }`}
                >
                  <RefreshCw size={14} />
                  {t("Nachbestellung", "Reorder")}
                </button>
              </div>

              {/* Reseller Form */}
              {b2bSubTab === "reseller" && !resellerSubmitted && (
                <div className="max-w-3xl">
                  <h3 className="font-display text-3xl md:text-4xl text-white mb-3">{t("Werde Hellweg®-Händler.", "Become a Hellweg® Dealer.")}</h3>
                  <p className="font-body text-white/50 text-base leading-relaxed mb-8">
                    {t("Fülle das Formular aus und wir melden uns persönlich. Kein Mindestbestellwert für die erste Anfrage.", "Fill in the form and we'll get back to you personally. No minimum order value for the first inquiry.")}
                  </p>
                  <form onSubmit={handleResellerSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div><label className="hw-label">{t("Firmenname *", "Company Name *")}</label><input type="text" value={company} onChange={e => setCompany(e.target.value)} required className="hw-input" placeholder={t("Dein Unternehmen", "Your company")} /></div>
                      <div><label className="hw-label">{t("Ansprechpartner *", "Contact Person *")}</label><input type="text" value={contactName} onChange={e => setContactName(e.target.value)} required className="hw-input" /></div>
                      <div><label className="hw-label">{t("E-Mail *", "Email *")}</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="hw-input" /></div>
                      <div><label className="hw-label">{t("Telefon", "Phone")}</label><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="hw-input" /></div>
                      <div><label className="hw-label">{t("Stadt", "City")}</label><input type="text" value={city} onChange={e => setCity(e.target.value)} className="hw-input" /></div>
                      <div><label className="hw-label">{t("Land", "Country")}</label><input type="text" value={country} onChange={e => setCountry(e.target.value)} className="hw-input" /></div>
                    </div>
                    <div>
                      <label className="hw-label">{t("Art des Geschäfts *", "Type of Business *")}</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {storeTypes.map(st => (
                          <button key={st.id} type="button" onClick={() => setStoreType(st.id)} className={`p-4 border text-left flex items-center gap-3 transition-all duration-200 ${storeType === st.id ? "border-[#C9A227] bg-[#C9A227]/8" : "border-white/6 hover:border-white/20 bg-[#0E0E0E]"}`}>
                            <div className={`w-4 h-4 border flex items-center justify-center shrink-0 ${storeType === st.id ? "border-[#C9A227] bg-[#C9A227]" : "border-white/20"}`}>{storeType === st.id && <Check size={9} className="text-[#0A0A0A]" />}</div>
                            <span className="font-body text-xs text-white/70">{t(st.de, st.en)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div><label className="hw-label">{t("Nachricht (optional)", "Message (optional)")}</label><textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} className="hw-input resize-none" /></div>
                    <div className="flex justify-end pt-2"><button type="submit" className="btn-gold inline-flex items-center gap-2"><Send size={14} />{t("Händleranfrage senden", "Send Dealer Request")}</button></div>
                  </form>
                </div>
              )}
              {b2bSubTab === "reseller" && resellerSubmitted && (
                <div className="max-w-xl text-center py-16">
                  <HShieldLogo size={56} />
                  <h3 className="font-display text-4xl text-white mt-6 mb-4">{t("Anfrage eingegangen.", "Request Received.")}</h3>
                  <p className="font-body text-white/50 text-base mb-8">{t("Daniel oder Benjamin melden sich innerhalb von 48 Stunden persönlich.", "Daniel or Benjamin will personally contact you within 48 hours.")}</p>
                  <button onClick={() => { setResellerSubmitted(false); setCompany(""); setContactName(""); setEmail(""); setPhone(""); setCity(""); setCountry(""); setStoreType(""); setMessage(""); }} className="btn-ghost inline-flex items-center gap-2">{t("Neue Anfrage", "New Request")} <ArrowRight size={14} /></button>
                </div>
              )}

              {/* Reorder Form */}
              {b2bSubTab === "reorder" && !reorderSubmitted && (
                <div className="max-w-3xl">
                  <h3 className="font-display text-3xl md:text-4xl text-white mb-3">{t("Nachbestellung für B2B-Kunden.", "Reorder for B2B Customers.")}</h3>
                  <p className="font-body text-white/50 text-base leading-relaxed mb-8">{t("Als bestehender Hellweg®-Händler kannst du hier direkt Nachbestellungen aufgeben.", "As an existing Hellweg® dealer, you can place reorders directly here.")}</p>
                  <form onSubmit={handleReorderSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div><label className="hw-label">{t("Kundennummer *", "Customer Number *")}</label><input type="text" value={roCustomerId} onChange={e => setRoCustomerId(e.target.value)} required className="hw-input" placeholder="HW-B2B-XXXXX" /></div>
                      <div><label className="hw-label">{t("Firmenname *", "Company Name *")}</label><input type="text" value={roCompany} onChange={e => setRoCompany(e.target.value)} required className="hw-input" /></div>
                      <div className="md:col-span-2"><label className="hw-label">{t("E-Mail *", "Email *")}</label><input type="email" value={roEmail} onChange={e => setRoEmail(e.target.value)} required className="hw-input" /></div>
                    </div>
                    <div><label className="hw-label">{t("Bestellte Produkte *", "Ordered Products *")}</label><textarea value={roProducts} onChange={e => setRoProducts(e.target.value)} required rows={4} placeholder={t("z.B. 10x IWB Glock 17, Black Kydex", "e.g. 10x IWB Glock 17, Black Kydex")} className="hw-input resize-none" /></div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div><label className="hw-label">{t("Gesamtmenge (Stück)", "Total Quantity (Units)")}</label><input type="number" min="1" value={roQuantity} onChange={e => setRoQuantity(e.target.value)} className="hw-input" /></div>
                      <div><label className="hw-label">{t("Anmerkungen / Liefertermin", "Notes / Delivery Date")}</label><input type="text" value={roNotes} onChange={e => setRoNotes(e.target.value)} className="hw-input" /></div>
                    </div>
                    <div className="flex justify-end pt-2"><button type="submit" className="btn-gold inline-flex items-center gap-2"><RefreshCw size={14} />{t("Nachbestellung aufgeben", "Place Reorder")}</button></div>
                  </form>
                </div>
              )}
              {b2bSubTab === "reorder" && reorderSubmitted && (
                <div className="max-w-xl text-center py-16">
                  <HShieldLogo size={56} />
                  <h3 className="font-display text-4xl text-white mt-6 mb-4">{t("Nachbestellung eingegangen.", "Reorder Received.")}</h3>
                  <p className="font-body text-white/50 text-base mb-8">{t("Wir bearbeiten sie bevorzugt und senden eine Auftragsbestätigung.", "We'll process it with priority and send an order confirmation.")}</p>
                  <button onClick={() => { setReorderSubmitted(false); setRoCustomerId(""); setRoCompany(""); setRoEmail(""); setRoProducts(""); setRoQuantity(""); setRoNotes(""); }} className="btn-ghost inline-flex items-center gap-2">{t("Weitere Bestellung", "Another Order")} <ArrowRight size={14} /></button>
                </div>
              )}
            </div>
          )}

          {/* ══ B2G ══ */}
          {activeTab === "b2g" && !govSubmitted && (
            <div className="max-w-3xl">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Building2 size={20} className="text-[#C9A227]" />
                  <span className="font-mono-custom text-[#C9A227] text-[10px] tracking-[0.3em] uppercase">{t("Vertraulich · Diskret · Zuverlässig", "Confidential · Discreet · Reliable")}</span>
                </div>
                <h3 className="font-display text-3xl md:text-4xl text-white mb-4">
                  {t("Ausrüstung für Behörden & Sicherheitskräfte.", "Equipment for Authorities & Security Forces.")}
                </h3>
                <p className="font-body text-white/50 text-base leading-relaxed mb-6">
                  {t(
                    "Hellweg® beliefert Polizei, Bundeswehr, Zoll und behördliche Sicherheitsdienste mit maßgefertigten Kydex-Holstern. Behördenaufträge werden diskret, schnell und nach Spezifikation abgewickelt – auf Wunsch auch mit behördenspezifischer Kennzeichnung.",
                    "Hellweg® supplies police, military, customs and government security services with custom-made Kydex holsters. Government orders are handled discreetly, quickly and to specification – with agency-specific markings on request."
                  )}
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  {[
                    { de: "Rahmenverträge möglich", en: "Framework contracts available" },
                    { de: "Behördenspezifische Kennzeichnung", en: "Agency-specific markings" },
                    { de: "Diskreter Versand & Abwicklung", en: "Discreet shipping & handling" },
                    { de: "Schnelle Lieferzeiten", en: "Fast delivery times" },
                    { de: "Staffelpreise ab 10 Stück", en: "Volume pricing from 10 units" },
                    { de: "Persönlicher Ansprechpartner", en: "Personal point of contact" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 border border-white/6 px-4 py-3">
                      <Check size={12} className="text-[#C9A227] shrink-0" />
                      <span className="font-body text-white/60 text-xs">{t(item.de, item.en)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleGovSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div><label className="hw-label">{t("Behörde / Organisation *", "Agency / Organisation *")}</label><input type="text" value={govAgency} onChange={e => setGovAgency(e.target.value)} required className="hw-input" placeholder={t("z.B. Polizei NRW", "e.g. Police NRW")} /></div>
                  <div><label className="hw-label">{t("Ansprechpartner *", "Contact Person *")}</label><input type="text" value={govContact} onChange={e => setGovContact(e.target.value)} required className="hw-input" /></div>
                  <div><label className="hw-label">{t("Dienstliche E-Mail *", "Official Email *")}</label><input type="email" value={govEmail} onChange={e => setGovEmail(e.target.value)} required className="hw-input" /></div>
                  <div><label className="hw-label">{t("Diensttelefon", "Official Phone")}</label><input type="tel" value={govPhone} onChange={e => setGovPhone(e.target.value)} className="hw-input" /></div>
                </div>
                <div>
                  <label className="hw-label">{t("Art der Behörde *", "Type of Agency *")}</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {govTypes.map(gt => (
                      <button key={gt.id} type="button" onClick={() => setGovType(gt.id)} className={`p-4 border text-left flex items-center gap-3 transition-all duration-200 ${govType === gt.id ? "border-[#C9A227] bg-[#C9A227]/8" : "border-white/6 hover:border-white/20 bg-[#0E0E0E]"}`}>
                        <div className={`w-4 h-4 border flex items-center justify-center shrink-0 ${govType === gt.id ? "border-[#C9A227] bg-[#C9A227]" : "border-white/20"}`}>{govType === gt.id && <Check size={9} className="text-[#0A0A0A]" />}</div>
                        <span className="font-body text-xs text-white/70">{t(gt.de, gt.en)}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div><label className="hw-label">{t("Bedarf / Anforderung", "Requirement / Specification")}</label><textarea value={govRequirement} onChange={e => setGovRequirement(e.target.value)} rows={3} placeholder={t("Waffenmodell, Trageart, Sonderwünsche...", "Firearm model, carry type, special requirements...")} className="hw-input resize-none" /></div>
                  <div><label className="hw-label">{t("Benötigte Stückzahl", "Required Quantity")}</label><input type="number" min="1" value={govQuantity} onChange={e => setGovQuantity(e.target.value)} className="hw-input" placeholder="z.B. 50" /></div>
                </div>
                <div className="bg-[#C9A227]/5 border border-[#C9A227]/15 px-5 py-4 flex items-start gap-3">
                  <Shield size={14} className="text-[#C9A227] shrink-0 mt-0.5" />
                  <p className="font-body text-white/40 text-xs leading-relaxed">
                    {t("Alle Behördenanfragen werden vertraulich behandelt. Deine Daten werden ausschließlich zur Bearbeitung deiner Anfrage verwendet und nicht an Dritte weitergegeben.", "All government inquiries are treated confidentially. Your data is used exclusively to process your inquiry and is not passed on to third parties.")}
                  </p>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="btn-gold inline-flex items-center gap-2">
                    <Send size={14} />
                    {t("Behördenanfrage senden", "Send Government Inquiry")}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "b2g" && govSubmitted && (
            <div className="max-w-xl text-center py-16">
              <HShieldLogo size={56} />
              <h3 className="font-display text-4xl text-white mt-6 mb-4">{t("Anfrage eingegangen.", "Inquiry Received.")}</h3>
              <p className="font-body text-white/50 text-base mb-8">{t("Deine Behördenanfrage wird vertraulich bearbeitet. Wir melden uns innerhalb von 24 Stunden.", "Your government inquiry will be processed confidentially. We'll respond within 24 hours.")}</p>
              <button onClick={() => { setGovSubmitted(false); setGovAgency(""); setGovContact(""); setGovEmail(""); setGovPhone(""); setGovType(""); setGovRequirement(""); setGovQuantity(""); }} className="btn-ghost inline-flex items-center gap-2">{t("Neue Anfrage", "New Inquiry")} <ArrowRight size={14} /></button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

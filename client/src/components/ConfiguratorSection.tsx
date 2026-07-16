/*
 * HELLWEG EUROPE – Holster Configurator v2
 * Apple-Inspired: Visual swatches for ALL patterns (camo/carbon/solid)
 * Kydex® by Sekisui Kydex LLC, USA
 */
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Check, ChevronRight, Send, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

// ── KYDEX SOLID COLORS ──
const solidColors = [
  { name: "Black", hex: "#1a1a1a" },
  { name: "Dark Gray", hex: "#3a3a3a" },
  { name: "Storm Grey", hex: "#6b7280" },
  { name: "MAS Grey", hex: "#8a9099" },
  { name: "Coyote Grey", hex: "#9b9080" },
  { name: "Light Grey", hex: "#b0b0b0" },
  { name: "Arctic White", hex: "#f0ede8" },
  { name: "FDE", hex: "#8b7355" },
  { name: "Coyote Brown", hex: "#7d6545" },
  { name: "Desert Tan", hex: "#c8a96e" },
  { name: "OD Green", hex: "#4a5240" },
  { name: "Army Green", hex: "#3d4a2e" },
  { name: "Foliage Green", hex: "#5a6b4a" },
  { name: "Police Blue", hex: "#1e3a5f" },
  { name: "Royal Blue", hex: "#1a3a8f" },
  { name: "Tiffany Blue", hex: "#81d4c8" },
  { name: "Zombie Green", hex: "#7bc043" },
  { name: "Blood Red", hex: "#8b1a1a" },
  { name: "EMT Red", hex: "#cc2200" },
  { name: "Hunter Orange", hex: "#e8630a" },
  { name: "Purple", hex: "#5a2d82" },
  { name: "Neon Pink", hex: "#e91e8c" },
];

// ── KYDEX INSPIRED COLORS (designLab®) ──
const inspiredColors = [
  { name: "3AM", hex: "#1a0a2e", group: "Impulse" },
  { name: "Appletini", hex: "#5a8a3a", group: "Impulse" },
  { name: "The Chairman", hex: "#2c2c3e", group: "Impulse" },
  { name: "Wedding Chapel", hex: "#f5f0e8", group: "Impulse" },
  { name: "Wildcard", hex: "#c8a020", group: "Impulse" },
  { name: "Bayou", hex: "#3a5a4a", group: "Repose" },
  { name: "Blue Bonnet", hex: "#4a7aaa", group: "Repose" },
  { name: "Corduroy", hex: "#6b5a3a", group: "Repose" },
  { name: "Cotton", hex: "#e8e4dc", group: "Repose" },
  { name: "Flax", hex: "#c8b87a", group: "Repose" },
  { name: "Old Silver", hex: "#8a8a8a", group: "Repose" },
  { name: "Smoked", hex: "#4a4a4a", group: "Repose" },
  { name: "After Dark", hex: "#0a0a1a", group: "Nocturne" },
  { name: "Bolt", hex: "#f0c030", group: "Nocturne" },
  { name: "Burnt Toast", hex: "#3a2010", group: "Nocturne" },
  { name: "Emerald City", hex: "#1a6a3a", group: "Nocturne" },
  { name: "Napoleon", hex: "#1a1a6a", group: "Nocturne" },
  { name: "Ocean Requiem", hex: "#0a3a5a", group: "Nocturne" },
  { name: "Academy", hex: "#1e3a5f", group: "Nautical" },
  { name: "Black Watch", hex: "#1a2a1a", group: "Nautical" },
  { name: "First Mate", hex: "#c8c0a8", group: "Nautical" },
  { name: "Oil Skin", hex: "#2a2010", group: "Nautical" },
  { name: "Bank Note", hex: "#2a4a2a", group: "Currency" },
  { name: "Cash Out", hex: "#8a7a3a", group: "Currency" },
  { name: "Iron Safe", hex: "#3a3a3a", group: "Currency" },
  { name: "Old Money", hex: "#4a5a3a", group: "Currency" },
  { name: "Wax Seal", hex: "#6a1a1a", group: "Currency" },
];

// ── CAMO PATTERNS – with visual CSS gradients ──
const camoPatterns = [
  {
    name: "Crye Multicam",
    desc: "Original Multicam",
    // Multicam: earthy tan/brown/green blotches
    style: {
      background: `
        radial-gradient(ellipse 30% 20% at 20% 30%, #6b5a3a 0%, transparent 70%),
        radial-gradient(ellipse 20% 30% at 70% 60%, #4a5240 0%, transparent 70%),
        radial-gradient(ellipse 25% 25% at 50% 20%, #8b7355 0%, transparent 60%),
        radial-gradient(ellipse 15% 20% at 80% 30%, #3d4a2e 0%, transparent 60%),
        radial-gradient(ellipse 20% 15% at 30% 70%, #c8a96e 0%, transparent 60%),
        #7d6545`
    }
  },
  {
    name: "Multicam Black",
    desc: "Dark tactical",
    style: {
      background: `
        radial-gradient(ellipse 30% 20% at 20% 30%, #2a2a2a 0%, transparent 70%),
        radial-gradient(ellipse 20% 30% at 70% 60%, #1a1a1a 0%, transparent 70%),
        radial-gradient(ellipse 25% 25% at 50% 20%, #3a3a3a 0%, transparent 60%),
        radial-gradient(ellipse 15% 20% at 80% 30%, #111111 0%, transparent 60%),
        #222222`
    }
  },
  {
    name: "Multicam Arid",
    desc: "Desert environment",
    style: {
      background: `
        radial-gradient(ellipse 30% 20% at 20% 30%, #c8a96e 0%, transparent 70%),
        radial-gradient(ellipse 20% 30% at 70% 60%, #d4b87a 0%, transparent 70%),
        radial-gradient(ellipse 25% 25% at 50% 20%, #b89a5a 0%, transparent 60%),
        radial-gradient(ellipse 15% 20% at 80% 30%, #8b7355 0%, transparent 60%),
        #c8a96e`
    }
  },
  {
    name: "Multicam Tropic",
    desc: "Jungle environment",
    style: {
      background: `
        radial-gradient(ellipse 30% 20% at 20% 30%, #2d5a2d 0%, transparent 70%),
        radial-gradient(ellipse 20% 30% at 70% 60%, #1a3a1a 0%, transparent 70%),
        radial-gradient(ellipse 25% 25% at 50% 20%, #4a7a4a 0%, transparent 60%),
        radial-gradient(ellipse 15% 20% at 80% 30%, #3d5a2e 0%, transparent 60%),
        #2d4a2d`
    }
  },
  {
    name: "A-TACS AU",
    desc: "Arid/Urban",
    style: {
      background: `
        repeating-conic-gradient(#9b8060 0% 10%, #7d6545 10% 20%, #b89a6a 20% 30%, #6b5a3a 30% 40%) 0 0 / 8px 8px,
        #8b7355`
    }
  },
  {
    name: "A-TACS FG",
    desc: "Foliage/Green",
    style: {
      background: `
        repeating-conic-gradient(#4a6a3a 0% 10%, #2d4a2d 10% 20%, #5a7a4a 20% 30%, #3d5a2e 30% 40%) 0 0 / 8px 8px,
        #4a5a3a`
    }
  },
  {
    name: "A-TACS LE",
    desc: "Law Enforcement",
    style: {
      background: `
        repeating-conic-gradient(#2a3a4a 0% 10%, #1a2a3a 10% 20%, #3a4a5a 20% 30%, #1e2e3e 30% 40%) 0 0 / 8px 8px,
        #1e3a5f`
    }
  },
  {
    name: "Kryptek Highlander",
    desc: "Mountain terrain",
    style: {
      background: `
        repeating-linear-gradient(60deg, #8b7355 0px, #8b7355 2px, transparent 2px, transparent 8px),
        repeating-linear-gradient(-60deg, #6b5a3a 0px, #6b5a3a 2px, transparent 2px, transparent 8px),
        repeating-linear-gradient(0deg, #c8a96e 0px, #c8a96e 1px, transparent 1px, transparent 6px),
        #9b8060`
    }
  },
  {
    name: "Kryptek Nomad",
    desc: "Desert terrain",
    style: {
      background: `
        repeating-linear-gradient(60deg, #c8a96e 0px, #c8a96e 2px, transparent 2px, transparent 8px),
        repeating-linear-gradient(-60deg, #b89a5a 0px, #b89a5a 2px, transparent 2px, transparent 8px),
        repeating-linear-gradient(0deg, #d4b87a 0px, #d4b87a 1px, transparent 1px, transparent 6px),
        #c8a96e`
    }
  },
  {
    name: "Kryptek Typhon",
    desc: "Dark tactical",
    style: {
      background: `
        repeating-linear-gradient(60deg, #1a1a1a 0px, #1a1a1a 2px, transparent 2px, transparent 8px),
        repeating-linear-gradient(-60deg, #2a2a2a 0px, #2a2a2a 2px, transparent 2px, transparent 8px),
        repeating-linear-gradient(0deg, #111111 0px, #111111 1px, transparent 1px, transparent 6px),
        #1e1e1e`
    }
  },
  {
    name: "Kryptek OD Green",
    desc: "Woodland",
    style: {
      background: `
        repeating-linear-gradient(60deg, #4a5240 0px, #4a5240 2px, transparent 2px, transparent 8px),
        repeating-linear-gradient(-60deg, #3d4a2e 0px, #3d4a2e 2px, transparent 2px, transparent 8px),
        repeating-linear-gradient(0deg, #5a6b4a 0px, #5a6b4a 1px, transparent 1px, transparent 6px),
        #4a5240`
    }
  },
  {
    name: "OG Woodland",
    desc: "Classic M81",
    style: {
      background: `
        radial-gradient(ellipse 40% 30% at 15% 25%, #2d4a1a 0%, transparent 60%),
        radial-gradient(ellipse 30% 40% at 75% 65%, #1a2a0a 0%, transparent 60%),
        radial-gradient(ellipse 35% 25% at 55% 15%, #3d5a2e 0%, transparent 60%),
        radial-gradient(ellipse 25% 35% at 85% 35%, #4a3a1a 0%, transparent 60%),
        radial-gradient(ellipse 20% 20% at 35% 75%, #2a4a1a 0%, transparent 60%),
        #3a4a2a`
    }
  },
  {
    name: "Woodland Notte",
    desc: "Night woodland",
    style: {
      background: `
        radial-gradient(ellipse 40% 30% at 15% 25%, #0a1a05 0%, transparent 60%),
        radial-gradient(ellipse 30% 40% at 75% 65%, #050f02 0%, transparent 60%),
        radial-gradient(ellipse 35% 25% at 55% 15%, #0d1a08 0%, transparent 60%),
        #0a0f05`
    }
  },
  {
    name: "Hexcam Specter13",
    desc: "Hex pattern",
    style: {
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='18'%3E%3Cpolygon points='10,1 19,5.5 19,12.5 10,17 1,12.5 1,5.5' fill='none' stroke='rgba(100,120,80,0.6)' stroke-width='0.8'/%3E%3Cpolygon points='10,4 16,7 16,11 10,14 4,11 4,7' fill='rgba(60,80,40,0.4)'/%3E%3C/svg%3E"),
        linear-gradient(135deg, #3a4a2a, #2a3a1a)`,
      backgroundSize: "20px 18px, 100% 100%"
    }
  },
  {
    name: "Recon Dust",
    desc: "Desert recon",
    style: {
      background: `
        radial-gradient(circle 8px at 25% 40%, rgba(180,150,100,0.8) 0%, transparent 100%),
        radial-gradient(circle 6px at 65% 25%, rgba(160,130,80,0.6) 0%, transparent 100%),
        radial-gradient(circle 10px at 45% 70%, rgba(200,170,120,0.5) 0%, transparent 100%),
        radial-gradient(circle 7px at 80% 60%, rgba(140,110,70,0.7) 0%, transparent 100%),
        #c8a96e`
    }
  },
  {
    name: "Recon Fog",
    desc: "Urban recon",
    style: {
      background: `
        radial-gradient(circle 8px at 25% 40%, rgba(100,110,120,0.8) 0%, transparent 100%),
        radial-gradient(circle 6px at 65% 25%, rgba(80,90,100,0.6) 0%, transparent 100%),
        radial-gradient(circle 10px at 45% 70%, rgba(120,130,140,0.5) 0%, transparent 100%),
        #6b7280`
    }
  },
  {
    name: "Recon Haze",
    desc: "Transitional",
    style: {
      background: `linear-gradient(135deg, #5a6b4a 0%, #8b7355 50%, #6b7280 100%)`
    }
  },
  {
    name: "Recon Monsoon",
    desc: "Wet environment",
    style: {
      background: `
        repeating-linear-gradient(90deg, rgba(30,60,80,0.4) 0px, rgba(30,60,80,0.4) 1px, transparent 1px, transparent 4px),
        repeating-linear-gradient(0deg, rgba(20,50,70,0.3) 0px, rgba(20,50,70,0.3) 1px, transparent 1px, transparent 6px),
        #1e3a5f`
    }
  },
];

// ── CARBON FIBER PATTERNS ──
const carbonFiber = [
  { name: "Black", baseHex: "#1a1a1a", weaveLight: "rgba(255,255,255,0.12)", weaveDark: "rgba(0,0,0,0.5)" },
  { name: "FDE", baseHex: "#7d6040", weaveLight: "rgba(220,180,120,0.15)", weaveDark: "rgba(0,0,0,0.4)" },
  { name: "OD Green", baseHex: "#3a4a2a", weaveLight: "rgba(120,160,80,0.15)", weaveDark: "rgba(0,0,0,0.4)" },
  { name: "Coyote Tan", baseHex: "#b09060", weaveLight: "rgba(220,190,140,0.2)", weaveDark: "rgba(0,0,0,0.35)" },
  { name: "Blue", baseHex: "#1a2a6a", weaveLight: "rgba(80,120,220,0.2)", weaveDark: "rgba(0,0,0,0.5)" },
  { name: "Blood Red", baseHex: "#6a1010", weaveLight: "rgba(200,60,60,0.2)", weaveDark: "rgba(0,0,0,0.5)" },
  { name: "Foliage", baseHex: "#4a5a3a", weaveLight: "rgba(120,160,80,0.15)", weaveDark: "rgba(0,0,0,0.4)" },
];

// Carbon fiber weave CSS pattern
const getCarbonStyle = (c: typeof carbonFiber[0]) => ({
  backgroundColor: c.baseHex,
  backgroundImage: `
    repeating-linear-gradient(
      45deg,
      ${c.weaveLight} 0px, ${c.weaveLight} 1px,
      transparent 1px, transparent 3px,
      ${c.weaveDark} 3px, ${c.weaveDark} 4px,
      transparent 4px, transparent 6px
    ),
    repeating-linear-gradient(
      -45deg,
      ${c.weaveLight} 0px, ${c.weaveLight} 1px,
      transparent 1px, transparent 3px,
      ${c.weaveDark} 3px, ${c.weaveDark} 4px,
      transparent 4px, transparent 6px
    )
  `,
  backgroundSize: "6px 6px"
});

const holsterTypes = [
  { id: "iwb", de: "IWB – Inside Waistband", en: "IWB – Inside Waistband" },
  { id: "owb", de: "OWB – Outside Waistband", en: "OWB – Outside Waistband" },
  { id: "shoulder", de: "Schulterholster", en: "Shoulder Holster" },
  { id: "mag", de: "Magazintasche", en: "Magazine Carrier" },
  { id: "duty", de: "Tactical / Duty Holster", en: "Tactical / Duty Holster" },
  { id: "custom", de: "Sonderanfertigung", en: "Custom Special Order" },
];

const sides = [
  { id: "right", de: "Rechts", en: "Right" },
  { id: "left", de: "Links", en: "Left" },
  { id: "both", de: "Beidhändig", en: "Ambidextrous" },
];

const extras = [
  { id: "sweatguard", de: "Sweatguard (Schweißschutz)", en: "Sweatguard" },
  { id: "retention", de: "Einstellbare Retention", en: "Adjustable Retention" },
  { id: "lowride", de: "Low Ride Clip", en: "Low Ride Clip" },
  { id: "highride", de: "High Ride Clip", en: "High Ride Clip" },
  { id: "molle", de: "MOLLE-Befestigung", en: "MOLLE Attachment" },
  { id: "mag_extra", de: "Passende Magazintasche", en: "Matching Magazine Carrier" },
];

type ColorTab = "solid" | "inspired" | "camo" | "carbon";

const H_SYMBOL = "/manus-storage/h-symbol-only_701841e6.png";
const HShieldLogo = ({ size = 32 }: { size?: number }) => (
  <img src={H_SYMBOL} alt="Hellweg H" width={size} height={size} style={{ objectFit: 'contain' }} />
);

export default function ConfiguratorSection() {
  const { t } = useLanguage();
  const headerRef = useScrollReveal(0);
  const formRef = useScrollReveal(150);

  const [step, setStep] = useState(1);
  const [holsterType, setHolsterType] = useState("");
  const [weapon, setWeapon] = useState("");
  const [colorTab, setColorTab] = useState<ColorTab>("solid");
  const [selectedColor, setSelectedColor] = useState("");
  const [side, setSide] = useState("");
  const [selectedExtras, setSelectedExtras] = useState<string[]>(["sweatguard"]);
  const [specialWish, setSpecialWish] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const sendMutation = trpc.contact.send.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success(t(
        "Anfrage erfolgreich gesendet! Wir melden uns innerhalb von 48 Stunden.",
        "Request sent successfully! We'll get back to you within 48 hours."
      ));
    },
    onError: () => {
      toast.error(t("Fehler beim Senden. Bitte schreibe direkt an info@hellweg.eu", "Error sending. Please write directly to info@hellweg.eu"));
    },
    onSettled: () => setSending(false),
  });

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !holsterType || !weapon) {
      toast.error(t("Bitte fülle alle Pflichtfelder aus.", "Please fill in all required fields."));
      return;
    }
    setSending(true);
    sendMutation.mutate({
      type: "configurator",
      name,
      email,
      phone: phone || undefined,
      holsterType,
      weapon,
      color: selectedColor || undefined,
      side: side || undefined,
      options: selectedExtras.length > 0 ? selectedExtras : undefined,
      message: specialWish || undefined,
    });
  };

  const steps = [
    { n: 1, de: "Holster-Typ", en: "Holster Type" },
    { n: 2, de: "Waffe", en: "Firearm" },
    { n: 3, de: "Material & Farbe", en: "Material & Color" },
    { n: 4, de: "Trageseite", en: "Carry Side" },
    { n: 5, de: "Optionen", en: "Options" },
    { n: 6, de: "Anfrage senden", en: "Send Request" },
  ];

  return (
    <section id="configurator" className="bg-[#0A0A0A] py-24 md:py-40">
      <div className="container">

        {/* ── HEADER ── */}
        <div ref={headerRef} className="reveal mb-20">
          <div className="flex items-center gap-4 mb-6">
            <HShieldLogo size={36} />
            <p className="font-mono-custom text-[#C9A227] text-[11px] tracking-[0.35em] uppercase">
              {t("Konfigurator", "Configurator")}
            </p>
          </div>
          <h2 className="section-headline text-white mb-6">
            {t("Dein Holster.", "Your Holster.")}
            <br />
            <span className="text-[#C9A227]">{t("Deine Regeln.", "Your Rules.")}</span>
          </h2>
          <p className="section-subline max-w-2xl">
            {t(
              "Konfiguriere deinen Traumholster in wenigen Schritten. Über 50 Kydex-Farben und Tarnmuster von Sekisui Kydex LLC (USA). Wir fertigen ihn exakt nach deinen Angaben – mit dem Hellweg-H auf der Außenfläche.",
              "Configure your dream holster in just a few steps. Over 50 Kydex colors and camo patterns by Sekisui Kydex LLC (USA). We'll craft it exactly to your specifications – with the Hellweg H on the outer surface."
            )}
          </p>
        </div>

        {/* ── STEP INDICATOR ── */}
        <div className="flex flex-wrap border border-white/6 mb-12 overflow-hidden">
          {steps.map((s) => (
            <button
              key={s.n}
              onClick={() => setStep(s.n)}
              className={`flex-1 min-w-[80px] py-3 px-3 text-center transition-all duration-200 border-r border-white/6 last:border-r-0 ${
                step === s.n
                  ? "bg-[#C9A227] text-[#0A0A0A]"
                  : step > s.n
                  ? "bg-[#1a1a1a] text-[#C9A227]"
                  : "bg-transparent text-white/25 hover:text-white/50"
              }`}
            >
              <span className="font-mono-custom text-[9px] tracking-[0.12em] uppercase block">
                {s.n}. {t(s.de, s.en)}
              </span>
            </button>
          ))}
        </div>

        <div ref={formRef} className="reveal">
          <form onSubmit={handleSubmit}>

            {/* ── STEP 1: Holster Type ── */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-display text-3xl md:text-4xl text-white mb-8">
                  {t("Welchen Holster-Typ möchtest du?", "Which holster type would you like?")}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {holsterTypes.map(ht => (
                    <button
                      key={ht.id}
                      type="button"
                      onClick={() => setHolsterType(ht.id)}
                      className={`p-6 border text-left transition-all duration-300 group ${
                        holsterType === ht.id
                          ? "border-[#C9A227] bg-[#C9A227]/8"
                          : "border-white/6 hover:border-white/20 bg-[#0E0E0E]"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-colors ${
                          holsterType === ht.id ? "border-[#C9A227] bg-[#C9A227]" : "border-white/20"
                        }`}>
                          {holsterType === ht.id && <Check size={10} className="text-[#0A0A0A]" />}
                        </div>
                      </div>
                      <span className="font-body text-sm text-white/80 leading-snug">
                        {t(ht.de, ht.en)}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end mt-10">
                  <button
                    type="button"
                    disabled={!holsterType}
                    onClick={() => setStep(2)}
                    className="btn-gold inline-flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {t("Weiter", "Next")} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Weapon ── */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="font-display text-3xl md:text-4xl text-white mb-8">
                  {t("Für welche Waffe?", "For which firearm?")}
                </h3>
                <div>
                  <label className="hw-label">{t("Hersteller & Modell", "Manufacturer & Model")}</label>
                  <input
                    type="text"
                    value={weapon}
                    onChange={e => setWeapon(e.target.value)}
                    placeholder={t("z.B. Glock 17, SIG Sauer P226, Walther PPQ, CZ 75 ...", "e.g. Glock 17, SIG Sauer P226, Walther PPQ, CZ 75 ...")}
                    className="hw-input text-lg"
                  />
                  <p className="font-mono-custom text-white/20 text-[10px] tracking-widest uppercase mt-3">
                    {t("Bitte Hersteller und Modell angeben – wir fertigen für jede Waffe", "Please specify manufacturer and model – we craft for every firearm")}
                  </p>
                </div>
                <div className="flex justify-between mt-10">
                  <button type="button" onClick={() => setStep(1)} className="btn-ghost">{t("Zurück", "Back")}</button>
                  <button
                    type="button"
                    disabled={!weapon.trim()}
                    onClick={() => setStep(3)}
                    className="btn-gold inline-flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {t("Weiter", "Next")} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Color & Material ── */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="font-display text-3xl md:text-4xl text-white mb-2">
                  {t("Material & Farbe wählen", "Choose Material & Color")}
                </h3>
                <p className="font-mono-custom text-[#C9A227]/60 text-[10px] tracking-[0.3em] uppercase mb-8">
                  Kydex® by Sekisui Kydex LLC, USA
                </p>

                {/* Tabs */}
                <div className="flex border-b border-white/6 mb-8">
                  {([
                    { id: "solid" as ColorTab, de: "Unifarben", en: "Solid Colors", count: solidColors.length },
                    { id: "inspired" as ColorTab, de: "designLab®", en: "designLab®", count: inspiredColors.length },
                    { id: "camo" as ColorTab, de: "Tarnmuster", en: "Camo Patterns", count: camoPatterns.length },
                    { id: "carbon" as ColorTab, de: "Carbon Fiber", en: "Carbon Fiber", count: carbonFiber.length },
                  ]).map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setColorTab(tab.id)}
                      className={`px-4 py-3 font-mono-custom text-[10px] tracking-widest uppercase transition-colors border-b-2 -mb-px flex items-center gap-2 ${
                        colorTab === tab.id
                          ? "border-[#C9A227] text-[#C9A227]"
                          : "border-transparent text-white/25 hover:text-white/50"
                      }`}
                    >
                      {t(tab.de, tab.en)}
                      <span className={`text-[8px] ${colorTab === tab.id ? "text-[#C9A227]/60" : "text-white/15"}`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* ── SOLID COLORS ── */}
                {colorTab === "solid" && (
                  <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-11 gap-2">
                    {solidColors.map(c => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        title={c.name}
                        className={`group flex flex-col items-center gap-1.5 p-1.5 border transition-all duration-200 ${
                          selectedColor === c.name ? "border-[#C9A227]" : "border-transparent hover:border-white/15"
                        }`}
                      >
                        <div
                          className="w-9 h-9 relative"
                          style={{ backgroundColor: c.hex, border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                          {selectedColor === c.name && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <Check size={12} className="text-white drop-shadow-lg" />
                            </div>
                          )}
                        </div>
                        <span className="font-mono-custom text-[7px] text-white/35 text-center leading-tight max-w-[44px] truncate">
                          {c.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* ── INSPIRED COLORS ── */}
                {colorTab === "inspired" && (
                  <div>
                    {["Impulse", "Repose", "Nocturne", "Nautical", "Currency"].map(group => {
                      const groupColors = inspiredColors.filter(c => c.group === group);
                      return (
                        <div key={group} className="mb-6">
                          <p className="font-mono-custom text-white/20 text-[9px] tracking-[0.3em] uppercase mb-3">{group}</p>
                          <div className="flex flex-wrap gap-2">
                            {groupColors.map(c => (
                              <button
                                key={c.name}
                                type="button"
                                onClick={() => setSelectedColor(c.name)}
                                title={c.name}
                                className={`flex flex-col items-center gap-1.5 p-1.5 border transition-all duration-200 ${
                                  selectedColor === c.name ? "border-[#C9A227]" : "border-transparent hover:border-white/15"
                                }`}
                              >
                                <div
                                  className="w-9 h-9 relative"
                                  style={{ backgroundColor: c.hex, border: "1px solid rgba(255,255,255,0.08)" }}
                                >
                                  {selectedColor === c.name && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                      <Check size={12} className="text-white drop-shadow-lg" />
                                    </div>
                                  )}
                                </div>
                                <span className="font-mono-custom text-[7px] text-white/35 text-center leading-tight max-w-[44px] truncate">
                                  {c.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ── CAMO PATTERNS – VISUAL SWATCHES ── */}
                {colorTab === "camo" && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {camoPatterns.map(c => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        title={c.name}
                        className={`group flex flex-col items-center gap-2 p-2 border transition-all duration-200 ${
                          selectedColor === c.name ? "border-[#C9A227]" : "border-transparent hover:border-white/15"
                        }`}
                      >
                        {/* Visual pattern swatch */}
                        <div
                          className="w-full h-14 relative overflow-hidden"
                          style={{
                            ...c.style,
                            border: "1px solid rgba(255,255,255,0.08)"
                          }}
                        >
                          {selectedColor === c.name && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Check size={14} className="text-white drop-shadow-lg" />
                            </div>
                          )}
                        </div>
                        <div className="text-center">
                          <p className="font-mono-custom text-[7px] text-white/50 leading-tight">{c.name}</p>
                          <p className="font-mono-custom text-[6px] text-white/25 leading-tight mt-0.5">{c.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* ── CARBON FIBER – VISUAL WEAVE SWATCHES ── */}
                {colorTab === "carbon" && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3">
                    {carbonFiber.map(c => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(`Carbon Fiber ${c.name}`)}
                        title={`Carbon Fiber ${c.name}`}
                        className={`group flex flex-col items-center gap-2 p-2 border transition-all duration-200 ${
                          selectedColor === `Carbon Fiber ${c.name}` ? "border-[#C9A227]" : "border-transparent hover:border-white/15"
                        }`}
                      >
                        {/* Carbon weave visual */}
                        <div
                          className="w-full h-14 relative overflow-hidden"
                          style={{
                            ...getCarbonStyle(c),
                            border: "1px solid rgba(255,255,255,0.08)"
                          }}
                        >
                          {selectedColor === `Carbon Fiber ${c.name}` && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Check size={14} className="text-white drop-shadow-lg" />
                            </div>
                          )}
                        </div>
                        <p className="font-mono-custom text-[7px] text-white/50 text-center leading-tight">
                          Carbon {c.name}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected indicator */}
                {selectedColor && (
                  <div className="mt-6 flex items-center gap-3 border border-[#C9A227]/30 bg-[#C9A227]/5 px-5 py-3">
                    <Check size={14} className="text-[#C9A227] shrink-0" />
                    <span className="font-mono-custom text-[#C9A227] text-xs tracking-widest uppercase">
                      {t("Gewählt:", "Selected:")} {selectedColor}
                    </span>
                  </div>
                )}

                <div className="flex justify-between mt-10">
                  <button type="button" onClick={() => setStep(2)} className="btn-ghost">{t("Zurück", "Back")}</button>
                  <button
                    type="button"
                    disabled={!selectedColor}
                    onClick={() => setStep(4)}
                    className="btn-gold inline-flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {t("Weiter", "Next")} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Carry Side ── */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="font-display text-3xl md:text-4xl text-white mb-8">
                  {t("Trageseite", "Carry Side")}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {sides.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSide(s.id)}
                      className={`p-8 border text-center transition-all duration-200 ${
                        side === s.id
                          ? "border-[#C9A227] bg-[#C9A227]/8"
                          : "border-white/6 hover:border-white/20 bg-[#0E0E0E]"
                      }`}
                    >
                      <div className={`w-5 h-5 border mx-auto mb-4 flex items-center justify-center ${
                        side === s.id ? "border-[#C9A227] bg-[#C9A227]" : "border-white/20"
                      }`}>
                        {side === s.id && <Check size={10} className="text-[#0A0A0A]" />}
                      </div>
                      <span className="font-body text-sm text-white/80">{t(s.de, s.en)}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-10">
                  <button type="button" onClick={() => setStep(3)} className="btn-ghost">{t("Zurück", "Back")}</button>
                  <button
                    type="button"
                    disabled={!side}
                    onClick={() => setStep(5)}
                    className="btn-gold inline-flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {t("Weiter", "Next")} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 5: Extras ── */}
            {step === 5 && (
              <div className="space-y-4">
                <h3 className="font-display text-3xl md:text-4xl text-white mb-8">
                  {t("Zusatzoptionen", "Additional Options")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {extras.map(ex => (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => toggleExtra(ex.id)}
                      className={`p-5 border text-left flex items-center gap-4 transition-all duration-200 ${
                        selectedExtras.includes(ex.id)
                          ? "border-[#C9A227] bg-[#C9A227]/8"
                          : "border-white/6 hover:border-white/20 bg-[#0E0E0E]"
                      }`}
                    >
                      <div className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-colors ${
                        selectedExtras.includes(ex.id) ? "border-[#C9A227] bg-[#C9A227]" : "border-white/20"
                      }`}>
                        {selectedExtras.includes(ex.id) && <Check size={10} className="text-[#0A0A0A]" />}
                      </div>
                      <span className="font-body text-sm text-white/80">{t(ex.de, ex.en)}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6">
                  <label className="hw-label">{t("Sonderwunsch (optional)", "Special Request (optional)")}</label>
                  <textarea
                    value={specialWish}
                    onChange={e => setSpecialWish(e.target.value)}
                    rows={3}
                    placeholder={t("Dein besonderer Wunsch...", "Your special request...")}
                    className="hw-input resize-none"
                  />
                </div>
                <div className="flex justify-between mt-10">
                  <button type="button" onClick={() => setStep(4)} className="btn-ghost">{t("Zurück", "Back")}</button>
                  <button type="button" onClick={() => setStep(6)} className="btn-gold inline-flex items-center gap-2">
                    {t("Weiter", "Next")} <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 6: Contact & Submit ── */}
            {step === 6 && !submitted && (
              <div className="space-y-6">
                <h3 className="font-display text-3xl md:text-4xl text-white mb-8">
                  {t("Anfrage senden", "Send Request")}
                </h3>

                {/* Summary */}
                <div className="bg-[#0E0E0E] border border-white/6 p-8 mb-8">
                  <div className="flex items-center gap-3 mb-6">
                    <HShieldLogo size={24} />
                    <p className="font-mono-custom text-[#C9A227] text-[10px] tracking-[0.3em] uppercase">
                      {t("Deine Konfiguration", "Your Configuration")}
                    </p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: t("Typ", "Type"), value: holsterTypes.find(h => h.id === holsterType)?.[t("de", "en") as "de" | "en"] || holsterType },
                      { label: t("Waffe", "Firearm"), value: weapon },
                      { label: t("Farbe/Muster", "Color/Pattern"), value: selectedColor },
                      { label: t("Trageseite", "Carry Side"), value: sides.find(s => s.id === side)?.[t("de", "en") as "de" | "en"] || side },
                      { label: t("Optionen", "Options"), value: selectedExtras.length > 0 ? selectedExtras.map(id => extras.find(e => e.id === id)?.[t("de","en") as "de"|"en"] || id).join(", ") : t("Keine", "None") },
                      ...(specialWish ? [{ label: t("Sonderwunsch", "Special Request"), value: specialWish }] : []),
                    ].map((row, i) => (
                      <div key={i} className="flex gap-6 py-2 border-b border-white/4 last:border-0">
                        <span className="font-mono-custom text-white/25 text-[10px] tracking-widest uppercase w-32 shrink-0 pt-0.5">{row.label}</span>
                        <span className="font-body text-white/70 text-sm">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="hw-label">{t("Name *", "Name *")}</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required className="hw-input" />
                  </div>
                  <div>
                    <label className="hw-label">{t("E-Mail *", "Email *")}</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="hw-input" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="hw-label">{t("Telefon (optional)", "Phone (optional)")}</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="hw-input" />
                  </div>
                </div>

                <div className="flex justify-between mt-10">
                  <button type="button" onClick={() => setStep(5)} className="btn-ghost">{t("Zurück", "Back")}</button>
                  <button type="submit" className="btn-gold inline-flex items-center gap-2">
                    <Send size={14} />
                    {t("Anfrage senden", "Send Request")}
                  </button>
                </div>
              </div>
            )}

            {/* ── SUCCESS ── */}
            {submitted && (
              <div className="text-center py-24">
                <div className="mb-8">
                  <HShieldLogo size={64} />
                </div>
                <h3 className="font-display text-4xl md:text-5xl text-white mb-6">
                  {t("Anfrage gesendet.", "Request Sent.")}
                </h3>
                <p className="font-body text-white/50 text-lg max-w-md mx-auto mb-10">
                  {t(
                    "Vielen Dank. Daniel oder Benjamin werden sich innerhalb von 48 Stunden persönlich bei dir melden.",
                    "Thank you. Daniel or Benjamin will personally get back to you within 48 hours."
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setStep(1); setHolsterType(""); setWeapon(""); setSelectedColor(""); setSide(""); setSelectedExtras([]); setSpecialWish(""); setName(""); setEmail(""); setPhone(""); }}
                  className="btn-ghost inline-flex items-center gap-2"
                >
                  {t("Neue Anfrage", "New Request")}
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

          </form>
        </div>
      </div>
    </section>
  );
}

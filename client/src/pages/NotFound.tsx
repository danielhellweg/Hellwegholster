import { Link } from "wouter";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-center text-white">
      <div><p className="font-mono-custom text-xs tracking-[0.2em] text-[var(--gold)]">404</p><h1 className="mt-5 font-display text-6xl">Seite nicht gefunden</h1><Link href="/" className="btn-gold mt-8">Zur Startseite</Link></div>
    </main>
  );
}

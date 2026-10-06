# HELLWEG — hellweg.eu

Deutsch/englische Hersteller- und Beschaffungswebsite mit 16 vorgerenderten Seiten und dem Claim **Protect tomorrow, secure today.**

## Produktion

- GitHub: `danielhellweg/Hellwegholster`, Branch `main`.
- Bestehender Railway-Dienst: `Hellwegholster`, Region EU West (Amsterdam).
- Öffentliche Adresse: https://www.hellweg.eu
- Railway verwendet das Root-`Dockerfile`: Node 24, Port 8080, unprivilegierter Laufzeitnutzer.
- Docker-Build: `HELLWEG_PUBLIC_ORIGIN=https://www.hellweg.eu`, `HELLWEG_PREVIEW=disabled`, `HELLWEG_INDEXING=enabled`.
- Healthcheck: `/healthz`. `contactReady` bestätigt nur vollständige Einstellungen, nicht eine erfolgreiche SMTP-Anmeldung oder Postfachzustellung.

## Entwicklung

Node 24 und pnpm 11.19.0 verwenden:

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm run build
pnpm test
HOST=127.0.0.1 PUBLIC_ORIGIN=http://127.0.0.1:4180 PORT=4180 pnpm start
```

Der lokale Build ist standardmäßig eine nicht indexierbare Vorschau. Der interne Prüfbericht wird im Produktionsbuild nicht ausgeliefert.

Aktive Quellen: `content/`, `public/`, `scripts/`, `server/*.mjs`. Die früheren React-/TypeScript-Quellen bleiben als Bestand erhalten, werden vom neuen Docker-Produktionsbuild aber nicht verwendet. Frühere Produktbild-URLs unter `/hellweg-products/` bleiben erreichbar.

## Kontakt

Der Kontakt-Endpunkt `/api/contact` verwendet ausschließlich die geschützten Railway-Variablen `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` und optional `CONTACT_EMAIL`, `MAIL_FROM`. Alternativ sind `SMTP_USERNAME` und `SMTP_PASSWORD` möglich. Kein Zugang gehört in Git.

Port 465 verwendet TLS, andere Ports erzwingen STARTTLS. `PUBLIC_ORIGIN` ist standardmäßig `https://www.hellweg.eu`; weitere autorisierte Ursprünge müssen explizit in `CONTACT_ALLOWED_ORIGINS` eingetragen werden. `TRUST_PROXY` ist standardmäßig 1.

Anhänge: bis zu drei PDF-, JPEG-, PNG- oder DOCX-Dateien; maximal 5 MiB je Datei und 10 MiB insgesamt. Formatprüfung, Größenbegrenzung, Rate-Limit und temporäre Verarbeitung im Arbeitsspeicher; kein Virenscanner. Keine Nachrichteninhalte oder Geheimnisse in Anwendungsprotokollen.

## Betreiberprüfung

Datenschutzhinweise nennen die konfigurierte Hostingregion und den verwendeten STRATO-Maildienst. Auftragsverarbeitung, Vertrags-/Übermittlungsgarantien und betriebliche Aufbewahrung sind vom Betreiber zu prüfen; die technische Umsetzung ist keine juristische Freigabe.

Vorversion für einen Rückwechsel: Commit `36b9f8c` (Update Impressum.tsx). Nach jedem Produktionswechsel HTTPS, beide Sprachen, Robots/Sitemap, echte 404-Antworten und tatsächliche Formularzustellung prüfen.

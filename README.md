# CrowdEase

Celý systém má tři části, které spolu komunikují přes jedno společné REST API:

- **Backend** NestJS s PostgreSQL 
- **Mobilní aplikace** React Native (přes Expo)
- **Administrační web** HTML, CSS a JavaScript

## Co aplikace umí

V mobilní aplikaci se zákazník zaregistruje a pak prochází nabídky rozdělené do kategorií jako Káva, Jídlo, Sladkosti, Nápoje a Ostatní. Akce si může uložit mezi oblíbené, sledovat si konkrétní podniky, a v detailu si vygenerovat PIN kód k uplatnění slevy. Vidí taky historii všech uplatnění a profil podniku s otevírací dobou, kontakty a všemi jeho aktuálními akcemi.

V admin webu si majitel po přihlášení rovnou ověří PIN, který mu zákazník u pultu nahlásí. Dál si tam spravuje vlastní akce, plánuje je v kalendáři, mění nastavení podniku a na úvodní stránce vidí jednoduchý dashboard se statistikami - kolik slev se uplatnilo dnes, kolik celkem, jednoduchý sloupcový graf za posledních 7 dní a posledních 5 uplatnění.

## Spuštění

Je potřeba Node.js 18 a vyšší, Docker (kvůli databázi) a v telefonu aplikaci Expo Go, na mobilní část.

**1. Databáze přes Docker:**
```bash
docker-compose up -d
```

**2. Backend:**
```bash
cd backend
npm install
npm run seed       # naplní databázi testovacími daty
npm run start:dev  # API běží na http://localhost:3000
```

**3. Admin web** stačí otevřít přímo v prohlížeči přes soubor `admin-web/index.html`. Já osobně používám rozšíření Live Server ve VS Code, ať se mi stránka po každé úpravě sama refreshne.

**4. Mobilní aplikace:**
```bash
cd mobile
npm install
npx expo start
```

V Expo Go pak načteš QR kód, který se ti vypíše v terminálu. Jedna důležitá věc - v souboru `mobile/src/api/client.ts` musíš mít aktuální IP adresu svého počítače v lokální síti, jinak se telefon na backend nedostane.

## Testovací účty

Po spuštění seedu je v databázi pár účtů majitelů, se kterými je možné všechno hned vyzkoušet. Běžný uživatel se registruje přímo v mobilní aplikaci.

| Email | Heslo | Podnik(y) |
|---|---|---|
| `owner@example.com` | `password123` | Kavárna, Bufet, Cukrárna a Bar u Čmelina |
| `jana@example.com` | `password123` | Pizzerie Roma |
| `tomas@example.com` | `password123` | Květinářství Tulipán |

## Struktura projektu

```
crowdease/
├── backend/           # NestJS API
├── mobile/            # React Native / Expo aplikace
├── admin-web/         # Admin rozhraní (HTML/CSS/JS)
├── docs/              # Dokumentace a poznámky
└── docker-compose.yml
```

## Použité technologie

Backend stojí na NestJS, TypeORM a PostgreSQL. Přihlašování řeším přes JWT tokeny a hesla se v databázi neukládají v čitelné podobě, ale prochází přes bcrypt. Mobilní aplikace běží v React Native s Expo, navigaci řeší React Navigation a uživatelský token si ukládám do AsyncStorage. Admin web je co nejjednodušší - čistý HTML, CSS a JavaScript bez frameworku.

---



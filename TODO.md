# TODO - CrowdEase

Na co nesmis zapomenout ty trotle.

---

## Here->

- [x] Hashování hesel v seedu (seed.service.ts ukládá plain text)
- [x] Validace hesla - min délka 8, velké+malé písmeno, číslice
- [x] Rate limiting na login/register (5 pokusů/min)
- [x] Rate limiting na generování PIN kódů (10/min) a ověření (20/min)
- [x] Admin web - základní login + PIN ověření
- [ ] Expirace PIN kódu na backendu (teď je jen frontend countdown)

- [ ] Co se stane když uživatel neuplatní slevu? PIN vyprší ale záznam zůstane v DB
- [ ] Přidat pin_expires_at do Redemption entity
- [ ] Max 3 pokusy na uplatnění PIN kódu
- [ ] Cron job na mazání/označování expirovaných redemptions

- [ ] Logout endpoint (invalidace tokenu)
- [ ] Refresh token


- [ ] Pagination (limit/offset) pro businesses a promotions
- [ ] DTO validace (class-validator)
- [x] GET /promotions/business/:id


- [x] Favorites tab
- [x] Redeemed tab
- [x] Profile screen (logout, nastavení)
- [x] Search (vyhledávání podle názvu akce/podniku)
- [x] Filtry (kategorie na HomeScreen, řazení na Favorites/Redeemed)
- [ ] Forgot password screen
- [x] opening hours v aplikaci (zatím jen upravujeme v admin-webu)
- [x] Profil podniku s krátkým popisem a fotkou + lokace, cislo atd. (V budoucnu tam muzou byt i hodnoceni)


- [x] Obrázky v Promotion
- [ ] Kategorie/tagy akcí
- [x] Tlačítko see all v aplikaci
- [ ] Moznost uplatnit pin kod pouze akce ktera patri vlastnikovi podniku. Aktualni stav - jakykolo majitel muze overit  pin vsech slev


## Admin web (pro business_owner)

- [x] Login pro business_owner
- [ ] Dashboard s přehledem
- [x] Ověření PIN kódu / sken QR zákazníka
  - Spis to asi vidim jen na nejakou sekci pro overeni toho pin kodu. Fungovat to bude takhle:
    1. Zákazník ukáže PIN obsluze
    2. Obsluha zadá PIN do systému
      - POST /redemptions/redeem { pin_code: "J5CU57" }
- [x] Seznam uplatněných slev
- [x] Správa akcí (CRUD)
- [ ] Statistiky 
- [x] Kalendář

---

## Teoricky mozny features v budoucnu

- [ ] Geolokace - akce v okolí
- [ ] Hodnocení podniků
- [ ] Sdílení akcí

---


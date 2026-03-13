# TODO - CrowdEase

Na co nesmis zapomenout ty trotle.

---

## Here->

- [ ] Hashování hesel v seedu (seed.service.ts ukládá plain text)
- [ ] Validace hesla - min délka, složitost
- [ ] Rate limiting na login/register
- [ ] Rate limiting na generování PIN kódů
- [ ] Expirace PIN kódu na backendu (teď je jen frontend countdown)

- [ ] Co se stane když uživatel neuplatní slevu? PIN vyprší ale záznam zůstane v DB
- [ ] Přidat pin_expires_at do Redemption entity
- [ ] Max 3 pokusy na uplatnění PIN kódu
- [ ] Cron job na mazání/označování expirovaných redemptions

- [ ] Logout endpoint (invalidace tokenu)
- [ ] Refresh token


- [ ] Pagination (limit/offset) pro businesses a promotions
- [ ] DTO validace (class-validator)
- [ ] GET /promotions/business/:id


- [x] Favorites tab
- [x] Redeemed tab
- [x] Profile screen (logout, nastavení)
- [x] Search (vyhledávání podle názvu akce/podniku)
- [x] Filtry (kategorie na HomeScreen, řazení na Favorites/Redeemed)
- [ ] Forgot password screen


- [ ] Obrázky v Promotion
- [ ] Kategorie/tagy akcí


## Admin web (pro business_owner)

- [ ] Login pro business_owner
- [ ] Dashboard s přehledem
- [ ] Ověření PIN kódu / sken QR zákazníka
  - Spis to asi vidim jen na nejakou sekci pro overeni toho pin kodu. Fungovat to bude takhle:
    1. Zákazník ukáže PIN obsluze
    2. Obsluha zadá PIN do systému
      - POST /redemptions/redeem { pin_code: "J5CU57" }
- [ ] Seznam uplatněných slev
- [ ] Správa akcí (CRUD)
- [ ] Statistiky 

---

## Teoricky mozny features v budoucnu

- [ ] Geolokace - akce v okolí
- [ ] Hodnocení podniků
- [ ] Sdílení akcí

---


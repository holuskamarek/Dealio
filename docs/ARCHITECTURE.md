# Architektura Dealio

## Přehled

Dealio je třívrstvá aplikace:
- **Backend**: NestJS API
- **Frontend**: React Native (mobilní) + HTML/CSS (admin web)
- **Databáze**: PostgreSQL

## Datové Modely

### User (Zákazník)
```
id: UUID
email: string (unique)
password_hash: string
name: string
created_at: timestamp
updated_at: timestamp
```

### Business (Podnik)
```
id: UUID
name: string
address: string
type: enum (kavárna, bistro, restaurace, atd.)
owner_id: UUID (FK -> User)
opening_hours: JSON
created_at: timestamp
updated_at: timestamp
```

### Promotion (Akce/Sleva)
```
id: UUID
business_id: UUID (FK -> Business)
title: string
description: string
discount_percent: number (0-100)
start_datetime: timestamp
end_datetime: timestamp
target_hours: string[] (např. ["14:00-16:00"])
created_at: timestamp
updated_at: timestamp
```

### Event (Analytika)
```
id: UUID
promotion_id: UUID (FK -> Promotion)
user_id: UUID (FK -> User, nullable)
type: enum (view, click, redeem, follow)
timestamp: timestamp
```

### Redemption (Uplatnění)
```
id: UUID
promotion_id: UUID (FK -> Promotion)
user_id: UUID (FK -> User)
pin_code: string (jednorázový kód)
used_at: timestamp (nullable)
created_at: timestamp
```

## API Endpointy (Plán)

### Auth
- `POST /auth/register` - Registrace uživatele
- `POST /auth/login` - Přihlášení
- `POST /auth/refresh` - Obnovení JWT tokenu

### Users
- `GET /users/me` - Profil aktuálního uživatele
- `PUT /users/me` - Aktualizace profilu

### Businesses
- `GET /businesses` - Seznam podniků
- `GET /businesses/:id` - Detail podniku
- `POST /businesses` - Vytvoření podniku (pouze pro business owner)
- `PUT /businesses/:id` - Aktualizace podniku

### Promotions
- `GET /promotions` - Seznam akcí
- `GET /promotions/:id` - Detail akce
- `POST /promotions` - Vytvoření akce
- `PUT /promotions/:id` - Aktualizace akce
- `DELETE /promotions/:id` - Smazání akce

### Redemptions
- `POST /redemptions/:promotionId/redeem` - Uplatnění akce
- `GET /redemptions/me` - Moje uplatnění

## Bezpečnost

- **Autentizace**: JWT tokeny
- **Validace**: Server-side validace všech vstupů
- **Rate Limiting**: Ochrana proti brute-force útokům
- **CORS**: Konfigurováno pro mobilní app a admin web

## TODO

- [ ] Implementovat databázové migrace
- [ ] Přidat Redis pro caching
- [ ] Implementovat email notifikace
- [ ] Přidat WebSocket pro real-time notifikace
- [ ] Implementovat admin dashboard
- [ ] Přidat mobilní aplikaci


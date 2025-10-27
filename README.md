# Dealio - Aplikace pro dynamické řízení akčních nabídek.

## Popis Projektu

Cílem práce je navrhnout, vyvinout a implementovat funkční základ aplikace s administrací, která pomáhá lokálním podnikům optimalizovat jejich vytížení a zároveň nabízí zákazníkům relevantní akční nabídky. Spojuje tak potřebu podniku snížit volnou kapacitu s chutí zákazníka získat výhodnou slevu v reálném čase.
 
Systém je rozdělen na dvě hlavní, vzájemně propojené části:
 
Administrační Web (pro Podniky):
 
Podnik si zde spravuje profil a dynamicky vkládá časově omezené akční nabídky.
Mobilní Aplikace (pro Zákazníky):
 
Aplikace slouží jako centralizovaný katalog, kde uživatel najde všechny aktivní nabídky od sledovaných podniků na jednom místě.
Nabídky jsou řazeny v reálném čase (aktivní jsou nahoře).

## Architektura

### Backend
- **Framework**: NestJS (Node.js + TypeScript)
- **Databáze**: PostgreSQL
- **Autentizace**: JWT

### Frontend
- **Mobilní App**: React Native / Expo
- **Admin Web**: HTML / CSS

## Struktura Projektu

```
dealio/
├── backend/          # NestJS API
├── mobile/           # React Native / Expo aplikace
├── admin-web/        # Admin rozhraní
├── docs/             # Dokumentace
└── docker-compose.yml # Docker setup
```

## Instalace a Spuštění

Bude doplněno v dalších fázích projektu.


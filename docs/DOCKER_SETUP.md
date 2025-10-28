# Docker Setup - Dealio

## Přehled

Projekt používá Docker Compose pro spuštění PostgreSQL databáze a později i backend API.

## Požadavky

- Docker Desktop nainstalovaný a spuštěný
- Docker Compose (součást Docker Desktop)

## Spuštění

### Spustit všechny služby

```bash
docker-compose up -d
```

`-d` = detached mode (běží na pozadí)

### Zastavit služby

```bash
docker-compose down
```

### Zobrazit běžící kontejnery

```bash
docker-compose ps
```

## Databáze

### Připojení k PostgreSQL

```bash
docker-compose exec postgres psql -U dealio_user -d dealio_db
```

Heslo: `dealio_password`

### Základní SQL příkazy

```sql
-- Zobrazit všechny tabulky
\dt

-- Zobrazit strukturu tabulky
\d table_name

-- Odejít
\q
```

## Backend API (později)

Když bude backend hotový, odkomentuj `backend` službu v `docker-compose.yml`:

```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  container_name: dealio-backend
  ports:
    - "3000:3000"
  environment:
    - NODE_ENV=development
    - DATABASE_URL=postgresql://dealio_user:dealio_password@postgres:5432/dealio_db
  depends_on:
    postgres:
      condition: service_healthy
  volumes:
    - ./backend/src:/app/src
  command: npm run start:dev
```

Pak spusť:

```bash
docker-compose up -d
```

## Troubleshooting

### Kontejner se nespustil

```bash
docker-compose logs postgres
```

Zobrazí logy kontejneru.

## TODO

- [ ] Přidat Redis kontejner
- [ ] Přidat backend kontejner
- [ ] Přidat nginx reverse proxy
- [ ] Přidat development vs production konfigurace


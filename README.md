# AI Quiz Generator

Webová aplikácia na generovanie kvízov z PDF dokumentov pomocou umelej inteligencie.

## Live Demo

- **Frontend (Azure):** https://yellow-river-0e48b5610.7.azurestaticapps.net
- **Backend (Render):** https://quiz-generator-6b99.onrender.com/api/health

## Cloudová architektúra

```
Používateľ
    ↓
Azure Static Web Apps (Frontend - React)
    ↓
Render (Backend - FastAPI)
    ↓
AWS RDS PostgreSQL (Databáza)
    ↓
Groq API (AI generovanie otázok)
```

| Služba | Provider | Účel |
|--------|----------|------|
| Azure Static Web Apps | Microsoft Azure | Hosting frontend |
| Render Web Service | Render | Hosting backend |
| AWS RDS | Amazon AWS | PostgreSQL databáza |
| Groq API | Groq | AI generovanie kvízov |

## Funkcionalita

- Nahranie PDF dokumentu
- AI generovanie kvízových otázok (výber počtu a obtiažnosti)
- Interaktívne prechádzanie kvízu
- Výsledky s rozborom odpovedí
- Registrácia a prihlásenie používateľov
- História absolvovaných kvízov

## Technológie

**Frontend:**
- React (JavaScript)
- React Router
- Vite

**Backend:**
- Python / FastAPI
- SQLAlchemy
- PostgreSQL
- JWT autentifikácia
- Groq API (llama-3.3-70b-versatile)

## Lokálne spustenie

### Požiadavky
- Docker
- Docker Compose

### Inštalácia

1. Klonuj repozitár:
```bash
git clone https://github.com/kt0eto/quiz-generator
cd quiz-generator
```

2. Vytvor `.env` súbory:

**backend/.env:**
```
DATABASE_URL=postgresql://quiz_user:quiz_password@db:5432/quiz_db
JWT_SECRET_KEY=supersecretkey123
OPENAI_API_KEY2=tvoj_groq_api_kluc
OPENAI_MODEL=llama-3.3-70b-versatile
```

**frontend/.env:**
```
VITE_API_URL=http://localhost:8000
```

3. Spusti aplikáciu:
```bash
docker-compose up --build
```

4. Otvor v prehliadači:
- Frontend: http://localhost:5173
- Backend API docs: http://localhost:8000/docs

## Tím

| Člen | Zodpovednosť |
|------|--------------|
| Člen 1 (Team Lead) | Frontend, autentifikácia |
| Člen 2 | PDF spracovanie, AI integrácia |
| Člen 3 | Kvíz, výsledky, Docker, deployment |

## Štruktúra projektu

```
quiz-generator/
├── backend/
│   ├── app/
│   │   ├── core/        # Konfigurácia
│   │   ├── db/          # Databáza
│   │   ├── models/      # SQLAlchemy modely
│   │   ├── routes/      # API endpointy
│   │   ├── schemas/     # Pydantic schémy
│   │   └── services/    # Biznis logika
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/       # React stránky
│   │   ├── components/  # React komponenty
│   │   └── api.js       # API volania
│   └── Dockerfile
└── docker-compose.yml
```
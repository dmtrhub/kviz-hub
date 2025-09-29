# KvizHub - Quiz Application

## 📋 Opis projekta
KvizHub je moderna web aplikacija za kreiranje i rešavanje kvizova. Aplikacija podržava različite kategorije, nivoa težine i vremenska ograničenja.

## 🏗️ Tehnologije
- **Frontend:** React + TypeScript + Vite
- **Backend:** .NET 9.0 + Entity Framework
- **Database:** SQL Server 2022
- **Containerization:** Docker + Docker Compose

## 🚀 Pokretanje aplikacije

### Prerequisites
- Docker Desktop
- Git

### Koraci za pokretanje
```bash
# 1. Kloniraj repozitorijum
git clone https://github.com/dmtrhub/kviz-hub.git
cd kviz-hub

# 2. Pokreni aplikaciju
docker-compose up --build -d

# 3. Otvori aplikaciju
# Frontend: http://localhost:5173
# Backend API: http://localhost:7033/index.html

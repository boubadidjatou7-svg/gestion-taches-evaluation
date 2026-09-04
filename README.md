# Gestion des Tâches

Mini-application full-stack de gestion de tâches, réalisée dans le cadre d'une évaluation technique. Le projet comprend une API REST, un client web et une application mobile, partageant la même base de données et le même système d'authentification par JWT.

## Description du projet

Chaque utilisateur peut créer un compte, se connecter, puis gérer sa propre liste de tâches (créer, consulter, modifier — y compris le statut — et supprimer). Les tâches sont strictement rattachées à leur propriétaire : un utilisateur ne peut jamais voir ou modifier les tâches d'un autre.

Le projet est découpé en trois applications indépendantes qui consomment la même API :

- **backend** — API REST (Node.js / Express / MySQL)
- **frontend-web** — client web (React)
- **mobile-app** — client mobile (React Native / Expo)

## Technologies utilisées

| Domaine       | Technologies                                      |
|---------------|----------------------------------------------------|
| Backend       | Node.js, Express, MySQL (mysql2), JWT, bcryptjs     |
| Frontend web  | React, Vite, Tailwind CSS, React Router, Axios, lucide-react |
| Mobile        | React Native, Expo, React Navigation, AsyncStorage  |
| Base de données | MySQL                                             |

## Structure du projet

```
gestion_taches/
├── backend/                  # API REST
│   ├── config/                # Connexion à la base de données
│   ├── controllers/           # Logique métier (auth, tâches)
│   ├── middleware/            # Middleware d'authentification JWT
│   ├── models/                # Requêtes SQL (users, tasks)
│   ├── routes/                # Définition des routes Express
│   ├── .env.example           # Modèle des variables d'environnement
│   └── server.js              # Point d'entrée du serveur
│
├── frontend-web/              # Client web React
│   └── src/
│       ├── api/                # Instance Axios + intercepteurs
│       ├── context/            # Contexte d'authentification
│       ├── components/         # Composants réutilisables
│       └── pages/               # Login, Dashboard
│
├── mobile-app/                 # Client mobile React Native / Expo
│   └── src/
│       ├── config/              # URL de l'API
│       ├── api/                 # Services (auth, tâches)
│       ├── context/             # Contexte d'authentification
│       ├── components/          # Composants réutilisables
│       ├── screens/             # Login, Liste, Création, Édition
│       └── navigation/          # Navigation (React Navigation)
│
├── database.sql               # Script de création de la base de données
└── README.md
```

## Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur recommandé) et npm
- [MySQL](https://dev.mysql.com/downloads/) (serveur local ou distant)
- L'application **Expo Go** installée sur un téléphone (iOS ou Android), pour tester l'application mobile — disponible sur l'App Store et le Google Play Store

## Installation des dépendances

Chaque application possède son propre `package.json` et s'installe séparément.

**Backend**
```bash
cd backend
npm install
```

**Frontend web**
```bash
cd frontend-web
npm install
```

**Application mobile**
```bash
cd mobile-app
npm install
```

## Configuration de la base de données

### 1. Importer database.sql

Depuis la racine du projet, importe le script SQL dans ton serveur MySQL :

```bash
mysql -u root -p < database.sql
```

> **Note Windows (PowerShell)** : la redirection `<` n'est pas supportée nativement par PowerShell, et `Get-Content | mysql` peut corrompre les accents même avec `-Encoding UTF8` — PowerShell 5.1 ré-encode le flux dans le codepage de sortie de la console (souvent un codepage OEM, pas UTF-8) avant de le transmettre à `mysql.exe`. C'est cette étape, pas le fichier lui-même, qui produit des caractères comme "Termin??".
>
> Passe plutôt par `cmd.exe`, dont la redirection `<` transmet les octets du fichier tels quels, sans aucune réinterprétation :
> ```powershell
> cmd /c "mysql -u root -p --default-character-set=utf8mb4 < database.sql"
> ```
>
> Si tu avais déjà importé la base avant ce correctif et que des accents sont corrompus, repars d'une base propre avant de réimporter :
> ```powershell
> mysql -u root -p -e "DROP DATABASE IF EXISTS gestion_taches;"
> cmd /c "mysql -u root -p --default-character-set=utf8mb4 < database.sql"
> ```

Cela crée la base `gestion_taches` avec les tables `users` et `tasks` (la table `tasks` référence `users` via une clé étrangère `user_id`).

### 2. Configurer le fichier .env du backend

Copie le fichier d'exemple puis renseigne tes propres valeurs :

```bash
cd backend
cp .env.example .env
```

Variables à définir dans `.env` :

| Variable       | Description                                      | Exemple                  |
|----------------|---------------------------------------------------|---------------------------|
| `DB_HOST`      | Hôte du serveur MySQL                              | `localhost`                |
| `DB_PORT`      | Port du serveur MySQL                              | `3306`                     |
| `DB_USER`      | Utilisateur MySQL                                  | `root`                     |
| `DB_PASSWORD`  | Mot de passe MySQL                                 | *(ton mot de passe)*       |
| `DB_NAME`      | Nom de la base de données                          | `gestion_taches`           |
| `JWT_SECRET`   | Clé secrète utilisée pour signer les tokens JWT    | *(chaîne aléatoire longue)*|

⚠️ Ne commite jamais le fichier `.env` réel — seul `.env.example` doit être versionné.

## Lancement du backend

```bash
cd backend
npm run dev
```

L'API démarre sur **http://localhost:5000**. Le préfixe des routes est `/api` (ex. `http://localhost:5000/api/auth/login`).

## Lancement de l'application Web

Dans un nouveau terminal :

```bash
cd frontend-web
npm run dev
```

L'application est accessible sur **http://localhost:5173**.

Le fichier `frontend-web/.env` doit contenir l'URL de l'API :
```
VITE_API_URL=http://localhost:5000/api
```

## Lancement de l'application Mobile

Dans un nouveau terminal :

```bash
cd mobile-app
npx expo start
```

Un QR code s'affiche dans le terminal.

1. Installe l'application **Expo Go** sur ton téléphone.
2. Ouvre Expo Go et scanne le QR code affiché dans le terminal.
3. L'application se charge sur ton téléphone.

⚠️ **Important — remplacer `localhost` par l'IP locale de ta machine**

Le fichier `mobile-app/src/config/api.js` contient l'URL de l'API :

```js
export const API_URL = 'http://localhost:5000/api';
```

Sur un téléphone physique (via Expo Go) ou un émulateur Android, `localhost` désigne l'appareil lui-même, pas ton PC — l'application ne pourra donc pas joindre le backend. Remplace `localhost` par l'adresse IP locale de ta machine sur le réseau Wi-Fi (visible avec `ipconfig` sous Windows, ligne "Adresse IPv4"), par exemple :

```js
export const API_URL = 'http://192.168.1.65:5000/api';
```

Ton téléphone et ton ordinateur doivent être connectés au **même réseau Wi-Fi**. (Seul le simulateur iOS fait exception : `localhost` y fonctionne car il partage le réseau du Mac hôte.)

## Créer un compte utilisateur

Conformément au cahier des charges, le frontend web et l'application mobile n'exposent qu'un **écran de connexion**, pas d'écran d'inscription. Pour créer un compte de test, appelle directement la route `POST /api/auth/register` de l'API (backend démarré au préalable) :

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Nom Utilisateur","email":"utilisateur@exemple.com","password":"password123"}'
```

Connecte-toi ensuite avec cet email et ce mot de passe depuis l'écran de connexion du frontend web ou de l'application mobile.

## Documentation de l'API

La liste complète des endpoints (méthode, route, authentification requise, corps de requête et exemples de réponses succès/erreur) est disponible dans [docs/API.md](docs/API.md).

## Fonctionnalités

- **Authentification** : inscription et connexion sécurisées (mot de passe hashé avec bcrypt, session gérée par token JWT)
- **Gestion des tâches** (web et mobile) :
  - Créer une tâche (titre + description)
  - Consulter la liste de ses propres tâches (titre, description, statut, date de création)
  - Modifier une tâche (titre, description et statut) via un bouton dédié ouvrant un formulaire pré-rempli
  - Supprimer une tâche, avec confirmation obligatoire avant suppression (modale de confirmation sur web, `Alert` natif sur mobile — jamais une alerte navigateur basique)
- **Sécurité** : toutes les routes de gestion des tâches sont protégées par middleware JWT ; chaque utilisateur n'a accès qu'à ses propres données
- **Session** : redirection automatique vers l'écran de connexion si le token est absent, invalide ou expiré
- **Interface** :
  - Web responsive (Tailwind CSS), testé sans débordement jusqu'à 375px de large
  - Notifications toast (succès/erreur) sur chaque action de tâche, à la place d'alertes JavaScript basiques
  - Badges de statut avec icônes cohérentes entre le web et le mobile
  - Retours visuels systématiques : indicateurs de chargement, boutons désactivés pendant les requêtes, messages d'erreur clairs

# Documentation de l'API

Base URL locale : `http://localhost:5000/api`

Toutes les requêtes et réponses utilisent le format JSON (`Content-Type: application/json`).

## Authentification

Les routes marquées **🔒 Authentification requise** attendent un token JWT dans l'en-tête `Authorization`, obtenu via `POST /api/auth/login` :

```
Authorization: Bearer <token>
```

Sans en-tête valide, ces routes renvoient une erreur `401`.

---

## POST /api/auth/register

Crée un nouveau compte utilisateur.

**Authentification requise** : non

**Corps de la requête**
```json
{
  "full_name": "Jean Dupont",
  "email": "jean@test.com",
  "password": "password123"
}
```

**Réponse — succès `201 Created`**
```json
{
  "message": "Utilisateur créé avec succès",
  "userId": 5
}
```

**Réponse — erreur `400 Bad Request`** (champ manquant)
```json
{ "message": "Tous les champs sont requis" }
```

**Réponse — erreur `409 Conflict`** (email déjà utilisé)
```json
{ "message": "Un compte existe déjà avec cet email" }
```

---

## POST /api/auth/login

Authentifie un utilisateur et retourne un token JWT.

**Authentification requise** : non

**Corps de la requête**
```json
{
  "email": "jean@test.com",
  "password": "password123"
}
```

**Réponse — succès `200 OK`**
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "full_name": "Jean Dupont",
    "email": "jean@test.com"
  }
}
```

**Réponse — erreur `400 Bad Request`** (champ manquant)
```json
{ "message": "Email et mot de passe requis" }
```

**Réponse — erreur `401 Unauthorized`** (identifiants incorrects)
```json
{ "message": "Email ou mot de passe incorrect" }
```

---

## GET /api/tasks

Liste toutes les tâches de l'utilisateur connecté (triées par date de création décroissante).

**Authentification requise** : oui 🔒

**Corps de la requête** : aucun

**Réponse — succès `200 OK`**
```json
[
  {
    "id": 12,
    "title": "Préparer la présentation",
    "description": "Slides + démo",
    "status": "En cours",
    "user_id": 5,
    "created_at": "2026-09-03T10:15:00.000Z"
  }
]
```

**Réponse — erreur `401 Unauthorized`** (token absent ou invalide)
```json
{ "message": "Accès refusé, token manquant" }
```
ou, si le token est présent mais invalide/expiré :
```json
{ "message": "Token invalide ou expiré" }
```

---

## POST /api/tasks

Crée une nouvelle tâche pour l'utilisateur connecté.

**Authentification requise** : oui 🔒

**Corps de la requête**
```json
{
  "title": "Préparer la présentation",
  "description": "Slides + démo",
  "status": "En attente"
}
```
- `title` : requis
- `description` : optionnel
- `status` : optionnel, doit être `"En attente"`, `"En cours"` ou `"Terminé"` — par défaut `"En attente"` si omis

**Réponse — succès `201 Created`**
```json
{
  "message": "Tâche créée avec succès",
  "taskId": 13
}
```

**Réponse — erreur `400 Bad Request`** (titre manquant)
```json
{ "message": "Le titre est requis" }
```
ou (statut invalide) :
```json
{ "message": "Statut invalide" }
```

**Réponse — erreur `401 Unauthorized`** : voir `GET /api/tasks`

---

## PUT /api/tasks/:id

Modifie une tâche existante (titre, description et statut) appartenant à l'utilisateur connecté.

**Authentification requise** : oui 🔒

**Corps de la requête**
```json
{
  "title": "Préparer la présentation",
  "description": "Slides + démo + Q&A",
  "status": "Terminé"
}
```
- `title` : requis
- `description` : optionnel
- `status` : requis, doit être `"En attente"`, `"En cours"` ou `"Terminé"`

**Réponse — succès `200 OK`**
```json
{ "message": "Tâche mise à jour avec succès" }
```

**Réponse — erreur `400 Bad Request`** (champ manquant)
```json
{ "message": "Titre et statut requis" }
```
ou (statut invalide) :
```json
{ "message": "Statut invalide" }
```

**Réponse — erreur `404 Not Found`** (tâche inexistante, ou appartenant à un autre utilisateur)
```json
{ "message": "Tâche non trouvée" }
```

---

## DELETE /api/tasks/:id

Supprime une tâche appartenant à l'utilisateur connecté.

**Authentification requise** : oui 🔒

**Corps de la requête** : aucun

**Réponse — succès `200 OK`**
```json
{ "message": "Tâche supprimée avec succès" }
```

**Réponse — erreur `404 Not Found`** (tâche inexistante, ou appartenant à un autre utilisateur)
```json
{ "message": "Tâche non trouvée" }
```

---

## Notes

- Toutes les routes `/api/tasks` filtrent systématiquement par l'utilisateur du token (`req.userId`) : il est impossible de consulter, modifier ou supprimer les tâches d'un autre utilisateur, même en devinant leur `id` (l'API répond `404`, pas `403`, pour ne pas révéler l'existence de la tâche).
- Toute erreur inattendue côté serveur (ex. base de données injoignable) renvoie `500 Internal Server Error` avec `{ "message": "Erreur serveur" }`.

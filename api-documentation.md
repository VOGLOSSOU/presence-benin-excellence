#  Documentation API -

**Version :** 2.1 (Multi-Tenant Dynamique)

**Base URL :** `http://localhost:5000`

**Format :** JSON

**Authentification :** Bearer Token (JWT)

---

##  Architecture Multi-Tenant Dynamique

### Concept

Le système utilise une architecture **multi-tenant dynamique** qui permet :
- **Création illimitée d'organisations** sans redéploiement
- **Isolation totale** des données entre organisations
- **Rôles hiérarchisés** : SYSTEM_ADMIN > SUPER_ADMIN > MANAGER
- **Chaque admin appartient à un tenant** et ne voit que les données de son organisation
- **Chaque visiteur est enrôlé dans un tenant** spécifique

### Hiérarchie des Rôles

```
SYSTEM_ADMIN (Toi - Propriétaire)
├── Crée des organisations
└── Contrôle global

SUPER_ADMIN (Chef d'organisation)
├── Gère son tenant
├── Crée des formulaires
├── Crée des MANAGER
└── Contrôle total de son organisation

MANAGER (Employé)
├── Voit les données
├── Gère les utilisateurs
└── Droits de lecture/écriture limités
```

### Modèle de données

```
SYSTEM_ADMIN
├── Crée → Tenant (Organisation/Siège)
    ├── AdminUser (SUPER_ADMIN, MANAGER)
    ├── FormTemplate (Formulaires)
    ├── User (Visiteurs)
    └── Presence (Présences)
```

**Exemple concret :**
- **SYSTEM_ADMIN** : `system_admin` (Toi)
  - Crée **Tenant 1** : BENIN EXCELLENCE Cotonou
    - **SUPER_ADMIN** : `admin_cotonou`
    - Formulaires : "Formulaire Étudiant Cotonou"
    - Visiteurs : Nathan, Alice, etc.

  - Crée **Tenant 2** : BENIN EXCELLENCE Porto-Novo
    - **SUPER_ADMIN** : `admin_porto`
    - Formulaires : "Formulaire Professionnel Porto-Novo"
    - Visiteurs : Bob, Claire, etc.

**Isolation :** admin_cotonou ne peut PAS voir les données de Porto-Novo, et vice-versa.

---

## 🔐 Module Auth

### 1. Login Admin

**Endpoint :** `POST /api/auth/login`

**Authentification :** Non requise

**Comptes par défaut (via seed) :**
```json
// SYSTEM_ADMIN (Toi - propriétaire)
{
  "username": "system_admin",
  "password": "System@123"
}

// SUPER_ADMIN Cotonou
{
  "username": "admin_cotonou",
  "password": "Admin@123"
}

// SUPER_ADMIN Porto-Novo
{
  "username": "admin_porto",
  "password": "Admin@123"
}
```

**Body :**
```json
{
  "username": "system_admin",
  "password": "System@123"
}
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "id": "3f3a80f0-9aa3-44bd-b597-27d65db3ad9f",
      "username": "system_admin",
      "role": "SYSTEM_ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2025-12-01T04:47:14.539Z"
}
```

**Important :** Le token JWT contient :
- `id` : ID de l'admin
- `username` : Nom d'utilisateur
- `role` : Rôle (SYSTEM_ADMIN, SUPER_ADMIN, ou MANAGER)
- **`tenantId`** : ID du tenant (optionnel pour SYSTEM_ADMIN) ⚠️

**Rôles disponibles :**
- `SYSTEM_ADMIN` : Contrôle total, crée des organisations
- `SUPER_ADMIN` : Gère son organisation, crée des MANAGER
- `MANAGER` : Droits limités dans son organisation

**Erreur (401 Unauthorized) :**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "timestamp": "2025-12-01T..."
}
```

---

### 2. Créer un Admin

**Endpoint :** `POST /api/auth/register`

**Authentification :** Bearer Token (SUPER_ADMIN uniquement)

**Headers :**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body :**
```json
{
  "username": "manager_cotonou",
  "password": "Manager@123",
  "role": "MANAGER"
}
```

**Rôles possibles :**
- `SUPER_ADMIN` : Tous les droits dans son organisation
- `MANAGER` : Droits limités dans son organisation

**Comportement Multi-Tenant :**
- Le nouvel admin **hérite du tenant** de l'admin qui le crée
- Un admin de Cotonou ne peut créer que des admins pour Cotonou

**Réponse (201 Created) :**
```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "admin": {
      "id": "...",
      "username": "manager_cotonou",
      "role": "MANAGER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2025-12-01T..."
}
```

---

## 🏗️ Module Setup (Création d'Organisations)

**Important :** Ce module permet la création dynamique d'organisations sans redéploiement.

### 1. Créer une Nouvelle Organisation

**Endpoint :** `POST /api/setup/organization`

**Authentification :** Bearer Token (SYSTEM_ADMIN uniquement)

**Headers :**
```
Authorization: Bearer {token_system_admin}
Content-Type: application/json
```

**Body :**
```json
{
  "organizationName": "BENIN EXCELLENCE Parakou",
  "adminUsername": "admin_parakou",
  "adminPassword": "SecurePass123",
  "adminEmail": "admin@parakou.be"
}
```

**Comportement :**
1. ✅ **Génère automatiquement** le code tenant : `BE-PARAKOU`
2. ✅ **Crée le tenant** avec le nom de l'organisation
3. ✅ **Crée un SUPER_ADMIN** lié au tenant
4. ✅ **Transaction atomique** : tout ou rien

**Réponse (201 Created) :**
```json
{
  "success": true,
  "message": "Organization created successfully",
  "data": {
    "tenant": {
      "id": "a1b2c3d4-...",
      "name": "BENIN EXCELLENCE Parakou",
      "code": "BE-PARAKOU"
    },
    "admin": {
      "id": "e5f6g7h8-...",
      "username": "admin_parakou",
      "role": "SUPER_ADMIN"
    },
    "credentials": {
      "username": "admin_parakou",
      "password": "SecurePass123"
    }
  },
  "timestamp": "2025-12-01T..."
}
```

**Erreur (409 Conflict) :**
```json
{
  "success": false,
  "message": "An organization with this name already exists",
  "timestamp": "2025-12-01T..."
}
```

**Erreur (403 Forbidden) :**
```json
{
  "success": false,
  "message": "Insufficient permissions",
  "timestamp": "2025-12-01T..."
}
```

---

## 📋 Module Forms (Formulaires)

**Important Multi-Tenant :**
- Chaque formulaire est **lié au tenant** de l'admin qui le crée
- Un admin ne voit QUE les formulaires de son tenant
- Les visiteurs ne peuvent s'enrôler qu'avec les formulaires de leur tenant

---

### 1. Créer un Formulaire

**Endpoint :** `POST /api/forms`

**Authentification :** Bearer Token (SUPER_ADMIN uniquement)

**Headers :**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body :**
```json
{
  "name": "Formulaire Étudiant Cotonou",
  "description": "Pour les étudiants de Cotonou",
  "type": "ARRIVAL_DEPARTURE",
  "active": true
}
```

**Types possibles :**
- `SIMPLE_PRESENCE` : Présence simple (illimité)
- `ARRIVAL_DEPARTURE` : Arrivée/Départ (avec intervalle horaire)

**Réponse (201 Created) :**
```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "id": "6a447cc1-118f-4fbb-872d-95067038c520",
    "tenantId": "c5d0cc0e-f2d1-4c22-8b28-a7e97a8b2302",
    "name": "Formulaire Étudiant Cotonou",
    "description": "Pour les étudiants de Cotonou",
    "type": "ARRIVAL_DEPARTURE",
    "active": true,
    "createdAt": "2025-12-01T09:52:23.081Z",
    "updatedAt": "2025-12-01T09:52:23.081Z",
    "fields": [],
    "intervals": []
  },
  "timestamp": "2025-12-01T09:52:23.109Z"
}
```

**Note :** Le `tenantId` est automatiquement déduit du token de l'admin connecté.

---

### 2. Obtenir Tous les Formulaires

**Endpoint :** `GET /api/forms`

**Authentification :** Bearer Token

**Headers :**
```
Authorization: Bearer {token}
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": [
    {
      "id": "6a447cc1-118f-4fbb-872d-95067038c520",
      "tenantId": "c5d0cc0e-f2d1-4c22-8b28-a7e97a8b2302",
      "name": "Formulaire Étudiant Cotonou",
      "description": "Pour les étudiants de Cotonou",
      "type": "ARRIVAL_DEPARTURE",
      "active": true,
      "createdAt": "2025-12-01T09:52:23.081Z",
      "updatedAt": "2025-12-01T09:52:23.081Z",
      "fields": [...],
      "intervals": [...],
      "_count": {
        "presences": 0
      }
    }
  ],
  "timestamp": "2025-12-01T10:18:35.904Z"
}
```

**Important :** L'admin ne voit QUE les formulaires de son tenant.

---

### 3. Obtenir un Formulaire par ID

**Endpoint :** `GET /api/forms/{formId}`

**Authentification :** Bearer Token

**Exemple :**
```
GET /api/forms/6a447cc1-118f-4fbb-872d-95067038c520
```

**Comportement Multi-Tenant :**
- Retourne le formulaire SEULEMENT s'il appartient au tenant de l'admin
- Erreur 404 si le formulaire appartient à un autre tenant

---

### 4. Mettre à Jour un Formulaire

**Endpoint :** `PUT /api/forms/{formId}`

**Authentification :** Bearer Token (SUPER_ADMIN uniquement)

**Body (tous les champs sont optionnels) :**
```json
{
  "name": "Formulaire Étudiant Cotonou (Modifié)",
  "description": "Nouvelle description",
  "active": false
}
```

---

### 5. Supprimer un Formulaire

**Endpoint :** `DELETE /api/forms/{formId}`

**Authentification :** Bearer Token (SUPER_ADMIN uniquement)

---

## 📝 Module Fields (Champs de Formulaire)

Les champs suivent la même logique multi-tenant que les formulaires.

---

### 1. Ajouter un Champ

**Endpoint :** `POST /api/forms/{formId}/fields`

**Authentification :** Bearer Token (SUPER_ADMIN uniquement)

**Body :**
```json
{
  "label": "Université",
  "fieldType": "TEXT",
  "isRequired": true,
  "order": 1
}
```

**Types de champs :**
- `TEXT`, `NUMBER`, `DATE`, `SELECT`, `CHECKBOX`, `TEXTAREA`

---

## ⏰ Module Intervals

### 1. Créer/Modifier un Intervalle

**Endpoint :** `POST /api/forms/{formId}/interval`

**Body :**
```json
{
  "startTime": "08:00",
  "endTime": "17:00"
}
```

---

## 👤 Module Enrollment (Enrôlement)

**Important Multi-Tenant :**
- Le visiteur est automatiquement enrôlé dans le **tenant du formulaire choisi**
- Un visiteur de Cotonou ne peut PAS marquer sa présence avec un formulaire de Porto-Novo

---

### 1. Enrôler un Nouveau Visiteur

**Endpoint :** `POST /api/enrollment`

**Authentification :** Non requise (Public)

**Body :**
```json
{
  "lastName": "VOGLOSSOU",
  "firstName": "Nathan",
  "title": "ETUDIANT",
  "phone": "+22997123456",
  "email": "nathan@example.com",
  "formTemplateId": "6a447cc1-118f-4fbb-872d-95067038c520",
  "fieldValues": [
    {
      "fieldTemplateId": "44d4c7a5-adc1-4977-8eca-ce927b38f47c",
      "value": "Université d'Abomey-Calavi"
    }
  ]
}
```

**Comportement Multi-Tenant :**
1. Le système récupère le formulaire avec `formTemplateId`
2. Le `tenantId` est **automatiquement déduit** du formulaire
3. Le visiteur est enrôlé dans ce tenant

**Réponse (201 Created) :**
```json
{
  "success": true,
  "message": "User enrolled successfully. UUID: BE-9UH6EVK",
  "data": {
    "user": {
      "id": "aae47fad-16e2-406b-82aa-f6d73c50b1b1",
      "uuidCode": "BE-9UH6EVK",
      "lastName": "VOGLOSSOU",
      "firstName": "Nathan",
      "title": "ETUDIANT",
      "fieldValues": [...]
    }
  }
}
```

---

## ✅ Module Presence (Présences)

**Important Multi-Tenant :**
- Le système vérifie que le formulaire **appartient au même tenant** que le visiteur
- Un visiteur de Cotonou ne peut PAS utiliser un formulaire de Porto-Novo

---

### 1. Enregistrer une Présence

**Endpoint :** `POST /api/presence`

**Authentification :** Non requise (Public)

**Body :**
```json
{
  "uuidCode": "BE-9UH6EVK",
  "formTemplateId": "6a447cc1-118f-4fbb-872d-95067038c520"
}
```

**Comportement Multi-Tenant :**
1. Vérifie que l'utilisateur existe
2. Récupère le `tenantId` de l'utilisateur
3. Vérifie que le formulaire appartient au **même tenant**
4. Refuse si les tenants ne correspondent pas

**Logique automatique :**
- **SIMPLE_PRESENCE** : Illimité
- **ARRIVAL_DEPARTURE** : Cycles multiples (ARRIVAL → DEPARTURE → ARRIVAL...)

**Réponse (201 Created) :**
```json
{
  "success": true,
  "message": "Arrival recorded successfully",
  "data": {
    "presence": {
      "id": "10a3446c-b345-4124-8034-66c5a3f1b944",
      "presenceType": "ARRIVAL",
      "timestamp": "2025-11-30T21:17:54.227Z",
      "user": {
        "uuidCode": "BE-9UH6EVK",
        "firstName": "Nathan",
        "lastName": "VOGLOSSOU"
      }
    }
  }
}
```

**Erreur Multi-Tenant (404) :**
```json
{
  "success": false,
  "message": "Form template not found or does not belong to your organization",
  "timestamp": "2025-12-01T..."
}
```

---

### 2. Obtenir l'Historique

**Endpoint :** `GET /api/presence/{uuidCode}`

**Réponse :** Retourne SEULEMENT les présences du tenant de l'utilisateur.

---

## 🔄 Workflow Complet Multi-Tenant Dynamique

### Workflow SYSTEM_ADMIN (Toi)

1. **Te connecter** avec ton compte système
   ```
   POST /api/auth/login
   Body: { "username": "system_admin", "password": "System@123" }
   ```
2. **Créer une nouvelle organisation**
   ```
   POST /api/setup/organization
   ```
   → Crée automatiquement tenant + SUPER_ADMIN
3. **Répéter** pour chaque nouvelle organisation
4. **Gérer globalement** (optionnel : voir toutes les orgs)

### Workflow SUPER_ADMIN (Chef d'organisation)

1. **Se connecter** avec son compte (fourni par SYSTEM_ADMIN)
   ```
   POST /api/auth/login
   ```
2. **Créer des formulaires** pour son organisation
   ```
   POST /api/forms
   POST /api/forms/{id}/fields
   POST /api/forms/{id}/interval
   ```
3. **Gérer les formulaires** (modifier, supprimer)
4. **Créer d'autres admins** (MANAGER) pour son organisation
   ```
   POST /api/auth/register
   ```
5. **Superviser** les présences et utilisateurs

### Workflow Visiteur

1. **Choisir un formulaire** (affiché sur l'interface)
2. **S'enrôler** avec le formulaire choisi
   ```
   POST /api/enrollment
   ```
   → Reçoit un UUID : `BE-XXXXX`
3. **Marquer sa présence** tous les jours
   ```
   POST /api/presence
   ```
4. **Consulter son historique** (optionnel)
   ```
   GET /api/presence/{uuidCode}
   ```

---

## 🛡️ Sécurité Multi-Tenant

### Isolation des données

✅ **Niveau Admin :**
- JWT contient le `tenantId`
- Tous les services filtrent automatiquement par `tenantId`
- Un admin ne peut PAS accéder aux données d'un autre tenant

✅ **Niveau Visiteur :**
- Le `tenantId` est déduit du formulaire lors de l'enrollment
- La présence vérifie que formulaire et visiteur ont le même `tenantId`
- Impossible de croiser les données entre tenants

✅ **Niveau Base de données :**
- Toutes les tables principales ont une colonne `tenantId`
- Relations en cascade : supprimer un tenant supprime toutes ses données
- Index sur `tenantId` pour des performances optimales

---

## 📊 Modèle de Données Multi-Tenant Dynamique

```
SYSTEM_ADMIN (Toi)
├── username: "system_admin"
├── password: "System@123"
├── role: SYSTEM_ADMIN
└── tenantId: null (pas de tenant)

├── Crée → Tenant (Organisation)
    ├── id (UUID)
    ├── name ("BENIN EXCELLENCE Cotonou")
    ├── code ("BE-COTONOU", unique, auto-généré)
    ├── description
    └── active (boolean)
    │
    ├── Crée → AdminUser (SUPER_ADMIN)
    │   ├── id (UUID)
    │   ├── tenantId → Tenant
    │   ├── username (unique)
    │   ├── passwordHash
    │   └── role: SUPER_ADMIN
    │
    ├── Crée → AdminUser (MANAGER) - optionnel
    │   ├── id (UUID)
    │   ├── tenantId → Tenant
    │   ├── username (unique)
    │   ├── passwordHash
    │   └── role: MANAGER
    │
    ├── FormTemplate
    │   ├── id (UUID)
    │   ├── tenantId → Tenant
    │   ├── name
    │   ├── type (SIMPLE_PRESENCE, ARRIVAL_DEPARTURE)
    │   └── active (boolean)
    │
    ├── User (Visiteur)
    │   ├── id (UUID)
    │   ├── tenantId → Tenant
    │   ├── uuidCode (unique, "BE-XXXXX")
    │   ├── lastName, firstName
    │   └── title (ETUDIANT, PROFESSIONNEL, ELEVE, AUTRE)
    │
    └── Presence
        ├── id (UUID)
        ├── tenantId → Tenant
        ├── userId → User
        ├── formTemplateId → FormTemplate
        ├── presenceType (ARRIVAL, DEPARTURE, SIMPLE)
        └── timestamp
```

---

## 🔧 Gestion des Erreurs

### Erreurs Multi-Tenant Spécifiques

**404 - Ressource d'un autre tenant :**
```json
{
  "success": false,
  "message": "Form template not found",
  "timestamp": "2025-12-01T..."
}
```
Note : Par sécurité, on ne révèle pas que la ressource existe dans un autre tenant.

**404 - Tenant incompatible :**
```json
{
  "success": false,
  "message": "Form template not found or does not belong to your organization",
  "timestamp": "2025-12-01T..."
}
```

---

## 📝 Notes pour le Frontend

### Gestion du Token JWT

Le token contient maintenant le `tenantId`. Exemple de payload décodé :
```json
{
  "id": "3f3a80f0-9aa3-44bd-b597-27d65db3ad9f",
  "username": "admin_cotonou",
  "role": "SUPER_ADMIN",
  "tenantId": "c5d0cc0e-f2d1-4c22-8b28-a7e97a8b2302",
  "iat": 1764564434,
  "exp": 1765169234
}
```

### Affichage des Données

- Ne jamais afficher le `tenantId` aux utilisateurs finaux
- L'admin voit son organisation dans le profil
- Les visiteurs n'ont pas besoin de connaître leur tenant

### Enrollment

- Afficher la liste des formulaires disponibles (publics)
- Le `tenantId` est automatiquement géré par le backend

---

*Documentation mise à jour le 1er décembre 2025 - Version 2.1 Multi-Tenant Dynamique*
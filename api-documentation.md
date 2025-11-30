# 📚 Documentation API - BENIN EXCELLENCE Système de Présence

**Base URL :** `http://localhost:5000`

**Format :** JSON

**Authentification :** Bearer Token (JWT)

---

## 🔐 Module Auth

### 1. Login Admin

**Endpoint :** `POST /api/auth/login`

**Authentification :** Non requise

**Body :**
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "id": "ac38251e-3e7a-45a9-8ab4-44756628cd78",
      "username": "admin",
      "role": "SUPER_ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2025-11-30T06:20:22.799Z"
}
```

**Erreur (401 Unauthorized) :**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "timestamp": "2025-11-30T06:20:37.370Z"
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
  "username": "manager1",
  "password": "Password123",
  "role": "MANAGER"
}
```

**Réponse (201 Created) :**
```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "admin": {
      "id": "...",
      "username": "manager1",
      "role": "MANAGER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2025-11-30T..."
}
```

---

## 📋 Module Forms (Formulaires)

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
  "name": "Formulaire Étudiant",
  "description": "Pour les étudiants universitaires",
  "type": "ARRIVAL_DEPARTURE",
  "active": true
}
```

**Types possibles :**
- `SIMPLE_PRESENCE` : Présence simple (un seul clic)
- `ARRIVAL_DEPARTURE` : Arrivée/Départ (avec intervalle horaire)

**Réponse (201 Created) :**
```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "id": "df4daf3e-5eba-4044-82d4-1de8d05bb1b9",
    "name": "Formulaire Étudiant",
    "description": "Pour les étudiants universitaires",
    "type": "ARRIVAL_DEPARTURE",
    "active": true,
    "createdAt": "2025-11-30T07:26:27.256Z",
    "updatedAt": "2025-11-30T07:26:27.256Z",
    "fields": [],
    "intervals": []
  },
  "timestamp": "2025-11-30T07:26:27.281Z"
}
```

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
      "id": "df4daf3e-5eba-4044-82d4-1de8d05bb1b9",
      "name": "Formulaire Étudiant",
      "description": "Pour les étudiants universitaires",
      "type": "ARRIVAL_DEPARTURE",
      "active": true,
      "createdAt": "2025-11-30T07:26:27.256Z",
      "updatedAt": "2025-11-30T07:26:27.256Z",
      "fields": [...],
      "intervals": [...],
      "_count": {
        "presences": 0
      }
    }
  ],
  "timestamp": "2025-11-30T..."
}
```

---

### 3. Obtenir un Formulaire par ID

**Endpoint :** `GET /api/forms/{formId}`

**Authentification :** Bearer Token

**Headers :**
```
Authorization: Bearer {token}
```

**Exemple :**
```
GET /api/forms/df4daf3e-5eba-4044-82d4-1de8d05bb1b9
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": "df4daf3e-5eba-4044-82d4-1de8d05bb1b9",
    "name": "Formulaire Étudiant",
    "description": "Pour les étudiants universitaires",
    "type": "ARRIVAL_DEPARTURE",
    "active": true,
    "createdAt": "2025-11-30T07:26:27.256Z",
    "updatedAt": "2025-11-30T07:26:27.256Z",
    "fields": [
      {
        "id": "44d4c7a5-adc1-4977-8eca-ce927b38f47c",
        "formTemplateId": "df4daf3e-5eba-4044-82d4-1de8d05bb1b9",
        "label": "Université",
        "fieldType": "TEXT",
        "isRequired": true,
        "options": null,
        "order": 1
      },
      {
        "id": "ef94dd4d-3411-4aa3-8a17-4d84bf0f0eda",
        "formTemplateId": "df4daf3e-5eba-4044-82d4-1de8d05bb1b9",
        "label": "Filière",
        "fieldType": "SELECT",
        "isRequired": true,
        "options": ["Informatique", "Gestion", "Droit", "Médecine"],
        "order": 2
      },
      {
        "id": "545985e6-72a8-4ae5-a943-d45bae084886",
        "formTemplateId": "df4daf3e-5eba-4044-82d4-1de8d05bb1b9",
        "label": "Année d'études",
        "fieldType": "NUMBER",
        "isRequired": true,
        "options": null,
        "order": 3
      }
    ],
    "intervals": [
      {
        "id": "18a5df91-8923-4e84-be0c-483b4a524a2b",
        "formTemplateId": "df4daf3e-5eba-4044-82d4-1de8d05bb1b9",
        "startTime": "08:00",
        "endTime": "17:00",
        "createdAt": "2025-11-30T07:33:29.730Z"
      }
    ]
  },
  "timestamp": "2025-11-30T07:34:29.480Z"
}
```

---

### 4. Mettre à Jour un Formulaire

**Endpoint :** `PUT /api/forms/{formId}`

**Authentification :** Bearer Token (SUPER_ADMIN uniquement)

**Headers :**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (tous les champs sont optionnels) :**
```json
{
  "name": "Formulaire Étudiant (Modifié)",
  "description": "Nouvelle description",
  "active": false
}
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "message": "Resource updated successfully",
  "data": {
    "id": "df4daf3e-5eba-4044-82d4-1de8d05bb1b9",
    "name": "Formulaire Étudiant (Modifié)",
    "description": "Nouvelle description",
    "active": false,
    ...
  },
  "timestamp": "2025-11-30T..."
}
```

---

### 5. Supprimer un Formulaire

**Endpoint :** `DELETE /api/forms/{formId}`

**Authentification :** Bearer Token (SUPER_ADMIN uniquement)

**Headers :**
```
Authorization: Bearer {token}
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "message": "Resource deleted successfully",
  "data": {
    "message": "Form template deleted successfully"
  },
  "timestamp": "2025-11-30T..."
}
```

---

## 📝 Module Fields (Champs de Formulaire)

### 1. Ajouter un Champ à un Formulaire

**Endpoint :** `POST /api/forms/{formId}/fields`

**Authentification :** Bearer Token (SUPER_ADMIN uniquement)

**Headers :**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body :**
```json
{
  "label": "Université",
  "fieldType": "TEXT",
  "isRequired": true,
  "order": 1
}
```

**Types de champs possibles :**
- `TEXT` : Texte simple
- `NUMBER` : Nombre
- `DATE` : Date
- `SELECT` : Liste déroulante (nécessite `options`)
- `CHECKBOX` : Case à cocher
- `TEXTAREA` : Texte long

**Exemple avec SELECT :**
```json
{
  "label": "Filière",
  "fieldType": "SELECT",
  "isRequired": true,
  "options": ["Informatique", "Gestion", "Droit", "Médecine"],
  "order": 2
}
```

**Réponse (201 Created) :**
```json
{
  "success": true,
  "message": "Field added successfully",
  "data": {
    "id": "44d4c7a5-adc1-4977-8eca-ce927b38f47c",
    "formTemplateId": "df4daf3e-5eba-4044-82d4-1de8d05bb1b9",
    "label": "Université",
    "fieldType": "TEXT",
    "isRequired": true,
    "options": null,
    "order": 1
  },
  "timestamp": "2025-11-30T07:28:54.664Z"
}
```

---

### 2. Obtenir les Champs d'un Formulaire

**Endpoint :** `GET /api/forms/{formId}/fields`

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
      "id": "44d4c7a5-adc1-4977-8eca-ce927b38f47c",
      "formTemplateId": "df4daf3e-5eba-4044-82d4-1de8d05bb1b9",
      "label": "Université",
      "fieldType": "TEXT",
      "isRequired": true,
      "options": null,
      "order": 1
    },
    ...
  ],
  "timestamp": "2025-11-30T..."
}
```

---

### 3. Mettre à Jour un Champ

**Endpoint :** `PUT /api/forms/fields/{fieldId}`

**Authentification :** Bearer Token (SUPER_ADMIN uniquement)

**Headers :**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body (tous les champs sont optionnels) :**
```json
{
  "label": "Université (nouveau)",
  "isRequired": false,
  "order": 5
}
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "message": "Resource updated successfully",
  "data": {
    "id": "44d4c7a5-adc1-4977-8eca-ce927b38f47c",
    "label": "Université (nouveau)",
    "isRequired": false,
    ...
  },
  "timestamp": "2025-11-30T..."
}
```

---

### 4. Supprimer un Champ

**Endpoint :** `DELETE /api/forms/fields/{fieldId}`

**Authentification :** Bearer Token (SUPER_ADMIN uniquement)

**Headers :**
```
Authorization: Bearer {token}
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "message": "Resource deleted successfully",
  "data": {
    "message": "Field template deleted successfully"
  },
  "timestamp": "2025-11-30T..."
}
```

---

## ⏰ Module Intervals (Intervalles Horaires)

### 1. Créer/Modifier un Intervalle

**Endpoint :** `POST /api/forms/{formId}/interval`

**Authentification :** Bearer Token (SUPER_ADMIN uniquement)

**Note :** Cette route supprime l'ancien intervalle et crée le nouveau (un seul intervalle par formulaire)

**Headers :**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body :**
```json
{
  "startTime": "08:00",
  "endTime": "17:00"
}
```

**Format :** `HH:mm` (24h)

**Réponse (201 Created) :**
```json
{
  "success": true,
  "message": "Interval created successfully",
  "data": {
    "id": "18a5df91-8923-4e84-be0c-483b4a524a2b",
    "formTemplateId": "df4daf3e-5eba-4044-82d4-1de8d05bb1b9",
    "startTime": "08:00",
    "endTime": "17:00",
    "createdAt": "2025-11-30T07:33:29.730Z"
  },
  "timestamp": "2025-11-30T07:33:29.747Z"
}
```

---

## 🔒 Gestion des Erreurs

### Erreurs Communes

**401 Unauthorized :**
```json
{
  "success": false,
  "message": "No token provided",
  "timestamp": "2025-11-30T..."
}
```

**403 Forbidden :**
```json
{
  "success": false,
  "message": "Insufficient permissions",
  "timestamp": "2025-11-30T..."
}
```

**404 Not Found :**
```json
{
  "success": false,
  "message": "Form template not found",
  "timestamp": "2025-11-30T..."
}
```

**422 Validation Error :**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": [
    {
      "field": "body.name",
      "message": "Name must be at least 3 characters"
    }
  ],
  "timestamp": "2025-11-30T..."
}
```

---

## 📝 Notes pour le Frontend

### Authentification
1. Faire un `POST /api/auth/login` avec username et password
2. Stocker le `token` dans localStorage ou state management
3. Ajouter le token dans les headers de toutes les requêtes suivantes :
   ```
   Authorization: Bearer {token}
   ```

### Workflow de Création d'un Formulaire
1. `POST /api/forms` → Créer le formulaire
2. `POST /api/forms/{formId}/fields` → Ajouter les champs (répéter pour chaque champ)
3. `POST /api/forms/{formId}/interval` → Ajouter l'intervalle (si ARRIVAL_DEPARTURE)
4. `GET /api/forms/{formId}` → Vérifier le formulaire complet

### Types de Données
- **UUID** : Format `"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"`
- **DateTime** : Format ISO 8601 `"2025-11-30T07:26:27.256Z"`
- **Time** : Format `"HH:mm"` (ex: `"08:00"`, `"17:30"`)

---

---

## 👤 Module Enrollment (Enrôlement)

### 1. Enrôler un Nouveau Visiteur

**Endpoint :** `POST /api/enrollment`

**Authentification :** Non requise (Public)

**Headers :**
```
Content-Type: application/json
```

**Body :**
```json
{
  "lastName": "VOGLOSSOU",
  "firstName": "Nathan",
  "title": "ETUDIANT",
  "phone": "+22997123456",
  "email": "nathan@example.com",
  "formTemplateId": "df4daf3e-5eba-4044-82d4-1de8d05bb1b9",
  "fieldValues": [
    {
      "fieldTemplateId": "44d4c7a5-adc1-4977-8eca-ce927b38f47c",
      "value": "Université d'Abomey-Calavi"
    },
    {
      "fieldTemplateId": "ef94dd4d-3411-4aa3-8a17-4d84bf0f0eda",
      "value": "Informatique"
    },
    {
      "fieldTemplateId": "545985e6-72a8-4ae5-a943-d45bae084886",
      "value": "3"
    }
  ]
}
```

**Titres possibles :**
- `ETUDIANT`
- `PROFESSIONNEL`
- `ELEVE`
- `AUTRE`

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
      "phone": "+22997123456",
      "email": "nathan@example.com",
      "fieldValues": [
        {
          "field": "Université",
          "value": "Université d'Abomey-Calavi"
        },
        {
          "field": "Filière",
          "value": "Informatique"
        },
        {
          "field": "Année d'études",
          "value": "3"
        }
      ]
    },
    "message": "User enrolled successfully. UUID: BE-9UH6EVK"
  },
  "timestamp": "2025-11-30T07:45:29.188Z"
}
```

**Erreurs possibles :**

**404 - Formulaire introuvable :**
```json
{
  "success": false,
  "message": "Form template not found",
  "timestamp": "2025-11-30T..."
}
```

**400 - Champ requis manquant :**
```json
{
  "success": false,
  "message": "Required field 'Université' is missing",
  "timestamp": "2025-11-30T..."
}
```

**400 - Formulaire inactif :**
```json
{
  "success": false,
  "message": "Form template is not active",
  "timestamp": "2025-11-30T..."
}
```

---

## ✅ Module Presence (Présences)

### 1. Enregistrer une Présence

**Endpoint :** `POST /api/presence`

**Authentification :** Non requise (Public)

**Headers :**
```
Content-Type: application/json
```

**Body :**
```json
{
  "uuidCode": "BE-9UH6EVK",
  "formTemplateId": "df4daf3e-5eba-4044-82d4-1de8d05bb1b9"
}
```

**Logique automatique :**
- **Type SIMPLE_PRESENCE** : Enregistre une présence simple
- **Type ARRIVAL_DEPARTURE** :
  - Première fois du jour → `ARRIVAL`
  - Deuxième fois du jour → `DEPARTURE`
  - Troisième fois → Erreur "Already checked out today"

**Réponse 1 - ARRIVAL (201 Created) :**
```json
{
  "success": true,
  "message": "Arrival recorded successfully",
  "data": {
    "presence": {
      "id": "7fb9a6a8-a38c-4962-a04e-ab448dbdd010",
      "presenceType": "ARRIVAL",
      "timestamp": "2025-11-30T14:01:41.235Z",
      "user": {
        "uuidCode": "BE-9UH6EVK",
        "firstName": "Nathan",
        "lastName": "VOGLOSSOU"
      }
    },
    "message": "Arrival recorded successfully"
  },
  "timestamp": "2025-11-30T14:01:41.256Z"
}
```

**Réponse 2 - DEPARTURE (201 Created) :**
```json
{
  "success": true,
  "message": "Departure recorded successfully",
  "data": {
    "presence": {
      "id": "3b4168c5-e28b-468e-833f-4bed3523ba53",
      "presenceType": "DEPARTURE",
      "timestamp": "2025-11-30T14:02:17.341Z",
      "user": {
        "uuidCode": "BE-9UH6EVK",
        "firstName": "Nathan",
        "lastName": "VOGLOSSOU"
      }
    },
    "message": "Departure recorded successfully"
  },
  "timestamp": "2025-11-30T14:02:17.357Z"
}
```

**Erreurs possibles :**

**404 - UUID introuvable :**
```json
{
  "success": false,
  "message": "User not found with this UUID",
  "timestamp": "2025-11-30T..."
}
```

**400 - Hors intervalle horaire :**
```json
{
  "success": false,
  "message": "Outside allowed time interval (08:00 - 17:00)",
  "timestamp": "2025-11-30T..."
}
```

**400 - Déjà sorti :**
```json
{
  "success": false,
  "message": "Already checked out today",
  "timestamp": "2025-11-30T..."
}
```

---

### 2. Obtenir l'Historique des Présences

**Endpoint :** `GET /api/presence/{uuidCode}`

**Authentification :** Non requise (Public)

**Exemple :**
```
GET /api/presence/BE-9UH6EVK
```

**Réponse (200 OK) :**
```json
{
  "success": true,
  "message": "Presences retrieved successfully",
  "data": {
    "user": {
      "uuidCode": "BE-9UH6EVK",
      "firstName": "Nathan",
      "lastName": "VOGLOSSOU"
    },
    "presences": [
      {
        "id": "3b4168c5-e28b-468e-833f-4bed3523ba53",
        "userId": "aae47fad-16e2-406b-82aa-f6d73c50b1b1",
        "formTemplateId": "df4daf3e-5eba-4044-82d4-1de8d05bb1b9",
        "presenceType": "DEPARTURE",
        "timestamp": "2025-11-30T14:02:17.341Z",
        "formTemplate": {
          "name": "Formulaire Étudiant",
          "type": "ARRIVAL_DEPARTURE"
        }
      },
      {
        "id": "7fb9a6a8-a38c-4962-a04e-ab448dbdd010",
        "userId": "aae47fad-16e2-406b-82aa-f6d73c50b1b1",
        "formTemplateId": "df4daf3e-5eba-4044-82d4-1de8d05bb1b9",
        "presenceType": "ARRIVAL",
        "timestamp": "2025-11-30T14:01:41.235Z",
        "formTemplate": {
          "name": "Formulaire Étudiant",
          "type": "ARRIVAL_DEPARTURE"
        }
      }
    ]
  },
  "timestamp": "2025-11-30T14:02:49.895Z"
}
```

**Note :** Les présences sont triées de la plus récente à la plus ancienne. Limite de 50 résultats.

---

## 🔄 Workflow Complet du Système

### Workflow Visiteur

1. **Enrôlement (une seule fois)**
   - `POST /api/enrollment`
   - Recevoir son UUID : `BE-XXXXXXX`

2. **Enregistrer sa présence (tous les jours)**
   - `POST /api/presence` avec son UUID
   - Si formulaire ARRIVAL_DEPARTURE :
     - Matin → ARRIVAL
     - Soir → DEPARTURE

3. **Consulter son historique (optionnel)**
   - `GET /api/presence/{uuidCode}`

### Workflow Admin

1. **Se connecter**
   - `POST /api/auth/login`
   - Recevoir un token JWT

2. **Créer des formulaires**
   - `POST /api/forms` (créer le formulaire)
   - `POST /api/forms/{id}/fields` (ajouter des champs)
   - `POST /api/forms/{id}/interval` (configurer l'intervalle si ARRIVAL_DEPARTURE)

3. **Gérer les formulaires**
   - `GET /api/forms` (voir tous)
   - `PUT /api/forms/{id}` (modifier)
   - `DELETE /api/forms/{id}` (supprimer)

---

## 🔄 Modules à venir

- **Users** : Gestion des visiteurs (admin)
- **Admin** : Dashboard et statistiques
- **Reports** : Rapports et exports

---

## 📝 Notes Importantes pour le Frontend

### Format UUID
- **Format** : `BE-XXXXXXX` (BE suivi de 7 caractères alphanumériques majuscules)
- **Exemple** : `BE-9UH6EVK`, `BE-A3F8G2T`

### Logique Présence
- Pour un formulaire **ARRIVAL_DEPARTURE**, envoyer **deux fois** la même requête le même jour :
  1. Premier appel → ARRIVAL
  2. Deuxième appel → DEPARTURE
- Le backend gère automatiquement la logique !

### Validation des Champs
- Tous les champs marqués `isRequired: true` doivent être remplis lors de l'enrôlement
- Les `fieldTemplateId` doivent correspondre aux champs du formulaire choisi

### Gestion des Erreurs
- Toujours vérifier `success: false` pour détecter les erreurs
- Afficher le `message` à l'utilisateur

---

*Documentation mise à jour le 30 novembre 2025.*
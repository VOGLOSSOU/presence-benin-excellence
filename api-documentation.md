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

## 🔄 Modules à venir

- **Enrollment** : Enregistrement des visiteurs
- **Presence** : Enregistrement des présences
- **Users** : Gestion des visiteurs
- **Admin** : Dashboard et statistiques
- **Reports** : Rapports et exports

*Cette documentation sera mise à jour au fur et à mesure du développement.*
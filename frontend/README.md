# BENIN EXCELLENCE - Frontend

Interface utilisateur pour le système de présence numérique BENIN EXCELLENCE.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd frontend

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env

# Démarrer le serveur de développement
npm run dev
```

### Scripts disponibles
```bash
npm run dev          # Démarre le serveur de développement
npm run build        # Construit l'application pour la production
npm run preview      # Prévisualise la version de production
npm run lint         # Vérifie le code avec ESLint
npm run test         # Lance les tests unitaires
npm run test:e2e     # Lance les tests E2E
```

## 🏗️ Architecture

### Structure des dossiers
```
src/
├── components/       # Composants réutilisables
│   ├── common/      # Composants génériques (Button, Input, etc.)
│   ├── presence/    # Composants liés à la présence
│   ├── registration/# Composants d'enregistrement
│   ├── setup/       # Composants de création d'organisations
│   └── dashboard/   # Composants du tableau de bord
├── pages/           # Pages de l'application
│   ├── auth/        # Pages d'authentification
│   ├── admin/       # Pages administrateur
│   ├── visitor/     # Pages visiteur
│   └── shared/      # Pages partagées
├── services/        # Services API
├── hooks/           # Custom hooks
├── stores/          # État global (Zustand)
├── router/          # Configuration des routes
├── types/           # Types TypeScript
├── utils/           # Utilitaires
└── styles/          # Styles globaux
```

### Technologies utilisées
- **React 18** avec TypeScript
- **React Router v6** pour le routing
- **TanStack Query** pour la gestion des données
- **Zustand** pour l'état global
- **Tailwind CSS** pour le styling
- **Zod** pour la validation
- **React Hook Form** pour les formulaires

## 🎨 Design System

### Couleurs principales
- **Primaire**: Bleu Facebook (#1877F2)
- **Succès**: Vert (#10B981)
- **Erreur**: Rouge (#EF4444)
- **Avertissement**: Orange (#F59E0B)

### Branding
- Logo: "BE" dans un cercle bleu
- Typographie: Inter (system-ui)
- Style: Moderne, accessible, responsive

## 🔐 Rôles utilisateurs

### SYSTEM_ADMIN
- Création d'organisations
- Gestion globale du système

### SUPER_ADMIN
- Gestion de son organisation
- Création de formulaires
- Gestion des utilisateurs

### MANAGER
- Consultation des données
- Gestion limitée

### VISITOR
- Enregistrement de présence
- Consultation de l'historique

## 🧪 Tests

### Tests unitaires
```bash
npm run test
```

### Tests E2E
```bash
npm run test:e2e
```

## 📱 Fonctionnalités

- ✅ Authentification multi-rôles
- ✅ Création d'organisations (SYSTEM_ADMIN)
- ✅ Gestion des formulaires (SUPER_ADMIN)
- ✅ Enregistrement de présence
- ✅ Historique des présences
- ✅ Interface responsive
- ✅ Mode hors ligne (futur)

## 🚀 Déploiement

### Build de production
```bash
npm run build
```

### Variables d'environnement de production
```env
VITE_API_URL=https://api.benin-excellence.com
VITE_APP_NAME="BENIN EXCELLENCE"
VITE_APP_VERSION="1.0.0"
```

## 📚 Documentation API

Voir le fichier `../api-documentation.md` pour la documentation complète de l'API backend.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence ISC.

---

**BENIN EXCELLENCE** - Système de présence numérique moderne et accessible.
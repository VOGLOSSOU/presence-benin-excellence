#!/bin/bash

# Script de création de la structure du projet Backend
# BENIN EXCELLENCE - Système de Gestion de Présence

echo "🚀 Création de la structure du projet Backend..."
echo ""

# Créer le dossier principal
mkdir -p backend
cd backend

# Créer la structure Prisma
echo "📁 Création des dossiers Prisma..."
mkdir -p prisma/migrations

# Créer la structure src
echo "📁 Création de la structure src..."

# Config
mkdir -p src/config

# Types
mkdir -p src/types

# Utils
mkdir -p src/utils

# Middlewares
mkdir -p src/middlewares

# Validators
mkdir -p src/validators

# Modules
mkdir -p src/modules/auth
mkdir -p src/modules/users
mkdir -p src/modules/enrollment
mkdir -p src/modules/forms
mkdir -p src/modules/presence
mkdir -p src/modules/admin
mkdir -p src/modules/reports

# Shared
mkdir -p src/shared/errors
mkdir -p src/shared/interfaces

# Tests
mkdir -p tests/unit/services
mkdir -p tests/unit/utils
mkdir -p tests/integration/api

echo "✅ Dossiers créés avec succès!"
echo ""

# Créer les fichiers vides
echo "📄 Création des fichiers..."

# Fichiers racine
touch .env
touch .env.example
touch .gitignore
touch README.md
touch nodemon.json
touch package.json
touch tsconfig.json

# Prisma
touch prisma/schema.prisma
touch prisma/seed.ts

# Config
touch src/config/database.ts
touch src/config/env.ts
touch src/config/constants.ts

# Types
touch src/types/express.d.ts
touch src/types/index.ts

# Utils
touch src/utils/uuid-generator.ts
touch src/utils/password.util.ts
touch src/utils/jwt.util.ts
touch src/utils/response.util.ts
touch src/utils/date.util.ts

# Middlewares
touch src/middlewares/auth.middleware.ts
touch src/middlewares/validate.middleware.ts
touch src/middlewares/error.middleware.ts
touch src/middlewares/notFound.middleware.ts
touch src/middlewares/logger.middleware.ts

# Validators
touch src/validators/auth.validator.ts
touch src/validators/user.validator.ts
touch src/validators/form.validator.ts
touch src/validators/presence.validator.ts

# Module Auth
touch src/modules/auth/auth.routes.ts
touch src/modules/auth/auth.controller.ts
touch src/modules/auth/auth.service.ts
touch src/modules/auth/auth.types.ts

# Module Users
touch src/modules/users/users.routes.ts
touch src/modules/users/users.controller.ts
touch src/modules/users/users.service.ts
touch src/modules/users/users.types.ts

# Module Enrollment
touch src/modules/enrollment/enrollment.routes.ts
touch src/modules/enrollment/enrollment.controller.ts
touch src/modules/enrollment/enrollment.service.ts
touch src/modules/enrollment/enrollment.types.ts

# Module Forms
touch src/modules/forms/forms.routes.ts
touch src/modules/forms/forms.controller.ts
touch src/modules/forms/forms.service.ts
touch src/modules/forms/fields.controller.ts
touch src/modules/forms/fields.service.ts
touch src/modules/forms/forms.types.ts

# Module Presence
touch src/modules/presence/presence.routes.ts
touch src/modules/presence/presence.controller.ts
touch src/modules/presence/presence.service.ts
touch src/modules/presence/presence.types.ts

# Module Admin
touch src/modules/admin/admin.routes.ts
touch src/modules/admin/admin.controller.ts
touch src/modules/admin/admin.service.ts
touch src/modules/admin/admin.types.ts

# Module Reports
touch src/modules/reports/reports.routes.ts
touch src/modules/reports/reports.controller.ts
touch src/modules/reports/reports.service.ts
touch src/modules/reports/reports.types.ts

# Shared Errors
touch src/shared/errors/AppError.ts
touch src/shared/errors/BadRequestError.ts
touch src/shared/errors/NotFoundError.ts
touch src/shared/errors/UnauthorizedError.ts
touch src/shared/errors/ValidationError.ts

# Shared Interfaces
touch src/shared/interfaces/IController.ts
touch src/shared/interfaces/IService.ts
touch src/shared/interfaces/IPagination.ts

# Fichiers principaux
touch src/app.ts
touch src/server.ts

echo "✅ Fichiers créés avec succès!"
echo ""

echo "🎉 Structure du projet créée avec succès!"
echo ""
echo "📊 Résumé:"
echo "   - Dossiers: $(find . -type d | wc -l)"
echo "   - Fichiers: $(find . -type f | wc -l)"
echo ""
echo "🚀 Prochaines étapes:"
echo "   1. cd backend"
echo "   2. npm init -y"
echo "   3. Installer les dépendances"
echo "   4. Configurer les fichiers"
echo ""
echo "✨ Bon développement!"
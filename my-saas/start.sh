#!/bin/sh
echo "ca demare"

# Installation des dépendances, y compris Tailwind CSS
# npm install

echo "111111111111111111"
# Générer les styles Tailwind CSS (cette commande dépend de la façon dont vous avez configuré Tailwind)
npx tailwindcss -i ./src/app.css -o ./dist/output.css

echo "22222222222222222222"
# Compilation du projet (si nécessaire)
#npm run build

# Démarrage du serveur de développement ou de production
#npm run dev --host 161.97.82.1
npm run dev
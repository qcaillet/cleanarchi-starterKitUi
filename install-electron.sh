#!/bin/bash

echo "🚀 Installation d'Electron pour Clean Architecture Starter Kit"
echo "============================================================"

# Vérifier si npm fonctionne
echo "📦 Vérification de npm..."
npm --version
if [ $? -ne 0 ]; then
    echo "❌ npm ne fonctionne pas correctement"
    echo "💡 Essayez : brew install node"
    exit 1
fi

echo "🧹 Nettoyage des dépendances existantes..."
rm -rf node_modules package-lock.json

echo "📥 Installation des dépendances de base..."
npm install

echo "⚡ Installation d'Electron..."
npm install --save-dev electron@latest
npm install --save-dev electron-builder@latest
npm install --save-dev concurrently@latest
npm install --save-dev wait-on@latest
npm install --save-dev cross-env@latest

echo "✅ Installation terminée !"
echo ""
echo "🎯 Commandes disponibles :"
echo "  npm run dev           # Mode web (navigateur)"
echo "  npm run electron-dev  # Mode desktop (Electron)"
echo "  npm run dist          # Construire l'app desktop"
echo ""
echo "📱 Pour tester Electron :"
echo "  npm run electron-dev"
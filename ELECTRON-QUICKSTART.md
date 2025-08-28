# 🚀 Démarrage rapide - Version Electron

Votre application React a été configurée pour fonctionner avec Electron ! 

## ✅ Étapes d'installation

### 1. Installer les dépendances Electron

```bash
# Option A: Script automatique
./install-electron.sh

# Option B: Installation manuelle
npm install
```

### 2. Tester l'application

```bash
# En mode web (navigateur) 
npm run dev

# En mode desktop (Electron)
npm run electron-dev
```

## 🎯 Ce qui a été ajouté

### Structure des fichiers
```
electron/
├── main.js          # ✅ Process principal Electron
├── preload.js       # ✅ IPC sécurisé  
└── assets/          # ✅ Dossier pour les icônes

src/hooks/
└── useElectron.ts   # ✅ Hook React pour Electron

package.json         # ✅ Scripts et config Electron
```

### Nouvelles fonctionnalités

#### 🏠 Interface utilisateur
- **Boutons Ouvrir/Sauvegarder** : Visibles uniquement en mode Electron
- **Menu natif** : Raccourcis clavier (Ctrl+S, Ctrl+O, etc.)  
- **Boîtes de dialogue système** : Pour ouvrir/sauvegarder les fichiers

#### ⚡ Fonctionnalités
- Sauvegarde de configurations en fichiers JSON
- Ouverture de configurations depuis des fichiers
- Menu d'application natif avec raccourcis
- Gestion sécurisée des fichiers

## 🛠️ Développement

### Scripts disponibles
```bash
npm run dev           # Application web
npm run electron      # Electron (après build)
npm run electron-dev  # Electron en mode dev
npm run dist          # Build pour distribution
npm run electron-build # Build avec electron-builder
```

### Debug
- F12 ouvre les DevTools en mode développement
- Menu → Affichage → DevTools en production

## 📦 Distribution

L'app peut être distribuée sur :
- **Windows** : Installeur `.exe`
- **macOS** : Image `.dmg` 
- **Linux** : AppImage et `.deb`

## 🔧 Personnalisation

### Icônes
1. Placez vos icônes dans `electron/assets/`
2. Formats : `icon.png` (512x512), `icon.ico`, `icon.icns`

### Configuration
- Éditez `electron/main.js` pour la fenêtre
- Modifiez `package.json` → `"build"` pour la distribution

## ❓ Problème d'installation ?

Si `npm install` ne fonctionne pas :

```bash
# Nettoyer et réessayer
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Ou utiliser yarn/pnpm
yarn install
# ou
pnpm install
```

## 🎉 Prêt !

Votre application peut maintenant fonctionner :
- 🌐 Dans le navigateur (mode web)
- 🖥️ Comme app native (mode desktop)

Lancez `npm run electron-dev` pour voir la magie opérer ! ✨
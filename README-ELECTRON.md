# Clean Architecture Starter Kit - Version Electron

Cette application React peut maintenant fonctionner comme une application desktop native grâce à Electron.

## 🚀 Commandes disponibles

### Développement
```bash
# Installer les dépendances (avec Electron)
npm install

# Lancer l'application en mode web (navigateur)
npm run dev

# Lancer l'application en mode desktop (Electron) 
npm run electron-dev
```

### Production
```bash
# Construire l'application web
npm run build

# Lancer Electron avec l'application construite
npm run electron

# Construire l'application desktop (génère les installeurs)
npm run electron-build

# Construire sans publier
npm run dist
```

## 📦 Fonctionnalités Electron

### Menu de l'application
- **Fichier** → Nouveau projet (Ctrl/Cmd+N)
- **Fichier** → Ouvrir configuration (Ctrl/Cmd+O) 
- **Fichier** → Sauvegarder configuration (Ctrl/Cmd+S)
- **Fichier** → Exporter projet (Ctrl/Cmd+E)

### Interface utilisateur
- Boutons **Ouvrir** et **Sauvegarder** (visibles uniquement dans Electron)
- Gestion native des fichiers via les boîtes de dialogue système
- Raccourcis clavier natifs

### Sécurité
- Context isolation activé
- Node.js integration désactivé
- IPC sécurisé via preload script

## 🛠️ Structure des fichiers

```
electron/
├── main.js          # Process principal Electron
├── preload.js       # Script de sécurité IPC
└── assets/          # Icônes de l'application
    └── README.md    # Instructions pour les icônes

src/hooks/
└── useElectron.ts   # Hook React pour intégration Electron
```

## 📱 Distribution

L'application peut être distribuée sur :
- **Windows** : Installeur NSIS (.exe)
- **macOS** : Image disque (.dmg) pour Intel et Apple Silicon
- **Linux** : AppImage et package Debian (.deb)

### Configuration des icônes

Pour personnaliser les icônes :

1. Créez une icône 512x512 au format PNG
2. Utilisez un outil comme `electron-icon-builder` :
   ```bash
   npm install -g electron-icon-builder
   electron-icon-builder --input=icon.png --output=electron/assets --flatten
   ```

## 🔧 Configuration avancée

### Variables d'environnement
- `ELECTRON_IS_DEV` : Mode développement
- `ELECTRON_BUILDER_CACHE` : Cache des builds

### Personnalisation
- Modifiez `electron/main.js` pour ajuster la fenêtre
- Éditez la configuration `build` dans `package.json` pour les options de distribution
- Ajustez `electron/preload.js` pour de nouvelles APIs IPC

## 🚨 Sécurité

L'application suit les meilleures pratiques Electron :
- ✅ Context isolation
- ✅ Sandbox mode 
- ✅ IPC sécurisé
- ✅ Validation des URLs
- ✅ Pas d'accès direct à Node.js depuis le renderer

## 🆘 Dépannage

### L'application ne démarre pas
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run electron-dev
```

### Erreurs de build
```bash
# Nettoyer le cache d'electron-builder
npx electron-builder install-app-deps
npm run dist
```

### Mode debug
- En développement : F12 ouvre les DevTools automatiquement
- En production : Menu → Affichage → Basculer les outils de développement
# Icônes Electron

Ce dossier contient les icônes pour l'application Electron.

## Formats requis :

- **icon.png** : 512x512 pixels (pour Linux)
- **icon.ico** : Multi-résolution (pour Windows)  
- **icon.icns** : Multi-résolution (pour macOS)

## Comment créer les icônes :

1. Créez une icône carrée de 512x512 pixels au format PNG
2. Utilisez des outils comme :
   - [electron-icon-builder](https://www.npmjs.com/package/electron-icon-builder)
   - [png2icons](https://www.npmjs.com/package/png2icons)
   - Ou des services en ligne comme [convertio.co](https://convertio.co/)

## Commandes pour générer les icônes :

```bash
# Installer electron-icon-builder
npm install -g electron-icon-builder

# Générer toutes les icônes depuis un PNG 512x512
electron-icon-builder --input=./source-icon.png --output=./electron/assets --flatten
```

Pour l'instant, les icônes ne sont pas présentes. L'application fonctionnera avec l'icône par défaut d'Electron.
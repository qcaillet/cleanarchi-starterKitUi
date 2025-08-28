import { useEffect, useCallback } from 'react';

// Types pour les APIs Electron
interface ElectronAPI {
  saveConfig: (config: unknown) => Promise<{ success: boolean; path?: string; cancelled?: boolean; error?: string }>;
  loadConfig: () => Promise<{ success: boolean; data?: unknown; path?: string; cancelled?: boolean; error?: string }>;
  onMenuAction: (callback: (event: unknown, action: string) => void) => void;
  removeAllListeners: (channel: string) => void;
  isElectron: boolean;
  platform: string;
  version: string;
}

// Étendre l'interface Window
declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export const useElectron = () => {
  // Vérifier si on est dans Electron
  const isElectron = typeof window !== 'undefined' && window.electronAPI?.isElectron;

  // Sauvegarder une configuration
  const saveConfig = useCallback(async (config: unknown) => {
    if (!isElectron) {
      console.warn('saveConfig called outside Electron environment');
      return { success: false, error: 'Not in Electron environment' };
    }
    
    try {
      const result = await window.electronAPI!.saveConfig(config);
      return result;
    } catch (error) {
      console.error('Error saving config:', error);
      return { success: false, error: 'Failed to save config' };
    }
  }, [isElectron]);

  // Charger une configuration
  const loadConfig = useCallback(async () => {
    if (!isElectron) {
      console.warn('loadConfig called outside Electron environment');
      return { success: false, error: 'Not in Electron environment' };
    }
    
    try {
      const result = await window.electronAPI!.loadConfig();
      return result;
    } catch (error) {
      console.error('Error loading config:', error);
      return { success: false, error: 'Failed to load config' };
    }
  }, [isElectron]);

  // Écouter les actions du menu
  const setupMenuListeners = useCallback((handlers: {
    onNewProject?: () => void;
    onOpenConfig?: () => void;
    onSaveConfig?: () => void;
    onExportProject?: () => void;
  }) => {
    if (!isElectron) return;

    const handleMenuAction = (_event: unknown, action: string) => {
      switch (action) {
        case 'menu-new-project':
          handlers.onNewProject?.();
          break;
        case 'menu-open-config':
          handlers.onOpenConfig?.();
          break;
        case 'menu-save-config':
          handlers.onSaveConfig?.();
          break;
        case 'menu-export-project':
          handlers.onExportProject?.();
          break;
      }
    };

    window.electronAPI!.onMenuAction(handleMenuAction);

    // Cleanup function
    return () => {
      window.electronAPI!.removeAllListeners('menu-new-project');
      window.electronAPI!.removeAllListeners('menu-open-config');
      window.electronAPI!.removeAllListeners('menu-save-config');
      window.electronAPI!.removeAllListeners('menu-export-project');
    };
  }, [isElectron]);

  // Informations sur l'environnement
  const electronInfo = isElectron ? {
    platform: window.electronAPI!.platform,
    version: window.electronAPI!.version
  } : null;

  return {
    isElectron,
    saveConfig,
    loadConfig,
    setupMenuListeners,
    electronInfo
  };
};

// Hook pour intégrer facilement les fonctionnalités Electron dans un composant
export const useElectronIntegration = (handlers: {
  onNewProject?: () => void;
  onOpenConfig?: () => void;
  onSaveConfig?: () => void;
  onExportProject?: () => void;
}) => {
  const { isElectron, setupMenuListeners, ...electronAPI } = useElectron();

  useEffect(() => {
    if (!isElectron) return;

    const cleanup = setupMenuListeners(handlers);
    return cleanup;
  }, [isElectron, setupMenuListeners, handlers]);

  return {
    isElectron,
    ...electronAPI
  };
};
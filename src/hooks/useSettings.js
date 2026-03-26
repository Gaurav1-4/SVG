import { useState, useEffect } from 'react';

const SETT_KEY = 'tr_traders_settings';
const DEFAULT_PHONE = '919555835833';

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(SETT_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse settings', e);
    }
    return { whatsappNumber: DEFAULT_PHONE };
  });

  useEffect(() => {
    const handleStorage = () => {
      try {
        const stored = localStorage.getItem(SETT_KEY);
        if (stored) setSettings(JSON.parse(stored));
      } catch (e) {
        console.warn('Failed to parse settings', e);
      }
    };
    
    // Listen for custom event from admin panel and storage events
    window.addEventListener('settingsUpdated', handleStorage);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('settingsUpdated', handleStorage);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return {
    ...settings,
    whatsappNumber: settings.whatsappNumber || DEFAULT_PHONE
  };
}

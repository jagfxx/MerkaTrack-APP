import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { convertCurrency, formatCurrency } from '../services/exchangeRates';

type Theme = 'light' | 'dark';
type Currency = 'COP' | 'USD' | 'EUR' | 'GBP';

interface SettingsContextType {
  theme: Theme;
  currency: Currency;
  notifications: boolean;
  toggleTheme: () => void;
  setCurrency: (currency: Currency) => void;
  toggleNotifications: () => void;
  convertToCurrentCurrency: (amount: number, fromCurrency?: Currency) => number;
  formatCurrency: (amount: number) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('appSettings');
      return saved ? JSON.parse(saved) : {
        theme: 'light' as Theme,
        currency: 'COP' as Currency,
        notifications: true
      };
    }
    return {
      theme: 'light' as Theme,
      currency: 'COP' as Currency,
      notifications: true
    };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('appSettings', JSON.stringify(settings));
      
      // Apply theme to document
      if (settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings]);

  const toggleTheme = () => {
    setSettings((prev: any) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  };

  const setCurrency = (currency: Currency) => {
    setSettings((prev: any) => ({
      ...prev,
      currency
    }));
  };

  const toggleNotifications = () => {
    setSettings((prev: any) => ({
      ...prev,
      notifications: !prev.notifications
    }));
  };

  // Convertir un monto a la moneda actual
  const convertToCurrentCurrency = useCallback((amount: number, fromCurrency: Currency = 'USD') => {
    return convertCurrency(amount, fromCurrency, settings.currency);
  }, [settings.currency]);

  // Formatear un monto con la moneda actual
  const formatCurrentCurrency = useCallback((amount: number) => {
    return formatCurrency(amount, settings.currency);
  }, [settings.currency]);

  return (
    <SettingsContext.Provider
      value={{
        theme: settings.theme,
        currency: settings.currency,
        notifications: settings.notifications,
        toggleTheme,
        setCurrency,
        toggleNotifications,
        convertToCurrentCurrency,
        formatCurrency: formatCurrentCurrency
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

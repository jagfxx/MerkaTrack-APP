declare module '@/context/ListasContext' {
  import { ReactNode } from 'react';
  
  interface ListaItem {
    id: string;
    productoId: number;
    cantidad: number;
    precio: number;
    agregado: boolean;
  }

  interface Lista {
    id: string;
    nombre: string;
    fechaCreacion: string;
    items: ListaItem[];
    total: number;
  }

  interface ListasContextType {
    listas: Lista[];
    crearLista: (nombre: string) => string;
    eliminarLista: (id: string) => void;
    obtenerLista: (id: string) => Lista | undefined;
    agregarItemALista: (listaId: string, productoId: number, cantidad: number, precio: number) => void;
    toggleItemAgregado: (listaId: string, itemId: string) => void;
    eliminarItemDeLista: (listaId: string, itemId: string) => void;
  }

  export function useListas(): ListasContextType;
  export const ListasProvider: ({ children }: { children: ReactNode }) => JSX.Element;
}

declare module '@/context/SettingsContext' {
  import { ReactNode } from 'react';
  
  type Theme = 'light' | 'dark';
  type Currency = 'COP' | 'USD' | 'EUR';

  interface SettingsContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    notifications: boolean;
    setNotifications: (enabled: boolean) => void;
    formatCurrency: (amount: number) => string;
    convertToCurrentCurrency: (amount: number, fromCurrency?: Currency) => number;
  }

  export function useSettings(): SettingsContextType;
  export const SettingsProvider: ({ children }: { children: ReactNode }) => JSX.Element;
}

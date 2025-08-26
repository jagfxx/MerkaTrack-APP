import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Gasto {
  id: string;
  descripcion: string;
  monto: number;
  categoria: string;
  categoriaIcono: string;
  fecha: string;
}

interface GastosContextType {
  gastos: Gasto[];
  agregarGasto: (gasto: Omit<Gasto, 'id'>) => void;
  eliminarGasto: (id: string) => void;
  totalGastos: number;
}

const GastosContext = createContext<GastosContextType | undefined>(undefined);

export const GastosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gastos, setGastos] = useState<Gasto[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gastos');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Guardar en localStorage cuando cambian los gastos
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gastos', JSON.stringify(gastos));
    }
  }, [gastos]);

  const agregarGasto = (gasto: Omit<Gasto, 'id'>) => {
    const nuevoGasto = {
      ...gasto,
      id: Date.now().toString(),
    };
    setGastos(prev => [nuevoGasto, ...prev]);
  };

  const eliminarGasto = (id: string) => {
    setGastos(prev => prev.filter(gasto => gasto.id !== id));
  };

  const totalGastos = gastos.reduce((total, gasto) => total + gasto.monto, 0);

  return (
    <GastosContext.Provider value={{ gastos, agregarGasto, eliminarGasto, totalGastos }}>
      {children}
    </GastosContext.Provider>
  );
};

export const useGastos = (): GastosContextType => {
  const context = useContext(GastosContext);
  if (!context) {
    throw new Error('useGastos debe usarse dentro de un GastosProvider');
  }
  return context;
};

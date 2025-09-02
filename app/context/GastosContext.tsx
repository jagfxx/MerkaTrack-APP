/**
 * Contexto para manejar el estado global de los gastos en la aplicación.
 * Proporciona funciones para agregar, eliminar y calcular el total de gastos,
 * además de persistir los datos en localStorage.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

/**
 * Interfaz que define la estructura de un gasto
 * @property {string} id - Identificador único del gasto
 * @property {string} descripcion - Descripción del gasto
 * @property {number} monto - Cantidad del gasto
 * @property {string} categoria - Categoría del gasto
 * @property {string} categoriaIcono - Ícono asociado a la categoría
 * @property {string} fecha - Fecha en formato ISO del gasto
 */
export interface Gasto {
  id: string;
  descripcion: string;
  monto: number;
  categoria: string;
  categoriaIcono: string;
  fecha: string;
}

/**
 * Interfaz que define el tipo del contexto de gastos
 * @property {Gasto[]} gastos - Lista de gastos
 * @property {(gasto: Omit<Gasto, 'id'>) => void} agregarGasto - Función para agregar un nuevo gasto
 * @property {(id: string) => void} eliminarGasto - Función para eliminar un gasto por su ID
 * @property {number} totalGastos - Suma total de todos los gastos
 */
interface GastosContextType {
  gastos: Gasto[];
  agregarGasto: (gasto: Omit<Gasto, 'id'>) => void;
  eliminarGasto: (id: string) => void;
  totalGastos: number;
}

// Creación del contexto con un valor inicial undefined
const GastosContext = createContext<GastosContextType | undefined>(undefined);

/**
 * Proveedor del contexto de gastos que envuelve la aplicación
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 */
export const GastosProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Estado para almacenar la lista de gastos, inicializado desde localStorage si existe
  const [gastos, setGastos] = useState<Gasto[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gastos');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Efecto para persistir los gastos en localStorage cuando cambian
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gastos', JSON.stringify(gastos));
    }
  }, [gastos]);

  /**
   * Agrega un nuevo gasto a la lista
   * @param {Omit<Gasto, 'id'>} gasto - Objeto con los datos del gasto (sin ID)
   */
  const agregarGasto = (gasto: Omit<Gasto, 'id'>) => {
    const nuevoGasto = {
      ...gasto,
      id: Date.now().toString(), // Genera un ID único basado en la marca de tiempo
    };
    setGastos(prev => [nuevoGasto, ...prev]); // Agrega el nuevo gasto al principio del array
  };

  /**
   * Elimina un gasto de la lista por su ID
   * @param {string} id - ID del gasto a eliminar
   */
  const eliminarGasto = (id: string) => {
    setGastos(prev => prev.filter(gasto => gasto.id !== id));
  };

  // Calcula el total de gastos sumando todos los montos
  const totalGastos = gastos.reduce((total, gasto) => total + gasto.monto, 0);

  // Provee el contexto a los componentes hijos con el estado y las funciones necesarias
  return (
    <GastosContext.Provider value={{ gastos, agregarGasto, eliminarGasto, totalGastos }}>
      {children}
    </GastosContext.Provider>
  );
};

/**
 * Hook personalizado para acceder al contexto de gastos
 * @returns {GastosContextType} El contexto de gastos
 * @throws {Error} Si se usa fuera de un GastosProvider
 */
export const useGastos = (): GastosContextType => {
  const context = useContext(GastosContext);
  if (!context) {
    throw new Error('useGastos debe usarse dentro de un GastosProvider');
  }
  return context;
};

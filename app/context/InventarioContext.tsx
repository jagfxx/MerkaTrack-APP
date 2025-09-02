/**
 * Contexto para manejar el inventario de alimentos en la aplicación.
 * Permite gestionar el stock de alimentos, incluyendo agregar y actualizar cantidades,
 * con persistencia en localStorage. También mantiene un historial de cambios.
 */

import React, { createContext, useContext, useState, useEffect } from "react";

/**
 * Tipo que define la estructura de un alimento básico
 * @property {number} id - Identificador único del alimento
 * @property {string} nombre - Nombre del alimento
 * @property {string} icon - Ícono que representa al alimento
 */
export type Alimento = {
  id: number;
  nombre: string;
  icon: string;
};

/**
 * Extiende el tipo Alimento para incluir la cantidad en inventario
 * @extends Alimento
 * @property {number} cantidad - Cantidad disponible en inventario
 */
export type InventarioItem = Alimento & { cantidad: number };

/**
 * Interfaz que define el tipo del contexto de inventario
 * @property {InventarioItem[]} inventario - Lista de alimentos en inventario
 * @property {React.Dispatch<React.SetStateAction<InventarioItem[]>>} setInventario - Función para actualizar el inventario
 * @property {(item: InventarioItem) => void} agregarAlimento - Función para agregar o actualizar un alimento en el inventario
 */
export type InventarioContextType = {
  inventario: InventarioItem[];
  setInventario: React.Dispatch<React.SetStateAction<InventarioItem[]>>;
  agregarAlimento: (item: InventarioItem) => void;
};

// Creación del contexto con un valor inicial undefined
const InventarioContext = createContext<InventarioContextType | undefined>(undefined);

/**
 * Proveedor del contexto de inventario que envuelve la aplicación
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 */
export const InventarioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado para almacenar el inventario, inicializado como array vacío
  const [inventario, setInventario] = useState<InventarioItem[]>([]);

  /**
   * Efecto para cargar el inventario desde localStorage al montar el componente
   * Solo se ejecuta en el cliente (verificación de window)
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("inventario");
      if (data) setInventario(JSON.parse(data));
    }
  }, []);

  /**
   * Efecto para guardar el inventario en localStorage cada vez que cambia
   * Solo se ejecuta en el cliente (verificación de window)
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inventario", JSON.stringify(inventario));
    }
  }, [inventario]);

  /**
   * Agrega o actualiza un alimento en el inventario
   * @param {InventarioItem} item - El alimento a agregar o actualizar
   */
  const agregarAlimento = (item: InventarioItem) => {
    // Actualiza el estado del inventario
    setInventario(prev => {
      // Busca si el alimento ya existe en el inventario
      const idx = prev.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        // Si existe, actualiza la cantidad sumando la nueva cantidad
        return prev.map((alimento, i) =>
          i === idx
            ? { ...alimento, cantidad: alimento.cantidad + item.cantidad }
            : alimento
        );
      } else {
        // Si no existe, agrega el nuevo alimento al inventario
        return [...prev, item];
      }
    });

    // Guarda en el historial de cambios
    if (typeof window !== "undefined") {
      const historial = localStorage.getItem("historialAlimentos");
      const arr = historial ? JSON.parse(historial) : [];
      // Agrega el cambio al historial con marca de tiempo
      arr.push({ ...item, fecha: new Date().toISOString() });
      localStorage.setItem("historialAlimentos", JSON.stringify(arr));
    }
  };

  // Provee el contexto a los componentes hijos con el estado y las funciones necesarias
  return (
    <InventarioContext.Provider value={{ inventario, setInventario, agregarAlimento }}>
      {children}
    </InventarioContext.Provider>
  );
};

/**
 * Hook personalizado para acceder al contexto de inventario
 * @returns {InventarioContextType} El contexto de inventario
 * @throws {Error} Si se usa fuera de un InventarioProvider
 */
export const useInventario = () => {
  const context = useContext(InventarioContext);
  if (!context) throw new Error("useInventario debe usarse dentro de InventarioProvider");
  return context;
};

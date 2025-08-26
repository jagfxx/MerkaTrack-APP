import React, { createContext, useContext, useState, useEffect } from "react";

export type Alimento = {
  id: number;
  nombre: string;
  icon: string;
};

export type InventarioItem = Alimento & { cantidad: number };

export type InventarioContextType = {
  inventario: InventarioItem[];
  setInventario: React.Dispatch<React.SetStateAction<InventarioItem[]>>;
  agregarAlimento: (item: InventarioItem) => void;
};

const InventarioContext = createContext<InventarioContextType | undefined>(undefined);

export const InventarioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventario, setInventario] = useState<InventarioItem[]>([]);

  // Cargar inventario desde localStorage solo en cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("inventario");
      if (data) setInventario(JSON.parse(data));
    }
  }, []);

  // Guardar inventario en localStorage cada vez que cambie
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("inventario", JSON.stringify(inventario));
    }
  }, [inventario]);

  // Guardar historial de alimentos agregados
  const agregarAlimento = (item: InventarioItem) => {
    setInventario(prev => {
      const idx = prev.findIndex(i => i.id === item.id);
      if (idx !== -1) {
        // Sumar solo la cantidad que viene de la lista, no duplicar
        return prev.map((alimento, i) =>
          i === idx
            ? { ...alimento, cantidad: alimento.cantidad + item.cantidad }
            : alimento
        );
      } else {
        return [...prev, item];
      }
    });
    // Guardar en historial
    if (typeof window !== "undefined") {
      const historial = localStorage.getItem("historialAlimentos");
      const arr = historial ? JSON.parse(historial) : [];
      arr.push({ ...item, fecha: new Date().toISOString() });
      localStorage.setItem("historialAlimentos", JSON.stringify(arr));
    }
  };

  return (
    <InventarioContext.Provider value={{ inventario, setInventario, agregarAlimento }}>
      {children}
    </InventarioContext.Provider>
  );
};

export const useInventario = () => {
  const context = useContext(InventarioContext);
  if (!context) throw new Error("useInventario debe usarse dentro de InventarioProvider");
  return context;
};

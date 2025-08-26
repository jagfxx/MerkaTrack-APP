import React, { createContext, useContext, useState, useEffect } from "react";

export type Alimento = {
  id: number;
  nombre: string;
  icon: string;
};

export type ListaItem = Alimento & { cantidad: number };

export type ListaContextType = {
  lista: ListaItem[];
  setLista: React.Dispatch<React.SetStateAction<ListaItem[]>>;
  agregarAlimentoLista: (item: ListaItem) => void;
};

const ListaContext = createContext<ListaContextType | undefined>(undefined);

export const ListaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lista, setLista] = useState<ListaItem[]>([]);

  // Cargar lista desde localStorage solo en cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("lista");
      if (data) setLista(JSON.parse(data));
    }
  }, []);

  // Guardar lista en localStorage cada vez que cambie
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lista", JSON.stringify(lista));
    }
  }, [lista]);

  // Guardar historial de alimentos agregados a la lista
  const agregarAlimentoLista = (item: ListaItem) => {
    setLista(prev => {
      const idx = prev.findIndex(i => i.id === item.id);
      let nuevaLista;
      if (idx !== -1) {
        nuevaLista = [...prev];
        nuevaLista[idx].cantidad += item.cantidad;
      } else {
        nuevaLista = [...prev, item];
      }
      // Guardar en historial de lista
      if (typeof window !== "undefined") {
        const historial = localStorage.getItem("historialLista");
        const arr = historial ? JSON.parse(historial) : [];
        arr.push({ ...item, fecha: new Date().toISOString() });
        localStorage.setItem("historialLista", JSON.stringify(arr));
      }
      return nuevaLista;
    });
  };

  return (
    <ListaContext.Provider value={{ lista, setLista, agregarAlimentoLista }}>
      {children}
    </ListaContext.Provider>
  );
};

export const useLista = () => {
  const context = useContext(ListaContext);
  if (!context) throw new Error("useLista debe usarse dentro de ListaProvider");
  return context;
};

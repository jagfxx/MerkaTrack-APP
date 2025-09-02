import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useInventario } from './InventarioContext';
import { useGastos } from './GastosContext';

export interface ItemLista {
  id: string;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  agregado: boolean;
}

export interface Lista {
  id: string;
  nombre: string;
  items: ItemLista[];
  fechaCreacion: string;
  total: number;
}

interface ListasContextType {
  listas: Lista[];
  crearLista: (nombre: string) => void;
  agregarItemALista: (listaId: string, productoId: number, cantidad: number, precio: number) => void;
  eliminarLista: (id: string) => void;
  toggleItemAgregado: (listaId: string, itemId: string) => void;
  eliminarItemDeLista: (listaId: string, itemId: string) => void;
  obtenerLista: (id: string) => Lista | undefined;
}

const ListasContext = createContext<ListasContextType | undefined>(undefined);

export const ListasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { agregarAlimento } = useInventario();
  
  const [listas, setListas] = useState<Lista[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('listas');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // Guardar listas en localStorage cuando cambian
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('listas', JSON.stringify(listas));
    }
  }, [listas]);

  const crearLista = (nombre: string) => {
    const nuevaLista: Lista = {
      id: Date.now().toString(),
      nombre,
      items: [],
      fechaCreacion: new Date().toISOString(),
      total: 0
    };
    setListas(prev => [nuevaLista, ...prev]);
    return nuevaLista.id;
  };

  const agregarItemALista = (listaId: string, productoId: number, cantidad: number, precio: number) => {
    setListas(prev => prev.map(lista => {
      if (lista.id === listaId) {
        // Verificar si el producto ya está en la lista
        const itemExistente = lista.items.find(item => item.productoId === productoId);
        
        if (itemExistente) {
          // Si ya existe, actualizar cantidad
          const itemsActualizados = lista.items.map(item => 
            item.productoId === productoId 
              ? { ...item, cantidad: item.cantidad + cantidad }
              : item
          );
          
          return {
            ...lista,
            items: itemsActualizados,
            total: calcularTotal(itemsActualizados)
          };
        } else {
          // Si no existe, agregar nuevo ítem
          const nuevoItem: ItemLista = {
            id: Date.now().toString(),
            productoId,
            cantidad,
            precioUnitario: precio,
            agregado: false
          };
          
          return {
            ...lista,
            items: [...lista.items, nuevoItem],
            total: lista.total + (precio * cantidad)
          };
        }
      }
      return lista;
    }));
  };

  const eliminarLista = (id: string) => {
    setListas(prev => prev.filter(lista => lista.id !== id));
  };

  const { agregarGasto } = useGastos();

  const toggleItemAgregado = useCallback((listaId: string, itemId: string) => {
    setListas(prev => prev.map(lista => {
      if (lista.id === listaId) {
        const itemsActualizados = lista.items.map(item => {
          if (item.id === itemId) {
            const nuevoEstado = !item.agregado;
            
            // Si el ítem está siendo marcado como completado (no estaba agregado)
            if (nuevoEstado) {
              // Agregar al inventario
              agregarAlimento({
                id: item.productoId,
                nombre: `Producto ${item.productoId}`, // Nombre genérico, se puede mejorar
                icon: '🍎', // Ícono por defecto
                cantidad: item.cantidad
              });

              // Agregar a gastos
              agregarGasto({
                descripcion: `Compra de ${item.cantidad} unidades`,
                monto: item.precioUnitario * item.cantidad,
                categoria: 'Compras',
                categoriaIcono: '🛒',
                fecha: new Date().toISOString()
              });
            }
            
            return { ...item, agregado: nuevoEstado };
          }
          return item;
        });
        
        return {
          ...lista,
          items: itemsActualizados,
          total: calcularTotal(itemsActualizados)
        };
      }
      return lista;
    }));
  }, [agregarAlimento, agregarGasto]);

  const eliminarItemDeLista = (listaId: string, itemId: string) => {
    setListas(prev => prev.map(lista => {
      if (lista.id === listaId) {
        const itemAEliminar = lista.items.find(item => item.id === itemId);
        if (!itemAEliminar) return lista;
        
        return {
          ...lista,
          items: lista.items.filter(item => item.id !== itemId),
          total: lista.total - (itemAEliminar.precioUnitario * itemAEliminar.cantidad)
        };
      }
      return lista;
    }));
  };

  const obtenerLista = (id: string): Lista | undefined => {
    if (!id) return undefined;
    const listaEncontrada = listas.find(lista => lista.id === id);
    if (!listaEncontrada) {
      console.warn(`No se encontró ninguna lista con el ID: ${id}`);
      return undefined;
    }
    return listaEncontrada;
  };

  // Función auxiliar para calcular el total de una lista
  const calcularTotal = (items: ItemLista[]) => {
    return items.reduce((total, item) => total + (item.precioUnitario * item.cantidad), 0);
  };

  return (
    <ListasContext.Provider
      value={{
        listas,
        crearLista,
        agregarItemALista,
        eliminarLista,
        toggleItemAgregado,
        eliminarItemDeLista,
        obtenerLista
      }}
    >
      {children}
    </ListasContext.Provider>
  );
};

export const useListas = (): ListasContextType => {
  const context = useContext(ListasContext);
  if (!context) {
    throw new Error('useListas debe usarse dentro de un ListasProvider');
  }
  return context;
};

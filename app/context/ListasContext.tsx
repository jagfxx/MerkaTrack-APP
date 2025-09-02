import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ReactNode } from 'react';
import { useInventario } from './InventarioContext';
import { useGastos } from './GastosContext';
import alimentosData from '../components/alimentos.json';

interface Alimento {
  id: number;
  nombre: string;
  icon: string;
  precio: number;
}

const alimentos: Alimento[] = alimentosData as Alimento[];

export interface ItemLista {
  id: string;
  productoId: number;
  cantidad: number;
  precioUnitario: number;
  agregado: boolean;
  consumido: boolean;
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
  toggleItemConsumido: (listaId: string, itemId: string) => void;
  eliminarItemDeLista: (listaId: string, itemId: string) => void;
  obtenerLista: (id: string) => Lista | undefined;
}

const ListasContext = createContext<ListasContextType | undefined>(undefined);

export const ListasProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { agregarAlimento } = useInventario();
  const { agregarGasto } = useGastos();
  
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

  // Usar useRef para rastrear si ya se está agregando un ítem
  const isAddingItem = useRef<{[key: string]: boolean}>({});

  const agregarItemALista = useCallback((listaId: string, productoId: number, cantidad: number, precio: number) => {
    const operationKey = `add-${listaId}-${productoId}`;
    
    // Si ya se está agregando este ítem, ignorar llamadas adicionales
    if (isAddingItem.current[operationKey]) {
      console.log(`[agregarItemALista] Operación duplicada ignorada para ${operationKey}`);
      return;
    }
    
    // Marcar como en proceso
    isAddingItem.current[operationKey] = true;
    
    console.log(`[agregarItemALista] Agregando ${cantidad} unidades del producto ${productoId} a la lista ${listaId}`);
    
    setListas((prevListas: Lista[]) => {
      return prevListas.map((lista: Lista) => {
        if (lista.id === listaId) {
          // Buscar si el producto ya está en la lista y no está marcado como completado
          const itemExistenteIndex = lista.items.findIndex((item: ItemLista) => 
            item.productoId === productoId && !item.agregado
          );
          
          // Crear una copia del array de items
          const itemsActualizados = [...lista.items];
          
          if (itemExistenteIndex !== -1) {
            // Si ya existe, actualizar cantidad
            console.log(`[agregarItemALista] Producto ${productoId} ya existe en la lista, actualizando cantidad`);
            
            const itemExistente = itemsActualizados[itemExistenteIndex];
            itemsActualizados[itemExistenteIndex] = {
              ...itemExistente,
              cantidad: itemExistente.cantidad + cantidad,
              precioUnitario: precio // Actualizar el precio por si cambió
            };
            
            const nuevoTotal = calcularTotal(itemsActualizados);
            console.log(`[agregarItemALista] Nueva cantidad: ${itemsActualizados[itemExistenteIndex].cantidad}, Total actualizado: ${nuevoTotal}`);
            
            // Limpiar la bandera después de un breve retraso
            setTimeout(() => {
              delete isAddingItem.current[operationKey];
            }, 100);
            
            return {
              ...lista,
              items: itemsActualizados,
              total: nuevoTotal
            };
          } else {
            // Si no existe, agregar nuevo ítem
            console.log(`[agregarItemALista] Agregando nuevo ítem: ${productoId} x${cantidad} a ${precio} cada uno`);
            
            const nuevoItem: ItemLista = {
              id: Date.now().toString(),
              productoId,
              cantidad,
              precioUnitario: precio,
              agregado: false,
              consumido: false
            };
            
            itemsActualizados.push(nuevoItem);
            const nuevoTotal = calcularTotal(itemsActualizados);
            
            console.log(`[agregarItemALista] Nuevo total de la lista: ${nuevoTotal}`);
            
            // Limpiar la bandera después de un breve retraso
            setTimeout(() => {
              delete isAddingItem.current[operationKey];
            }, 100);
            
            return {
              ...lista,
              items: itemsActualizados,
              total: nuevoTotal
            };
          }
        }
        return lista;
      });
    });
  }, [agregarAlimento, agregarGasto]);

  const eliminarLista = (id: string) => {
    setListas(prev => prev.filter(lista => lista.id !== id));
  };

  // Función auxiliar para calcular el total de una lista
  const calcularTotal = (items: ItemLista[]): number => {
    return items.reduce((total, item) => total + (item.precioUnitario * item.cantidad), 0);
  };

  // Usar una referencia para rastrear si ya se está procesando un toggle
  const isProcessing = useRef<{[key: string]: boolean}>({});

  const toggleItemConsumido = useCallback((listaId: string, itemId: string) => {
    setListas(prevListas => {
      return prevListas.map(lista => {
        if (lista.id !== listaId) return lista;
        
        const itemIndex = lista.items.findIndex(i => i.id === itemId);
        if (itemIndex === -1) return lista;
        
        const updatedItems = [...lista.items];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          consumido: !updatedItems[itemIndex].consumido
        };
        
        return {
          ...lista,
          items: updatedItems
        };
      });
    });
  }, []);

  const toggleItemAgregado = useCallback((listaId: string, itemId: string) => {
    const toggleKey = `${listaId}-${itemId}`;
    
    // Si ya se está procesando este toggle, ignorar llamadas adicionales
    if (isProcessing.current[toggleKey]) {
      console.log(`[toggleItemAgregado] Ignorando doble clic para ${toggleKey}`);
      return;
    }

    // Marcar como en proceso
    isProcessing.current[toggleKey] = true;
    
    console.log(`[toggleItemAgregado] Iniciando toggle para item ${itemId} en lista ${listaId}`);
    
    // Usar una bandera para rastrear si ya se procesó este ítem
    let itemProcesado = false;
    
    setListas(prevListas => {
      // Crear una copia profunda del estado anterior
      const newState = prevListas.map(lista => ({
        ...lista,
        items: [...lista.items],
      }));
      
      const listaIndex = newState.findIndex(l => l.id === listaId);
      if (listaIndex === -1) {
        console.warn(`[toggleItemAgregado] Lista ${listaId} no encontrada`);
        isProcessing.current[toggleKey] = false; // Liberar el bloqueo
        return prevListas;
      }
      
      const lista = newState[listaIndex];
      const itemIndex = lista.items.findIndex((item: ItemLista) => item.id === itemId);
      
      if (itemIndex === -1) {
        console.warn(`[toggleItemAgregado] Item ${itemId} no encontrado en la lista ${listaId}`);
        isProcessing.current[toggleKey] = false; // Liberar el bloqueo
        return prevListas;
      }
      
      const item = { ...lista.items[itemIndex] };
      
      // No hacer nada si el item ya está marcado como completado
      if (item.agregado) {
        console.log(`[toggleItemAgregado] El item ${itemId} ya está marcado como completado, ignorando...`);
        isProcessing.current[toggleKey] = false; // Liberar el bloqueo
        return prevListas;
      }
      
      // Marcar el ítem como completado
      item.agregado = true;
      // Actualizar el ítem en la lista
      lista.items[itemIndex] = item;
      
      console.log(`[toggleItemAgregado] Procesando item: ${JSON.stringify(item, null, 2)}`);
      
      // Obtener información del alimento
      const alimento = alimentos.find((a: Alimento) => a.id === item.productoId);
      const nombreAlimento = alimento?.nombre || `Producto ${item.productoId}`;
      const iconoAlimento = alimento?.icon || '📦';
      
      console.log(`[toggleItemAgregado] Agregando al inventario: ${nombreAlimento} (${item.cantidad} unidades)`);
      
      // Actualizar el total de la lista
      lista.total = calcularTotal(lista.items);
      
      // Usar un ID único para este proceso
      const processId = Date.now();
      console.log(`[toggleItemAgregado] [${processId}] Procesando ítem ${itemId}`);
      
      // Usar setTimeout para evitar problemas con las actualizaciones de estado
      const timeoutId = setTimeout(() => {
        // Verificar si este es el último intento de procesamiento
        if (!isProcessing.current[toggleKey]) {
          console.log(`[toggleItemAgregado] [${processId}] Operación cancelada - ya hay una operación posterior`);
          return;
        }
        
        // Agregar al inventario
        if (agregarAlimento) {
          console.log(`[toggleItemAgregado] [${processId}] Agregando a inventario: ${nombreAlimento} x${item.cantidad}`);
          agregarAlimento({
            id: item.productoId,
            nombre: nombreAlimento,
            icon: iconoAlimento,
            cantidad: item.cantidad
          });
        }
        
        // Agregar a gastos
        if (agregarGasto) {
          const descripcion = `${nombreAlimento} (${item.cantidad} ${item.cantidad === 1 ? 'unidad' : 'unidades'})`;
          console.log(`[toggleItemAgregado] [${processId}] Agregando a gastos: ${descripcion}`);
          // Crear el objeto de gasto sin el ID (se generará en el contexto de gastos)
          const nuevoGasto = {
            descripcion,
            monto: item.precioUnitario * item.cantidad,
            categoria: 'Compras',
            categoriaIcono: '🛒',
            fecha: new Date().toISOString()
          };
          // Usar el ID generado automáticamente por el contexto de gastos
          agregarGasto(nuevoGasto);
        }
        
        // Limpiar el estado de procesamiento
        console.log(`[toggleItemAgregado] [${processId}] Proceso completado para ${toggleKey}`);
        delete isProcessing.current[toggleKey];
      }, 0);
      
      console.log(`[toggleItemAgregado] Lista actualizada. Total: ${lista.total}`);
      
      return newState;
    });
  }, [agregarAlimento, agregarGasto, alimentos]);

  const eliminarItemDeLista = (listaId: string, itemId: string) => {
    setListas(prevListas => prevListas.map(lista => {
      if (lista.id === listaId) {
        const itemAEliminar = lista.items.find((item: ItemLista) => item.id === itemId);
        if (!itemAEliminar) return lista;
        
        return {
          ...lista,
          items: lista.items.filter((item: ItemLista) => item.id !== itemId),
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

  return (
    <ListasContext.Provider
      value={{
        listas,
        crearLista,
        agregarItemALista,
        eliminarLista,
        toggleItemAgregado,
        toggleItemConsumido,
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

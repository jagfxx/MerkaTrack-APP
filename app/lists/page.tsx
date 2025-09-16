'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListas } from '../context/ListasContext';
import { useSettings } from '../context/SettingsContext';

interface Lista {
  id: string;
  nombre: string;
  fechaCreacion: string;
  items: any[];
  total: number;
}

export default function ListsPage() {
  const navigate = useNavigate();
  const { listas, crearLista, eliminarLista } = useListas();
  const { formatCurrency } = useSettings();
  const [nuevaListaNombre, setNuevaListaNombre] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleCrearLista = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaListaNombre.trim()) return;
    
    const listaId = crearLista(nuevaListaNombre);
    setNuevaListaNombre('');
    setMostrarModal(false);
    navigate(`/lists/${listaId}`);
  };

  const formatearFecha = (fechaISO: string) => {
    return new Date(fechaISO).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Encabezado */}
      <div className="bg-white p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-[#FA8603]">Mis Listas</h1>
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Botón para crear nueva lista */}
        <button
          onClick={() => setMostrarModal(true)}
          className="w-full bg-[#FA8603] text-white py-3 rounded-xl font-bold mb-6 flex items-center justify-center space-x-2"
        >
          <span>+</span>
          <span>Crear Nueva Lista</span>
        </button>

        {/* Lista de listas */}
        <div className="grid grid-cols-1 gap-4 mt-4">
          {listas.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No tienes listas creadas aún
            </div>
          ) : (
            listas.map((lista: Lista, i: number) => (
              <div 
                key={lista.id}
                className="bg-white rounded-xl shadow p-4 active:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">{lista.nombre}</h3>
                    <p className="text-sm text-gray-500">
                      {lista.items.length} items • {formatearFecha(lista.fechaCreacion)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency(
                        lista.items.reduce((acc: number, item: any) => {
                          // Usar precioUnitario si existe, si no usar precio
                          const precio = typeof item.precioUnitario === 'number' ? item.precioUnitario : item.precio;
                          const cantidad = typeof item.cantidad === 'number' ? item.cantidad : 1;
                          return acc + (Number(precio) * Number(cantidad));
                        }, 0)
                      )}
                    </p>
                    <button 
                      onClick={() => navigate(`/lists/${lista.id}`)}
                      className="text-sm text-[#FA8603] hover:underline"
                    >
                      Ver lista
                    </button>
                  </div>
                </div>
                
                {/* Barra de progreso */}
                {lista.items.length > 0 && (
                  <div className="mt-3 w-full">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className="bg-[#FA8603] h-2.5 rounded-full transition-all duration-300" 
                        style={{
                          width: `${(lista.items.filter((i: any) => i.agregado).length / lista.items.length) * 100}%`
                        }}
                      />
                    </div>
                    <div className="text-right text-xs text-gray-500 mt-1">
                      {lista.items.filter((i: any) => i.agregado).length} de {lista.items.length} completados
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal para crear nueva lista */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nueva Lista</h2>
            <form onSubmit={handleCrearLista}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la lista
                </label>
                <input
                  type="text"
                  value={nuevaListaNombre}
                  onChange={(e) => setNuevaListaNombre(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA8603] focus:border-transparent"
                  placeholder="Ej: Compras del supermercado"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FA8603] text-white font-medium rounded-lg hover:bg-[#e67a00]"
                  disabled={!nuevaListaNombre.trim()}
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

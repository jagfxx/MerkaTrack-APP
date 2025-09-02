import React, { useState, useEffect } from 'react';
import { useGastos } from '../context/GastosContext';
import { useSettings } from '../context/SettingsContext';
import alimentosData from '../components/alimentos.json';

// Definición del tipo para los gastos
interface Gasto {
  id: string;
  descripcion: string;
  monto: number;
  categoria: string;
  categoriaIcono: string;
  fecha: string;
}

// Interfaz para los ítems de comida
interface ComidaItem {
  id: number;
  nombre: string;
  icon: string;
  precio: number;
}

// Convertir datos de alimentos al tipo ComidaItem
const COMIDAS: ComidaItem[] = alimentosData as ComidaItem[];

export default function Expenses() {
  // Usar los contextos
  const { gastos, agregarGasto: agregarGastoContext, totalGastos } = useGastos();
  const { convertToCurrentCurrency, formatCurrency } = useSettings();
  
  // Estado para controlar la visibilidad del modal de nuevo gasto
  const [mostrarModal, setMostrarModal] = useState(false);
  
  // Estado para búsqueda de comidas
  const [busqueda, setBusqueda] = useState('');
  
  // Filtrar comidas por búsqueda
  const comidasFiltradas = COMIDAS.filter(comida =>
    comida.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  
  // Agregar un ítem de comida como gasto
  const agregarComidaComoGasto = (comida: ComidaItem) => {
    agregarGastoContext({
      descripcion: comida.nombre,
      monto: comida.precio,
      categoria: 'Comida',
      categoriaIcono: comida.icon,
      fecha: new Date().toISOString()
    });
  };
  
  // Agregar un nuevo gasto manual
  const agregarGasto = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const descripcion = formData.get('descripcion') as string;
    const monto = formData.get('monto') as string;
    
    if (!descripcion || !monto) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    const montoEnCOP = parseFloat(monto.replace(/[^0-9]/g, ''));
    
    agregarGastoContext({
      descripcion,
      monto: montoEnCOP,
      categoria: 'Otro',
      categoriaIcono: '💵',
      fecha: new Date().toISOString()
    });
    
    // Cerrar el modal
    setMostrarModal(false);
  };
  
  // Eliminar un gasto
  const { eliminarGasto } = useGastos();
  
  // Formatear fecha
  const formatearFecha = (fechaISO: string) => {
    return new Date(fechaISO).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col bg-white w-full h-full">
      {/* Encabezado */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-[#FA8603]">Gastos</h1>
        <button
          onClick={() => setMostrarModal(true)}
          className="bg-[#FA8603] text-white px-4 py-2 rounded-full font-bold hover:bg-[#e67a00] transition-colors"
        >
          + Agregar Gasto Manual
        </button>
      </div>
      
      {/* Resumen de gastos */}
      <div className="bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow p-6 max-w-4xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen de Gastos</h2>
              <div className="text-2xl font-bold">
                {formatCurrency(convertToCurrentCurrency(totalGastos, 'COP'))}
              </div>
              <p className="text-gray-500 text-sm mt-1">Total gastado</p>
            </div>
            <div className="flex items-center">
              <div className="w-full">
                <label htmlFor="buscarComida" className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar comida
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="buscarComida"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Buscar comida..."
                    className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA8603] focus:border-transparent"
                  />
                  <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Lista de comidas */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Agregar gastos comunes</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {comidasFiltradas.map((comida) => (
                <button
                  key={comida.id}
                  onClick={() => agregarComidaComoGasto(comida)}
                  className="flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:border-[#FA8603] hover:shadow-md transition-all"
                >
                  <span className="text-2xl mb-1">{comida.icon}</span>
                  <span className="text-sm font-medium text-center">{comida.nombre}</span>
                  <span className="text-xs text-[#FA8603] font-semibold mt-1">
                    {formatCurrency(convertToCurrentCurrency(comida.precio, 'COP'))}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Lista de gastos */}
      <div className="flex-1 overflow-y-auto p-4 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Historial de Gastos</h2>
          <span className="text-sm text-gray-500">{gastos.length} gastos registrados</span>
        </div>
        
        {gastos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <div className="text-5xl mb-4">🛒</div>
            <h3 className="text-lg font-medium text-gray-700">No hay gastos registrados</h3>
            <p className="text-gray-500 mt-1">Agrega tu primer gasto desde la lista de arriba</p>
          </div>
        ) : (
          <div className="space-y-3">
            {gastos.map((gasto) => (
              <div 
                key={gasto.id}
                className="bg-white rounded-xl shadow p-4 flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-[#FA8603]/10 p-3 rounded-full">
                    <span className="text-[#FA8603] text-xl">
                      {gasto.categoriaIcono}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-lg font-medium">
                        {formatCurrency(convertToCurrentCurrency(gasto.monto, 'COP'))}
                      </p>
                      <span className="text-sm text-gray-500">
                        {formatCurrency(convertToCurrentCurrency(gasto.monto, 'USD'))}
                      </span>
                    </div>
                    <h3 className="font-medium">{gasto.descripcion}</h3>
                    <p className="text-sm text-gray-500">
                      {gasto.categoria} • {formatearFecha(gasto.fecha)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => eliminarGasto(gasto.id)}
                  className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                  title="Eliminar gasto"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal para agregar nuevo gasto manual */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#FA8603] mb-4">Agregar Gasto Manual</h2>
            
            <form onSubmit={agregarGasto}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  name="descripcion"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA8603] focus:border-transparent"
                  placeholder="Ej. Compra en el supermercado"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Monto (COP)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="text"
                    name="monto"
                    className="w-full pl-8 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA8603] focus:border-transparent"
                    placeholder="0"
                    required
                    pattern="[0-9]*"
                    inputMode="numeric"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FA8603] text-white font-medium rounded-lg hover:bg-[#e67a00] transition-colors"
                >
                  Agregar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
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

  // Calcular el total de gastos de comida
  const totalGastosComida = gastos
    .filter(gasto => gasto.categoria === 'Comida')
    .reduce((total, gasto) => total + gasto.monto, 0);

  return (
    <div className="flex flex-col bg-white w-full min-h-screen">
      {/* Encabezado */}
      <div className="p-4 bg-[#FA8603] text-white">
        <h1 className="text-2xl font-bold mb-2">Gastos</h1>
        <p className="text-sm opacity-90">Total gastado en la lista</p>
      </div>
      
      {/* Monto total */}
      <div className="p-6 bg-white shadow-sm">
        <div className="text-4xl font-bold text-center">
          {formatCurrency(totalGastosComida)}
        </div>
        <p className="text-center text-gray-500 text-sm mt-2">
          {gastos.length} {gastos.length === 1 ? 'artículo' : 'artículos'} en la lista
        </p>
      </div>
      
      {/* Botón de agregar gasto */}
      <div className="p-4">
        <button
          onClick={() => setMostrarModal(true)}
          className="w-full bg-[#FA8603] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Agregar Gasto Manual
        </button>
      </div>
      
      {/* Lista de comidas */}
      <div className="p-4">
        <div className="relative mb-4">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar comida..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FA8603] focus:border-transparent"
          />
          <span className="absolute left-3 top-3.5 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {comidasFiltradas.map((comida) => (
            <button
              key={comida.id}
              onClick={() => agregarComidaComoGasto(comida)}
              className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mb-2">{comida.icon}</span>
              <span className="text-sm font-medium text-gray-800">{comida.nombre}</span>
              <span className="text-sm text-[#FA8603] font-medium mt-1">{formatCurrency(comida.precio)}</span>
            </button>
          ))}
        </div>
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
import React, { useState, useEffect } from 'react';
import { useGastos } from '../context/GastosContext';
import { useSettings } from '../context/SettingsContext';
import { useInventario } from '../context/InventarioContext';
import { useListas } from '../context/ListasContext';
import alimentosData from '../components/alimentos.json';

// Definición del tipo para los gastos de comida
interface GastoComida {
  id: string;
  nombre: string;
  monto: number;
  icono: string;
  fecha: string;
  cantidad: number;
}

export default function Expenses() {
  // Usar los contextos
  const { formatCurrency } = useSettings();
  const { inventario } = useInventario();
  const { listas } = useListas();
  
  // Estado para búsqueda de comidas
  const [busqueda, setBusqueda] = useState('');
  
  // Obtener historial de movimientos de listas a inventario
  const [historialMovimientos, setHistorialMovimientos] = useState<GastoComida[]>([]);
  
  // Cargar el historial de movimientos
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const historial = localStorage.getItem('historialAlimentos');
      if (historial) {
        const movimientos = JSON.parse(historial);
        // Procesar el historial para mostrar solo los movimientos de listas a inventario
        const movimientosProcesados = movimientos.map((mov: any) => ({
          id: mov.id || Date.now().toString(),
          nombre: mov.nombre,
          monto: mov.precio || 0,
          icono: mov.icon || '🍽️',
          fecha: mov.fecha || new Date().toISOString(),
          cantidad: mov.cantidad || 1
        }));
        setHistorialMovimientos(movimientosProcesados);
      }
    }
  }, [inventario]);
  
  // Filtrar movimientos por búsqueda
  const movimientosFiltrados = historialMovimientos.filter(movimiento =>
    movimiento.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  
  // Calcular el total gastado en comidas
  const totalGastado = historialMovimientos.reduce(
    (total, mov) => total + (mov.monto * mov.cantidad), 
    0
  );
  
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
    <div className="flex flex-col bg-white w-full min-h-screen">
      {/* Encabezado */}
      <div className="p-4 bg-[#FA8603] text-white">
        <h1 className="text-2xl font-bold mb-2">Gastos de Comida</h1>
        <p className="text-sm opacity-90">Resumen de compras de alimentos</p>
      </div>
      
      {/* Tarjeta de resumen */}
      <div className="bg-white shadow-sm mx-4 mt-4 p-6 rounded-xl border border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Total gastado</p>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalGastado)}</p>
          </div>
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total de artículos</span>
            <span className="font-medium">{historialMovimientos.length}</span>
          </div>
        </div>
      </div>
      
      {/* Barra de búsqueda */}
      <div className="px-4 mt-6">
        <div className="relative">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar en gastos..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FA8603] focus:border-transparent"
          />
          <span className="absolute left-3 top-3.5 text-gray-400">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
      
      {/* Lista de gastos */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {movimientosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🛒</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No hay gastos registrados</h3>
            <p className="text-gray-500 text-sm">Los artículos que muevas de listas a inventario aparecerán aquí</p>
          </div>
        ) : (
          <div className="space-y-3">
            {movimientosFiltrados.map((movimiento) => (
              <div 
                key={movimiento.id}
                className="flex items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow transition-shadow"
              >
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-xl mr-3">
                  {movimiento.icono}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{movimiento.nombre}</div>
                  <div className="text-xs text-gray-500">{formatearFecha(movimiento.fecha)}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(movimiento.monto * movimiento.cantidad)}</div>
                  <div className="text-xs text-gray-500">{movimiento.cantidad} {movimiento.cantidad === 1 ? 'unidad' : 'unidades'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useGastos } from '../context/GastosContext';
import alimentosData from '../components/alimentos.json';

// Definición del tipo para los gastos
interface Gasto {
  id: string;
  descripcion: string;
  monto: number;
  categoria: string;
  categoriaIcono: string; // Nuevo campo para el ícono de la categoría
  fecha: string;
}

// Obtener categorías de alimentos desde el archivo JSON
const CATEGORIAS = alimentosData.map(alimento => ({
  nombre: alimento.nombre,
  icono: alimento.icon
}));

export default function Expenses() {
  // Usar el contexto de gastos
  const { gastos, agregarGasto: agregarGastoContext, totalGastos } = useGastos();
  
  // Estados para el formulario de nuevo gasto
  const [nuevoGasto, setNuevoGasto] = useState({
    descripcion: '',
    monto: '',
    categoria: CATEGORIAS[0].nombre,
    categoriaIcono: CATEGORIAS[0].icono
  });
  
  // Estado para controlar la visibilidad del modal de nuevo gasto
  const [mostrarModal, setMostrarModal] = useState(false);
  
  // Manejar cambios en los inputs del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevoGasto(prev => ({
      ...prev,
      [name]: name === 'monto' ? value.replace(/[^0-9]/g, '') : value
    }));
  };
  
  // Agregar un nuevo gasto
  const agregarGasto = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nuevoGasto.descripcion || !nuevoGasto.monto) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    agregarGastoContext({
      descripcion: nuevoGasto.descripcion,
      monto: parseFloat(nuevoGasto.monto),
      categoria: nuevoGasto.categoria,
      categoriaIcono: CATEGORIAS.find(cat => cat.nombre === nuevoGasto.categoria)?.icono || '💵',
      fecha: new Date().toISOString()
    });
    
    // Limpiar el formulario
    setNuevoGasto({
      descripcion: '',
      monto: '',
      categoria: CATEGORIAS[0].nombre,
      categoriaIcono: CATEGORIAS[0].icono
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
          + Agregar Gasto
        </button>
      </div>
      
      {/* Resumen de gastos */}
      <div className="bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen de Gastos</h2>
          <div className="text-3xl font-bold text-[#FA8603]">
            ${totalGastos.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </div>
          <p className="text-gray-500 text-sm mt-1">Total gastado</p>
        </div>
      </div>
      
      {/* Lista de gastos */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Historial de Gastos</h2>
        
        {gastos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay gastos registrados. Agrega tu primer gasto.
          </div>
        ) : (
          <div className="space-y-3">
            {gastos.map((gasto) => (
              <div 
                key={gasto.id}
                className="bg-white rounded-xl shadow p-4 flex justify-between items-center"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-[#FA8603]/10 p-3 rounded-full">
                    <span className="text-[#FA8603] text-xl">
                      {gasto.categoriaIcono}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{gasto.descripcion}</h3>
                    <p className="text-sm text-gray-500">
                      {gasto.categoria} • {formatearFecha(gasto.fecha)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900">
                    ${gasto.monto.toLocaleString('es-ES')}
                  </span>
                  <button
                    onClick={() => eliminarGasto(gasto.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Eliminar gasto"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Modal para agregar nuevo gasto */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-[#FA8603] mb-4">Agregar Gasto</h2>
            
            <form onSubmit={agregarGasto}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Descripción
                </label>
                <input
                  type="text"
                  name="descripcion"
                  value={nuevoGasto.descripcion}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA8603] focus:border-transparent"
                  placeholder="Ej. comida vegana"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Monto
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="text"
                      name="monto"
                      value={nuevoGasto.monto}
                      onChange={handleInputChange}
                      className="w-full pl-8 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA8603] focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Categoría
                  </label>
                  <select
                    name="categoria"
                    value={nuevoGasto.categoria}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA8603] focus:border-transparent"
                  >
                    {CATEGORIAS.map((categoria) => (
                      <option key={categoria.nombre} value={categoria.nombre}>
                        {categoria.icono} {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>
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
                >
                  Guardar Gasto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
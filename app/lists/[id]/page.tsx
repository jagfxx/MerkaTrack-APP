import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useListas } from '../../context/ListasContext';
import { useSettings } from '../../context/SettingsContext';
import alimentosData from '../../components/alimentos.json';

interface Alimento {
  id: number;
  nombre: string;
  icon: string;
  precio: number;
}

export default function ListaDetallePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const { 
    obtenerLista, 
    agregarItemALista, 
    toggleItemAgregado, 
    toggleItemConsumido,
    eliminarItemDeLista 
  } = useListas();
  
  const { formatCurrency } = useSettings();
  const [lista, setLista] = useState(obtenerLista(id as string));
  const [busqueda, setBusqueda] = useState('');
  const [selectedAlimento, setSelectedAlimento] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [mostrarAgregarItem, setMostrarAgregarItem] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  
  // Actualizar la lista cuando cambie el ID o los datos
  useEffect(() => {
    if (!id) return;
    
    const listaActual = obtenerLista(id);
    setLista(listaActual);
    
    if (!listaActual) {
      console.error(`Lista con ID ${id} no encontrada`);
      navigate('/lists');
      return;
    }
  }, [id, obtenerLista, navigate]);
  
  // Filtrar alimentos según la búsqueda
  const alimentosFiltrados = (alimentosData as Alimento[]).filter((alimento: Alimento) =>
    alimento.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  
  const handleAgregarItem = (productoId: number, precio: number) => {
    if (lista) {
      agregarItemALista(lista.id, productoId, cantidad, precio);
      setCantidad(1);
      setMostrarAgregarItem(false);
      setBusqueda('');
      
      // Actualizar la lista después de agregar un ítem
      setLista(obtenerLista(id as string));
    }
  };
  
  if (!lista) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Cargando lista...</p>
      </div>
    );
  }
  
  // Función para manejar la navegación hacia atrás
  const handleBack = () => {
    navigate(-1);
  };
  
  const itemsAgregados = lista.items.filter(item => item.agregado).length;
  const totalItems = lista.items.length;
  const porcentajeCompletado = totalItems > 0 ? Math.round((itemsAgregados / totalItems) * 100) : 0;
  
  return (
    <div className="flex flex-col h-screen bg-gray-50 pb-24">
      {/* Encabezado */}
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleBack}
            className="w-12 h-12 flex items-center justify-center -ml-2 active:bg-gray-100 rounded-full transition-colors"
            aria-label="Volver"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h1 className="text-xl font-bold text-[#FA8603] flex-1 line-clamp-1">{lista.nombre}</h1>
        </div>
        
        {/* Barra de progreso */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">{porcentajeCompletado}% completado</span>
            <span className="font-medium">{itemsAgregados}/{totalItems} ítems</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-[#FA8603] h-full rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${porcentajeCompletado}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto pb-32">
        
        {/* Panel para agregar ítems */}
        <div className={`bg-white shadow-md transition-all duration-300 ease-in-out transform ${mostrarAgregarItem ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
          <div className="p-4">
            <div className="relative mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FA8603] focus:border-transparent text-base"
                  autoFocus
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Lista de productos */}
            <div className="max-h-[50vh] overflow-y-auto -mx-4">
              {alimentosFiltrados.map((producto: Alimento) => (
                <div 
                  key={producto.id}
                  className="px-4 py-3 active:bg-gray-50 transition-colors"
                  onClick={() => handleAgregarItem(producto.id, producto.precio)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                        {producto.icon}
                      </div>
                      <div>
                        <div className="font-medium">{producto.nombre}</div>
                        <div className="text-sm text-gray-500">{formatCurrency(producto.precio)}</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAgregarItem(producto.id, producto.precio);
                      }}
                      className="w-10 h-10 flex items-center justify-center text-[#FA8603] active:bg-orange-50 rounded-full"
                      aria-label={`Agregar ${producto.nombre}`}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Fixed bottom bar for quantity selector - only shown when adding items */}
            {mostrarAgregarItem && (
              <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-20">
                <div className="max-w-md mx-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Cantidad:</span>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCantidad(prev => Math.max(1, prev - 1));
                        }}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
                        aria-label="Reducir cantidad"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12H19" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                      <span className="w-10 text-center text-lg font-medium">{cantidad}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCantidad(prev => prev + 1);
                        }}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:bg-gray-200 transition-colors"
                        aria-label="Aumentar cantidad"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5V19M5 12H19" stroke="#374151" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Floating action button */}
        <div className="fixed bottom-24 right-4 z-10">
          <button 
            onClick={() => setMostrarAgregarItem(!mostrarAgregarItem)}
            className="w-14 h-14 bg-[#FA8603] text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
            aria-label="Agregar ítem"
          >
            {mostrarAgregarItem ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
        
        {/* Lista de ítems */}
        <div className="p-4 space-y-3 pb-20">
          {lista.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 5V19H5V5H19ZM19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM11 16H13V11H16V9H13V4H11V9H8V11H11V16Z" fill="#FB923C"/>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Lista vacía</h3>
              <p className="text-gray-500 text-sm">Presiona el botón + para agregar ítems</p>
            </div>
          ) : (
            <div className="space-y-2">
              {lista.items.map((item: any) => {
                const producto = (alimentosData as Alimento[]).find((p: Alimento) => p.id === item.productoId);
                if (!producto) return null;
                
                return (
                  <div 
                    key={item.id}
                    className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 ${
                      item.agregado ? 'opacity-70' : 'active:scale-[0.98]'
                    }`}
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="flex-shrink-0 flex flex-col items-center space-y-1">
                          <button
                            onClick={() => toggleItemAgregado(lista.id, item.id)}
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                              item.agregado 
                                ? 'bg-[#FA8603] border-[#FA8603]' 
                                : 'border-gray-300 active:border-[#FA8603] active:bg-orange-50'
                            }`}
                            aria-label={item.agregado ? 'Desmarcar como completado' : 'Marcar como completado'}
                          >
                            {item.agregado && (
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          {item.agregado && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleItemConsumido(lista.id, item.id);
                              }}
                              className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs transition-colors ${
                                item.consumido 
                                  ? 'bg-green-100 border-green-400 text-green-600' 
                                  : 'border-gray-300 text-gray-400 hover:bg-gray-50 active:bg-green-50 active:border-green-200'
                              }`}
                              aria-label={item.consumido ? 'Marcar como no consumido' : 'Marcar como consumido'}
                            >
                              {item.consumido ? '✓' : '−'}
                            </button>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 ml-3">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-medium truncate ${item.agregado ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                              {producto.nombre}
                            </h3>
                            <span className="text-sm font-medium ml-2 whitespace-nowrap">
                              {formatCurrency(item.precioUnitario * item.cantidad)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="text-sm text-gray-500">
                              {formatCurrency(item.precioUnitario)} × {item.cantidad}
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                eliminarItemDeLista(lista.id, item.id);
                              }}
                              className="text-gray-400 hover:text-red-500 active:text-red-600 transition-colors p-1 -mr-2"
                              aria-label="Eliminar ítem"
                            >
                              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Resumen */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Total estimado:</span>
          <span className="text-xl font-bold">
            {formatCurrency(lista.total)}
          </span>
        </div>
        <button
          className="w-full bg-[#FA8603] text-white py-3 rounded-xl font-bold"
          onClick={() => {
            // Aquí podrías agregar la lógica para compartir la lista
            alert('Función de compartir lista en desarrollo');
          }}
        >
          Compartir Lista
        </button>
      </div>
    </div>
  );
}

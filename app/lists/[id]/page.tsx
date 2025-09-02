import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
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
    <div className="flex flex-col h-full bg-gray-50">
      {/* Encabezado */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleBack}
            className="text-gray-600"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-[#FA8603] flex-1">{lista.nombre}</h1>
        </div>
        
        {/* Barra de progreso */}
        <div className="mt-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">{porcentajeCompletado}% completado</span>
            <span className="font-medium">{itemsAgregados}/{totalItems} ítems</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-[#FA8603] h-2.5 rounded-full" 
              style={{ width: `${porcentajeCompletado}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 overflow-y-auto">
        {/* Botón para agregar ítems */}
        <div className="p-4">
          <button
            onClick={() => setMostrarAgregarItem(!mostrarAgregarItem)}
            className="w-full bg-[#FA8603] text-white py-3 rounded-xl font-bold flex items-center justify-center space-x-2"
          >
            <span>+</span>
            <span>Agregar ítems</span>
          </button>
        </div>
        
        {/* Formulario para agregar ítems */}
        {mostrarAgregarItem && (
          <div className="bg-white p-4 border-b border-gray-200">
            <div className="relative mb-3">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA8603] focus:border-transparent"
                autoFocus
              />
            </div>
            
            {/* Lista de productos */}
            <div className="max-h-60 overflow-y-auto">
              {alimentosFiltrados.map((producto: Alimento) => (
                <div 
                  key={producto.id}
                  className="flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{producto.icon}</span>
                    <span>{producto.nombre}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600">{formatCurrency(producto.precio)}</span>
                    <button
                      onClick={() => handleAgregarItem(producto.id, producto.precio)}
                      className="text-[#FA8603] font-bold"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <label className="text-sm text-gray-600">Cantidad:</label>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-8 text-center">{cantidad}</span>
                <button 
                  onClick={() => setCantidad(prev => prev + 1)}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Lista de ítems */}
        <div className="p-4 space-y-3">
          {lista.items.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No hay ítems en esta lista
            </div>
          ) : (
            <div className="space-y-3">
              {lista.items.map((item: any) => {
                const producto = (alimentosData as Alimento[]).find((p: Alimento) => p.id === item.productoId);
                if (!producto) return null;
                
                return (
                  <div 
                    key={item.id}
                    className={`bg-white rounded-xl shadow p-4 flex items-center justify-between ${item.agregado ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleItemAgregado(lista.id, item.id)}
                        className={`w-6 h-6 rounded-full border-2 ${item.agregado ? 'bg-[#FA8603] border-[#FA8603]' : 'border-gray-300'}`}
                      >
                        {item.agregado && (
                          <span className="text-white flex items-center justify-center">✓</span>
                        )}
                      </button>
                      <div>
                        <p className={`font-medium ${item.agregado ? 'line-through' : ''}`}>
                          {producto.nombre}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.cantidad} x {formatCurrency(item.precioUnitario)} = {formatCurrency(item.cantidad * item.precioUnitario)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        eliminarItemDeLista(lista.id, item.id);
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      🗑️
                    </button>
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

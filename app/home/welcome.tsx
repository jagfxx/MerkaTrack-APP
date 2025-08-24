import React, { useState } from "react";
import alimentosData from "../components/alimentos.json";

type Alimento = {
  id: number;
  nombre: string;
  icon: string;
};

type InventarioItem = Alimento & { cantidad: number };

export function Welcome() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAlimento, setSelectedAlimento] = useState<Alimento | null>(null);
  const [cantidad, setCantidad] = useState("");
  const [inventario, setInventario] = useState<InventarioItem[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [animatingItem, setAnimatingItem] = useState<number | null>(null); // Estado para la animación

  // Filtrar inventario según búsqueda
  const inventarioFiltrado = inventario.filter(item =>
    item.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleAgregar = () => {
    if (!selectedAlimento) {
      setError("Debe seleccionar un alimento.");
      return;
    }
    if (!cantidad || Number(cantidad) <= 0) {
      setError("Debe ingresar la cantidad.");
      return;
    }
    const idx = inventario.findIndex(item => item.id === selectedAlimento.id);
    if (idx !== -1) {
      // Si ya existe, suma la cantidad
      const nuevoInventario = [...inventario];
      nuevoInventario[idx].cantidad += Number(cantidad);
      setInventario(nuevoInventario);
    } else {
      // Si no existe, agrega nuevo
      setInventario([
        ...inventario,
        { ...selectedAlimento, cantidad: Number(cantidad) }
      ]);
    }
    setModalOpen(false);
    setSelectedAlimento(null);
    setCantidad("");
    setError("");
  };

  const handleDoubleClick = (itemId: number) => {
    setAnimatingItem(itemId); // Activar animación
    setTimeout(() => setAnimatingItem(null), 500); // Desactivar animación después de 500ms

    setInventario(prevInventario => {
      const idx = prevInventario.findIndex(i => i.id === itemId);
      if (idx === -1) return prevInventario;

      const alimento = prevInventario[idx];
      if (alimento.cantidad > 1) {
        // Reducir cantidad si es mayor a 1
        const nuevoInventario = [...prevInventario];
        nuevoInventario[idx] = { ...alimento, cantidad: alimento.cantidad - 1 };
        return nuevoInventario;
      } else if (alimento.cantidad === 1) {
        // Si la cantidad es 1, reducir a 0
        const nuevoInventario = [...prevInventario];
        nuevoInventario[idx] = { ...alimento, cantidad: 0 };
        return nuevoInventario;
      } else if (alimento.cantidad === 0) {
        // Si la cantidad ya es 0, eliminar del inventario
        return prevInventario.filter(i => i.id !== itemId);
      }
      return prevInventario;
    });
  };

  return (
    <div className="flex flex-col bg-white w-full h-full">
      <h1 className="text-2xl font-bold text-center p-4 text-[#FA8603]">Inventario</h1>
      <div className="flex flex-col justify-start items-center bg-[#FA8603] flex-1 py-8">
        {/* Buscador */}
        <div className="flex items-center bg-white rounded-full px-4 py-2 mb-4 w-full max-w-xs">
          <span className="text-xl text-gray-400 mr-2">🔍</span>
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent outline-none flex-1 text-black"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <button
          className="bg-white rounded-full px-8 py-3 font-bold text-lg text-[#FA8603] shadow-md mb-8"
          onClick={() => {
            setModalOpen(true);
            setError("");
          }}
        >
          AGREGAR +
        </button>

        {/* Recuadro fondo blanco */}
        <div className="bg-white rounded-xl p-4 shadow w-full max-w-xs mx-auto">
          {inventarioFiltrado.length === 0 && (
            <p className="text-gray-500">No hay alimentos agregados.</p>
          )}
          {/* Contenedor desplazable para los alimentos */}
          <div
            className="flex flex-col gap-4 inventario-container"
            style={{
              maxHeight: "320px",
              overflowY: animatingItem ? "hidden" : "auto", // Cambiar a "hidden" durante la animación
            }}
          >
            {inventarioFiltrado.map((item) => (
              <div
                key={item.id}
                className={`bg-[#FA8603] rounded-2xl px-6 py-4 flex items-center gap-4 ${
                  animatingItem === item.id ? "animate-scale" : ""
                }`}
                onDoubleClick={() => handleDoubleClick(item.id)}
              >
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <div className="text-white text-md">{item.nombre}</div>
                  <div className="font-bold text-white text-xl">x{item.cantidad}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-10 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-[24px] p-8 w-[340px] h-[340px] shadow-xl flex flex-col justify-center items-center">
            {/* Título centrado y tamaño ajustado */}
            <h3 className="text-xl font-bold mb-6 text-[#FA8603] text-center">Agregar alimento</h3>
            <div className="mb-4 w-full">
              <label className="block mb-1 font-semibold text-[#FA8603]">Selecciona alimento:</label>
              <select
                className="w-full p-2 rounded-lg border border-[#FA8603] text-[#FA8603] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FA8603]"
                value={selectedAlimento?.id || ""}
                onChange={e => {
                  const found = alimentosData.find(
                    (a: Alimento) => a.id === Number(e.target.value)
                  );
                  setSelectedAlimento(found || null);
                  setError("");
                }}
              >
                <option value="">-- Selecciona --</option>
                {alimentosData.map((alimento: Alimento) => (
                  <option key={alimento.id} value={alimento.id}>
                    {alimento.icon} {alimento.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4 w-full">
              <label className="block mb-1 font-semibold text-[#FA8603]">Cantidad:</label>
              <input
                type="number"
                min={1}
                className="w-full p-2 rounded-lg border border-[#FA8603] text-[#FA8603] font-semibold focus:outline-none focus:ring-2 focus:ring-[#FA8603]"
                value={cantidad}
                onChange={e => {
                  setCantidad(e.target.value);
                  setError("");
                }}
              />
            </div>
            {error && (
              <div className="text-red-600 font-semibold mb-4 text-center">{error}</div>
            )}
            <div className="flex gap-2 mt-2">
              <button
                className="bg-white rounded-full px-6 py-2 font-bold text-[#FA8603] border border-[#FA8603]"
                onClick={handleAgregar}
              >
                AGREGAR
              </button>
              <button
                className="bg-white rounded-full px-6 py-2 font-bold text-[#FA8603] border border-[#FA8603]"
                onClick={() => {
                  setModalOpen(false);
                  setError("");
                }}
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

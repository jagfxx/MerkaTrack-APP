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

  return (
    <div className="flex flex-col bg-white w-full h-full">
      <h1 className="text-2xl font-bold text-center p-4 text-[#FA8603]">Inventario</h1>
      <div className="flex flex-col justify-start items-center bg-[#FA8603] flex-1 py-8">
        <button
          className="bg-white rounded-full px-8 py-3 font-bold text-lg text-[#FA8603] shadow-md mb-8"
          onClick={() => {
            setModalOpen(true);
            setError("");
          }}
        >
          AGREGAR +
        </button>

        {/* Eliminado el fondo blanco */}
        <h2 className="text-xl font-bold mb-4 text-[#FA8603]">Inventario</h2>
        {inventario.length === 0 && (
          <p className="text-gray-500">No hay alimentos agregados.</p>
        )}
        {/* Contenedor desplazable para los alimentos */}
        <div
          className="flex flex-col gap-4 w-full max-w-xs mx-auto"
          style={{
            margin: "0 16px",
            maxHeight: "320px", // Ajusta la altura según tu diseño
            overflowY: "auto"
          }}
        >
          {inventario.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl px-6 py-4 flex items-center gap-4 border border-[#FA8603]"
            >
              <span className="text-3xl text-[#FA8603]">{item.icon}</span>
              <div>
                <div className="text-[#FA8603] text-md">{item.nombre}</div>
                <div className="font-bold text-[#FA8603] text-xl">x{item.cantidad}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-30 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-2xl p-8 min-w-[320px] shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-[#FA8603]">Agregar alimento</h3>
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Selecciona alimento:</label>
              <select
                className="w-full p-2 rounded-lg border"
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
            <div className="mb-4">
              <label className="block mb-1 font-semibold">Cantidad:</label>
              <input
                type="number"
                min={1}
                className="w-full p-2 rounded-lg border"
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
            <div className="flex gap-2">
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

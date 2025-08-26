import { useInventario } from "../context/InventarioContext";
import { useLista, ListaProvider } from "../context/ListaContext";
import React, { useState } from "react";
import alimentosData from "../components/alimentos.json";

type Alimento = {
  id: number;
  nombre: string;
  icon: string;
};

type InventarioItem = Alimento & { cantidad: number };

export default function Lists() {
  const { agregarAlimento } = useInventario();
  const [removingItem, setRemovingItem] = useState<number | null>(null); // Animación de eliminación
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAlimento, setSelectedAlimento] = useState<Alimento | null>(null);
  const [cantidad, setCantidad] = useState("");
  // Eliminado: const [inventario, setInventario] = useState<InventarioItem[]>([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Usar contexto independiente para lista
  const { lista, setLista, agregarAlimentoLista } = useLista();
  const listaFiltrada = lista.filter(item =>
    item.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const handleAgregar = () => {
    if (!selectedAlimento || selectedAlimento.id === undefined) {
      setError("Debe seleccionar un alimento.");
      return;
    }
    const { id, nombre, icon } = selectedAlimento;
    agregarAlimentoLista({
      id,
      nombre,
      icon,
      cantidad: Number(cantidad)
    });
    setModalOpen(false);
    setSelectedAlimento(null);
    setCantidad("");
    setError("");
  };

  const handleCantidadChange = (id: number, nuevaCantidad: string) => {
    setLista((lista: InventarioItem[]) =>
      lista.map((item: InventarioItem) =>
        item.id === id
          ? {
              ...item,
              cantidad: nuevaCantidad === "" ? 0 : Number(nuevaCantidad),
            }
          : item
      )
    );
  };

  const handleBlur = (id: number) => {
    setLista((lista: InventarioItem[]) =>
      lista.map((item: InventarioItem) =>
        item.id === id
          ? { ...item, cantidad: item.cantidad === 0 ? 1 : item.cantidad }
          : item
      )
    );
  };

  return (
    <div className="flex flex-col bg-white w-full h-full">
      <h1 className="text-2xl font-bold text-center p-4 text-[#FA8603]">List</h1>
      <div className="flex flex-col justify-start items-center bg-[#FA8603] flex-1 py-8">
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
        <div className="bg-white rounded-xl p-4 shadow w-full max-w-xs mx-auto">
          {listaFiltrada.length === 0 && (
            <p className="text-gray-500">No hay alimentos agregados.</p>
          )}
          <div
            className="flex flex-col gap-4 inventario-container"
            style={{
              maxHeight: "320px",
              overflowY: "auto"
            }}
          >
            {listaFiltrada.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between bg-[#FA8603] rounded-2xl px-6 py-4 ${removingItem === item.id ? "animate-remove" : ""}`}
                onDoubleClick={() => {
                  setRemovingItem(item.id);
                  const cantidadActual = item.cantidad;
                  setTimeout(() => {
                    setLista((prev) => prev.filter(i => i.id !== item.id));
                    agregarAlimento({
                      id: item.id,
                      nombre: item.nombre,
                      icon: item.icon,
                      cantidad: cantidadActual
                    });
                    setRemovingItem(null);
                  }, 400);
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl text-white">{item.icon}</span>
                  <span className="text-white text-lg">{item.nombre}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white rounded-md px-4 py-2 flex items-center justify-center">
                    <span className="font-bold text-[#222] text-lg">X</span>
                    <input
                      type="number"
                      min={1}
                      value={item.cantidad === 0 ? "" : item.cantidad}
                      onChange={(e) => handleCantidadChange(item.id, e.target.value)}
                      onBlur={() => handleBlur(item.id)}
                      className="w-8 text-center font-bold text-[#222] bg-transparent border-none outline-none ml-1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {modalOpen && (
          <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-10 flex items-center justify-center z-50">
            <div className="bg-white rounded-[24px] p-8 w-[340px] h-[340px] shadow-xl flex flex-col justify-center items-center">
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
    </div>
  );
}
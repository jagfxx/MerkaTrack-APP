import { useListas } from "../context/ListasContext";
import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Lists() {
  const navigate = useNavigate();
  const { listas, crearLista } = useListas();
  const [nuevaListaNombre, setNuevaListaNombre] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const handleCrearLista = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevaListaNombre.trim()) return;
    
    // Create the new list and get its ID
    const listaId = crearLista(nuevaListaNombre);
    setNuevaListaNombre('');
    setMostrarModal(false);
    
    // Use setTimeout to ensure state is updated before navigation
    setTimeout(() => {
      navigate(`/lists/${listaId}`);
    }, 0);
  };

  return (
    <div className="flex flex-col bg-white w-full h-full">
      <h1 className="text-2xl font-bold text-center p-4 text-[#FA8603]">Mis Listas</h1>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setMostrarModal(true)}
            className="w-full bg-[#FA8603] text-white py-3 rounded-xl font-bold mb-6"
          >
            Crear nueva lista
          </button>

          <div className="space-y-4">
            {listas.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay listas creadas. Crea tu primera lista para comenzar.
              </p>
            ) : (
              listas.map((lista) => (
                <div
                  key={lista.id}
                  onClick={() => navigate(`/lists/${lista.id}`)}
                  className="bg-white rounded-xl shadow p-4 border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">{lista.nombre}</h3>
                    <span className="text-gray-500 text-sm">
                      {new Date(lista.fechaCreacion).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-[#FA8603] h-2.5 rounded-full"
                        style={{
                          width: `${(lista.items.filter(i => i.agregado).length / Math.max(lista.items.length, 1)) * 100}%`
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>{lista.items.filter(i => i.agregado).length} de {lista.items.length} completados</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nueva Lista</h2>
            <form onSubmit={handleCrearLista}>
              <input
                type="text"
                value={nuevaListaNombre}
                onChange={(e) => setNuevaListaNombre(e.target.value)}
                placeholder="Nombre de la lista"
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#FA8603]"
                autoFocus
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FA8603] text-white rounded-lg hover:bg-[#e67a00] disabled:opacity-50"
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

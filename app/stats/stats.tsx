import { useInventario } from "../context/InventarioContext";
import { useListas } from "../context/ListasContext";
import React, { useEffect, useState } from "react";

function getMostFrequent(arr: any[], key: string) {
  if (arr.length === 0) return null;
  const freq: Record<string, number> = {};
  arr.forEach(item => {
    freq[item[key]] = (freq[item[key]] || 0) + item.cantidad;
  });
  let maxKey = arr[0][key];
  let maxVal = freq[maxKey];
  for (const k in freq) {
    if (freq[k] > maxVal) {
      maxKey = k;
      maxVal = freq[k];
    }
  }
  return arr.find(item => item[key] === maxKey);
}

export default function Stats() {
  const { inventario } = useInventario();
  const { listas } = useListas();
  const [historialInventario, setHistorialInventario] = useState<any[]>([]);
  const [historialLista, setHistorialLista] = useState<any[]>([]);
  
  // Get all items from all lists
  const allListItems = listas.flatMap(lista => lista.items);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const histInv = localStorage.getItem("historialAlimentos");
      setHistorialInventario(histInv ? JSON.parse(histInv).reverse() : []);
      const histLis = localStorage.getItem("historialLista");
      setHistorialLista(histLis ? JSON.parse(histLis).reverse() : []);
    }
  }, []);

  const totalInventario = inventario.reduce((acc: number, item: any) => acc + item.cantidad, 0);
  const totalLista = allListItems.reduce((acc: number, item: any) => acc + item.cantidad, 0);
  const masInventario = getMostFrequent(inventario, "nombre");
  const masLista = getMostFrequent(allListItems, "nombre");

  return (
    <div className="flex flex-col bg-white w-full h-full">
      <h1 className="text-2xl font-bold text-center p-4 text-[#FA8603]">Estadísticas</h1>
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center bg-[#FA8603] flex-1 py-8">
        <div className="bg-white rounded-xl shadow p-6 w-full max-w-xs flex flex-col items-center mb-4">
          <span className="text-[#FA8603] font-bold text-lg mb-2">Total en Inventario</span>
          <span className="text-3xl font-bold text-[#FA8603]">{totalInventario}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 w-full max-w-xs flex flex-col items-center mb-4">
          <span className="text-[#FA8603] font-bold text-lg mb-2">Total en Lista</span>
          <span className="text-3xl font-bold text-[#FA8603]">{totalLista}</span>
        </div>
        <div className="bg-white rounded-xl shadow p-6 w-full max-w-xs flex flex-col items-center mb-4">
          <span className="text-[#FA8603] font-bold text-lg mb-2">Más agregado al Inventario</span>
          {masInventario ? (
            <>
              <span className="text-2xl">{masInventario.icon}</span>
              <span className="font-bold text-[#FA8603]">{masInventario.nombre}</span>
              <span className="text-[#FA8603]">Cantidad: {masInventario.cantidad}</span>
            </>
          ) : <span className="text-gray-400">Sin datos</span>}
        </div>
        <div className="bg-white rounded-xl shadow p-6 w-full max-w-xs flex flex-col items-center mb-4">
          <span className="text-[#FA8603] font-bold text-lg mb-2">Más agregado a la Lista</span>
          {masLista ? (
            <>
              <span className="text-2xl">{masLista.icon}</span>
              <span className="font-bold text-[#FA8603]">{masLista.nombre}</span>
              <span className="text-[#FA8603]">Cantidad: {masLista.cantidad}</span>
            </>
          ) : <span className="text-gray-400">Sin datos</span>}
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6 justify-center items-start bg-white px-4 py-8">
        <div className="w-full max-w-lg">
          <h2 className="text-xl font-bold text-[#FA8603] mb-2">Historial Inventario</h2>
          <div className="bg-[#FA8603] rounded-xl p-4 shadow text-white max-h-56 overflow-y-auto">
            {historialInventario.length === 0 && <span>No hay movimientos recientes.</span>}
            {historialInventario.slice(0, 8).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-white/30 py-1 last:border-b-0">
                <span className="text-lg">{item.icon} {item.nombre}</span>
                <span className="font-bold">+{item.cantidad}</span>
                <span className="text-xs">{new Date(item.fecha).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full max-w-lg">
          <h2 className="text-xl font-bold text-[#FA8603] mb-2">Historial Lista</h2>
          <div className="bg-[#FA8603] rounded-xl p-4 shadow text-white max-h-56 overflow-y-auto">
            {historialLista.length === 0 && <span>No hay movimientos recientes.</span>}
            {historialLista.slice(0, 8).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-white/30 py-1 last:border-b-0">
                <span className="text-lg">{item.icon} {item.nombre}</span>
                <span className="font-bold">+{item.cantidad}</span>
                <span className="text-xs">{new Date(item.fecha).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
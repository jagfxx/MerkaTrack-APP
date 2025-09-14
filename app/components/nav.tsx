import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaList, FaChartBar, FaHome, FaMoneyBillWave, FaCog } from "react-icons/fa";

export function BottomNav() {
  const location = useLocation();

  // Definimos el orden de rutas para el indicador
  const routes = ["/lists", "/stats", "/", "/expenses", "/settings"];

  // Estado para el índice activo
  const [activeIndex, setActiveIndex] = useState(0);

  // Sincronizar índice activo con la ruta
  useEffect(() => {
    const index = routes.indexOf(location.pathname);
    setActiveIndex(index >= 0 ? index : 0);
  }, [location.pathname]);

  const icons = [
    <FaList className="text-2xl" />,
    <FaChartBar className="text-2xl" />,
    <FaHome className="text-2xl" />,
    <FaMoneyBillWave className="text-2xl" />,
    <FaCog className="text-2xl" />
  ];
  const labels = ["Listas", "Estadísticas", "Inicio", "Gastos", "Ajustes"];

  return (
    <div className="h-16 w-full bg-white/95 backdrop-blur-sm">
      <div className="relative grid h-full grid-cols-5 max-w-md mx-auto">
        {/* Indicador animado */}
        <div
          className="absolute top-0 left-0 h-1 w-1/5 bg-[#FA8603] transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        />

        {/* Botones */}
        {routes.map((path, index) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `
              flex flex-col justify-center items-center h-full w-full
              ${isActive ? 'text-[#FA8603]' : 'text-gray-400'}
              active:bg-gray-100 transition-colors duration-200
            `}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full">
              {React.cloneElement(icons[index], {
                className: `text-2xl ${activeIndex === index ? 'opacity-100' : 'opacity-70'}`
              })}
            </div>
            <span className="text-xs mt-0.5">{labels[index]}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

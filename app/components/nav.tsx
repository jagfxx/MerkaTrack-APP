import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router";
import list from "./icons-02.svg";
import stats from "./icons-03.svg";
import home from "./icons-04.svg";
import expenses from "./icons-05.svg";
import settings from "./icons-06.svg";

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

  const icons = [list, stats, home, expenses, settings];
  const labels = ["List", "Stats", "Home", "Expenses", "Settings"];

  return (
    <div className="relative grid grid-cols-5 w-full bg-white/90 border-t border-[#FA8603]">
      {/* Indicador animado */}
      <div
        className="absolute top-0 left-0 h-full w-1/5 bg-[#FFE0C2] rounded-md transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />

      {/* Botones */}
      {routes.map((path, index) => (
        <NavLink
          key={path}
          to={path}
          className="flex flex-col justify-center items-center z-10 p-1"
        >
          <img className="w-[35px]" src={icons[index]} alt={labels[index]} />
          <span className="text-[#FA8603]  ">{labels[index]}</span>
        </NavLink>
      ))}
    </div>
  );
}

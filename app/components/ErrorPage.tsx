import React from "react";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <h1 className="text-2xl font-bold mb-2 text-red-600">¡Error inesperado!</h1>
      <p className="text-lg mb-4">La página no existe o ocurrió un error.</p>
      <p className="text-gray-500">Por favor, verifica la URL o navega usando el menú inferior.</p>
    </div>
  );
}

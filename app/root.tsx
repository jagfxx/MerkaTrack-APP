import React from "react";
import { InventarioProvider } from "./context/InventarioContext";
import { GastosProvider } from "./context/GastosContext";
import { SettingsProvider } from "./context/SettingsContext";
import { ListasProvider } from "./context/ListasContext";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import logoFull from "./mercatrack-color.svg";
import { BottomNav } from "./components/nav";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col h-screen w-full overflow-hidden bg-gray-50">
        {/* Fixed Header */}
        <header className="flex-shrink-0 bg-white border-b border-[#FA8603] shadow-sm">
          <div className="flex justify-center items-center p-4">
            <img className="w-[180px] md:w-[200px]" src={logoFull} alt="MerkaTrack" />
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="max-w-4xl mx-auto w-full p-4">
            {children}
          </div>
        </main>

        {/* Fixed Bottom Navigation */}
        <div className="flex-shrink-0 bg-white border-t border-[#FA8603] w-full">
          <BottomNav />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <React.StrictMode>
      <SettingsProvider>
        <GastosProvider>
          <InventarioProvider>
            <ListasProvider>
              <Outlet />
            </ListasProvider>
          </InventarioProvider>
        </GastosProvider>
      </SettingsProvider>
    </React.StrictMode>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

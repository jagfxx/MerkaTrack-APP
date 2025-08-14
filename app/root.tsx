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
import logoWhite from "./mercatrack-white.svg";
import logoFull from "./mercatrack-color.svg";
import { Link } from "react-router";

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
      <body className="flex flex-col justify-center items-center   h-[96vh] overflow-hidden">
      <nav className="flex justify-center align-center bg-white border-b border-[#FA8603] p-4 h-[10%] w-[100%] shadow-sm">
        <img className="w-[200px]" src={logoFull} alt="MerkaTrack" />
      </nav>
        {children}
        <ScrollRestoration />
        <Scripts />
        <div className="grid grid-cols-5 justify-items-center align-center h-[70px] w-[100%] bg-white/90 border-t border-[#FA8603] mt-auto overflow-hidden" >
        <Link to="/lists" className="flex col-span-1 overflow-hidden border-r border-[#FA8603] w-[100%] h-[100%] text-center justify-center items-center">List</Link>
        <Link to="/stats" className="flex col-span-1 overflow-hidden border-r border-[#FA8603] w-[100%] h-[100%] text-center justify-center items-center">Stats</Link>
        <Link to="/" className="flex col-span-1 overflow-hidden border-r border-[#FA8603] w-[100%] h-[100%] text-center justify-center items-center">Home</Link>
        <Link to="/expenses" className="flex col-span-1 overflow-hidden border-r border-[#FA8603] w-[100%] h-[100%] text-center justify-center items-center">Expenses</Link>
        <Link to="/settings" className="flex col-span-1 overflow-hidden border-r border-[#FA8603] w-[100%] h-[100%] text-center justify-center items-center">Settings</Link>
      </div>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
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

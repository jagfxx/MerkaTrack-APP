import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Welcome } from "./home/welcome";
import Expenses from "./expenses/expenses";
import Lists from "./lists/lists";
import { BottomNav } from "./components/nav";
import logoFull from "./mercatrack-color.svg";
import { SettingsProvider } from "./context/SettingsContext";
import { GastosProvider } from "./context/GastosContext";
import { InventarioProvider } from "./context/InventarioContext";
import { ListasProvider } from "./context/ListasContext";
import Settings from "./settings/settings";
import ListsPage from "./lists/page";
import Stats from "./stats/stats";
import ListaDetallePage from "./lists/[id]/page";
import ErrorPage from "./components/ErrorPage";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-50">
      <header className="flex-shrink-0 bg-white border-b border-[#FA8603] shadow-sm">
        <div className="flex justify-center items-center p-4">
          <img className="w-[180px] md:w-[200px]" src={logoFull} alt="MerkaTrack" />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto w-full">
        <div className="max-w-4xl mx-auto w-full p-4">{children}</div>
      </main>
      <div className="flex-shrink-0 bg-white border-t border-[#FA8603] w-full">
        <BottomNav />
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <Welcome />
      </MainLayout>
    ),
    errorElement: <MainLayout><ErrorPage /></MainLayout>,
  },
  {
    path: "/expenses",
    element: (
      <MainLayout>
        <Expenses />
      </MainLayout>
    ),
    errorElement: <MainLayout><ErrorPage /></MainLayout>,
  },
  {
    path: "/lists",
    element: (
      <MainLayout>
        <ListsPage />
      </MainLayout>
    ),
    errorElement: <MainLayout><ErrorPage /></MainLayout>,
  },
  {
    path: "/lists/:id",
    element: (
      <MainLayout>
        <ListaDetallePage />
      </MainLayout>
    ),
    errorElement: <MainLayout><ErrorPage /></MainLayout>,
  },
  {
    path: "/settings",
    element: (
      <MainLayout>
        <Settings />
      </MainLayout>
    ),
    errorElement: <MainLayout><ErrorPage /></MainLayout>,
  },
  {
    path: "/stats",
    element: (
      <MainLayout>
        <Stats />
      </MainLayout>
    ),
    errorElement: <MainLayout><ErrorPage /></MainLayout>,
  },
  // Add other routes here
]);

export default function App() {
  return (
    <SettingsProvider>
      <GastosProvider>
        <InventarioProvider>
          <ListasProvider>
            <RouterProvider router={router} />
          </ListasProvider>
        </InventarioProvider>
      </GastosProvider>
    </SettingsProvider>
  );
}

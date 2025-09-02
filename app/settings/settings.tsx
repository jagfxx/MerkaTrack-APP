import { useSettings } from '../context/SettingsContext';

export default function Settings() {
  const {
    theme,
    currency,
    notifications,
    toggleTheme,
    setCurrency,
    toggleNotifications
  } = useSettings();

  return (
    <div className="flex flex-col h-full">
      {/* Encabezado */}
      <div className="bg-white p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-[#FA8603]">Configuración</h1>
      </div>
      
      {/* Contenido */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {/* Tema */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-800">Tema</h3>
                <p className="text-sm text-gray-500">
                  {theme === 'light' ? 'Claro' : 'Oscuro'}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${theme === 'dark' ? 'bg-[#FA8603]' : 'bg-gray-200'}`}
              >
                <span
                  className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </button>
            </div>
          </div>

          {/* Moneda */}
          <div className="bg-white rounded-xl shadow p-4">
            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Moneda
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FA8603] focus:border-transparent"
              >
                <option value="COP">COP - Peso colombiano</option>
                <option value="USD">USD - Dólar estadounidense</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - Libra esterlina</option>
              </select>
            </div>
          </div>

          {/* Notificaciones */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-800">Notificaciones</h3>
                <p className="text-sm text-gray-500">
                  {notifications ? 'Activadas' : 'Desactivadas'}
                </p>
              </div>
              <button
                onClick={toggleNotifications}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${notifications ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                <span
                  className={`${notifications ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </button>
            </div>
          </div>

          {/* Información de la app */}
          <div className="bg-white rounded-xl shadow p-6 text-center">
            <h3 className="font-medium text-gray-800 mb-1">MerkaTrack App</h3>
            <p className="text-sm text-gray-500">
              Versión 1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
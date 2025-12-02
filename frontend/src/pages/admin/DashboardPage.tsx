export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Tableau de Bord Admin
          </h1>
          <p className="text-gray-600 mb-8">
            Page en développement - Statistiques et gestion pour SUPER_ADMIN
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-primary-600 text-xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Utilisateurs</h3>
              <p className="text-2xl font-bold text-primary-600">1,234</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-green-600 text-xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Présences</h3>
              <p className="text-2xl font-bold text-green-600">5,678</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-blue-600 text-xl">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Formulaires</h3>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
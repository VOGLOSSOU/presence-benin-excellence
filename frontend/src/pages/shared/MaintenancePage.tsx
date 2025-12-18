import { Wrench } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wrench className="w-6 h-6 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Maintenance en cours</h1>
          <p className="text-gray-600 mb-8">
            Le système est temporairement indisponible pour maintenance. Veuillez réessayer plus tard.
          </p>
          <p className="text-sm text-gray-500">
            Nous nous excusons pour la gêne occasionnée.
          </p>
        </div>
      </div>
    </div>
  );
}
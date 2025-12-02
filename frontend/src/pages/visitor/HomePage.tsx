import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, UserPlus, CheckCircle, Users, Calendar, Shield } from 'lucide-react';
import VisitorLayout from '@/layouts/VisitorLayout';

export default function HomePage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <VisitorLayout>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Form Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Enregistrer ma présence
              </h2>
              <p className="text-gray-600">
                Entrez votre identifiant unique pour marquer votre présence
              </p>
            </div>

            {/* Input Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Identifiant unique (UUID)
                </label>
                <input
                  type="text"
                  placeholder="Ex: BE-XXXXXX"
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-primary-600 focus:ring-4 focus:ring-primary-100 outline-none transition-all"
                />
              </div>

              <button className="w-full bg-primary-600 text-white font-semibold py-4 rounded-xl hover:bg-primary-700 transform hover:scale-[1.02] transition-all shadow-lg">
                Valider ma présence
              </button>
            </div>
          </div>

          {/* First Visit Notice */}
          <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <UserPlus className="w-6 h-6 text-blue-600 mt-1" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Première visite ?
                </h3>
                <p className="text-gray-700 mb-4">
                  Si c'est votre première fois à BENIN EXCELLENCE, vous devez d'abord vous enregistrer pour obtenir votre identifiant unique.
                </p>
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                >
                  S'enregistrer →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </VisitorLayout>
  );
}
import React, { useState } from 'react';
import { Clock, UserPlus, LogIn, Shield, Zap, Users } from 'lucide-react';

export default function BeninExcellenceHome() {
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">BE</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">BENIN EXCELLENCE</h1>
                <p className="text-sm text-gray-500">Système de présence numérique</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{formatTime(currentTime)}</div>
              <div className="text-sm text-gray-600 capitalize">{formatDate(currentTime)}</div>
            </div>
          </div>
        </div>
      </header>

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
                  placeholder="Ex: BE-A658VGT"
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                />
              </div>

              <button className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl hover:bg-blue-700 transform hover:scale-[1.02] transition-all shadow-lg">
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
                <button className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                  S'enregistrer →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © 2024 BENIN EXCELLENCE - Système de présence numérique
          </p>
        </div>
      </footer>
    </div>
  );
}
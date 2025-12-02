import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Home, Calendar, User } from 'lucide-react';
import VisitorLayout from '@/layouts/VisitorLayout';

export default function PresencePage() {
  // Simulation de données
  const presenceData = {
    type: 'ARRIVAL',
    timestamp: new Date(),
    user: {
      uuid: 'BE-A658VGT',
      firstName: 'Nathan',
      lastName: 'VOGLOSSOU'
    },
    form: {
      name: 'Formulaire Étudiant Cotonou'
    }
  };

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
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Présence enregistrée avec succès !
          </h1>
          <p className="text-xl text-gray-600">
            Votre arrivée a été validée dans notre système
          </p>
        </div>

        {/* Presence Details Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-primary-600" />
                  Informations personnelles
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nom:</span>
                    <span className="font-semibold">{presenceData.user.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prénoms:</span>
                    <span className="font-semibold">{presenceData.user.firstName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">UUID:</span>
                    <span className="font-mono font-semibold text-primary-600">{presenceData.user.uuid}</span>
                  </div>
                </div>
              </div>

              {/* Form Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-primary-600" />
                  Formulaire utilisé
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-semibold text-blue-900">{presenceData.form.name}</p>
                  <p className="text-sm text-blue-700 mt-1">Formulaire actif pour les étudiants</p>
                </div>
              </div>
            </div>

            {/* Presence Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary-600" />
                  Détails de la présence
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Type:</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                      {presenceData.type === 'ARRIVAL' ? 'Arrivée' : 'Départ'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">{formatDate(presenceData.timestamp)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heure:</span>
                    <span className="font-semibold">{formatTime(presenceData.timestamp)}</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Prochaines étapes
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-gray-600">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold">1</div>
                    <span>À la fin de votre visite, marquez votre départ</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold">2</div>
                    <span>Utilisez le même UUID pour tous vos enregistrements</span>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-600">
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold">3</div>
                    <span>Consultez votre historique à tout moment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-md"
          >
            <Home className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Link>
          <button
            onClick={() => alert('Historique simulé: 3 présences cette semaine')}
            className="inline-flex items-center px-8 py-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Voir mon historique
          </button>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">ℹ️</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">
                Conseils pour une utilisation optimale
              </h4>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Conservez précieusement votre UUID pour vos prochaines visites</li>
                <li>• Un UUID = Une personne (pas de partage entre visiteurs)</li>
                <li>• Les présences sont automatiquement liées à votre profil</li>
                <li>• Contactez l'administration en cas de problème avec votre UUID</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </VisitorLayout>
  );
}
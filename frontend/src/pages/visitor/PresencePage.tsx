import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Clock, Home, User } from 'lucide-react';
import VisitorLayout from '@/layouts/VisitorLayout';

export default function PresencePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [presenceData, setPresenceData] = useState<any>(null);
  const [organization, setOrganization] = useState<any>(null);

  // Charger les données au montage du composant
  useEffect(() => {
    // Récupérer les données depuis l'état de navigation ou sessionStorage
    let { presenceData: presenceResult, organization: orgResult } = location.state || {};

    // Si pas de données dans location.state, essayer sessionStorage
    if (!presenceResult) {
      const storedResult = sessionStorage.getItem('presenceResult');
      const storedOrg = sessionStorage.getItem('presenceOrganization');

      if (storedResult) {
        presenceResult = JSON.parse(storedResult);
        orgResult = storedOrg ? JSON.parse(storedOrg) : null;

        // Nettoyer sessionStorage après récupération
        sessionStorage.removeItem('presenceResult');
        sessionStorage.removeItem('presenceOrganization');
      }
    }

    if (presenceResult) {
      setPresenceData(presenceResult);
    }
    if (orgResult) {
      setOrganization(orgResult);
    }
  }, [location.state]);

  // Formater les données de présence quand elles sont disponibles
  const formattedPresenceData = presenceData ? {
    type: presenceData.presence.presenceType,
    timestamp: new Date(presenceData.presence.timestamp),
    user: presenceData.presence.user ? {
      uuid: presenceData.presence.user.uuidCode,
      firstName: presenceData.presence.user.firstName,
      lastName: presenceData.presence.user.lastName,
      title: presenceData.presence.user.title,
      institution: presenceData.presence.user.institution,
      phone: presenceData.presence.user.phone,
      email: presenceData.presence.user.email
    } : {
      uuid: 'N/A',
      firstName: 'Utilisateur',
      lastName: 'Inconnu',
      title: 'N/A',
      institution: undefined,
      phone: undefined,
      email: undefined
    },
    form: presenceData.presence.formTemplate ? {
      name: presenceData.presence.formTemplate.name,
      type: presenceData.presence.formTemplate.type
    } : {
      name: 'Formulaire inconnu',
      type: undefined
    }
  } : {
    type: 'ARRIVAL',
    timestamp: new Date(),
    user: {
      uuid: 'BE-XXXXXX',
      firstName: 'Utilisateur',
      lastName: 'Test',
      title: 'N/A',
      institution: undefined,
      phone: undefined,
      email: undefined
    },
    form: {
      name: 'Formulaire de test',
      type: undefined
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
            Votre {formattedPresenceData.type === 'ARRIVAL' ? 'arrivée' : formattedPresenceData.type === 'DEPARTURE' ? 'départ' : 'présence'} a été validée dans notre système
          </p>
          {organization && (
            <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <div className="flex items-center justify-center space-x-3">
                <User className="w-6 h-6 text-blue-600" />
                <div className="text-center">
                  <p className="text-sm text-blue-700 font-medium">Organisation</p>
                  <p className="text-lg font-bold text-blue-900">{organization.name}</p>
                </div>
              </div>
            </div>
          )}
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
                    <span className="font-semibold">{formattedPresenceData.user.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prénoms:</span>
                    <span className="font-semibold">{formattedPresenceData.user.firstName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Titre:</span>
                    <span className="font-semibold">{formattedPresenceData.user.title || 'N/A'}</span>
                  </div>
                  {formattedPresenceData.user.institution && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Institution:</span>
                      <span className="font-semibold">{formattedPresenceData.user.institution}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">UUID:</span>
                    <span className="font-mono font-semibold text-primary-600">{formattedPresenceData.user.uuid}</span>
                  </div>
                </div>
              </div>

              {/* Organization Info */}
              {organization && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-primary-600" />
                    Organisation
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="font-semibold text-blue-900">{organization.name}</p>
                    <p className="text-sm text-blue-700 mt-1">Formulaire utilisé: {formattedPresenceData.form.name}</p>
                  </div>
                </div>
              )}
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
                      {formattedPresenceData.type === 'ARRIVAL' ? 'Arrivée' :
                       formattedPresenceData.type === 'DEPARTURE' ? 'Départ' :
                       formattedPresenceData.type === 'SIMPLE' ? 'Présence simple' :
                       formattedPresenceData.type || 'Inconnu'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-semibold">{formatDate(formattedPresenceData.timestamp)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heure:</span>
                    <span className="font-semibold">{formatTime(formattedPresenceData.timestamp)}</span>
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
        <div className="flex justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-md"
          >
            <Home className="w-5 h-5 mr-2" />
            Retour à la page précédente
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
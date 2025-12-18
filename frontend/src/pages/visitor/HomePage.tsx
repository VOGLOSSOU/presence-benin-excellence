import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Clock, UserPlus, CheckCircle, Users, Calendar, Shield, FileText, ArrowRight } from 'lucide-react';
import VisitorLayout from '@/layouts/VisitorLayout';
import { setupService, formService } from '@/services';

export default function HomePage() {
  const navigate = useNavigate();
  const { orgCode } = useParams<{ orgCode: string }>();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [organization, setOrganization] = useState<{ id: string; name: string; code: string } | null>(null);
  const [presenceForm, setPresenceForm] = useState<any>(null);
  const [enrollmentForm, setEnrollmentForm] = useState<any>(null);
  const [hasForms, setHasForms] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Charger les informations de l'organisation et ses formulaires
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        let tenantId: string;
        let orgName: string;

        if (!orgCode) {
          // Organisation par défaut - utiliser Cotonou pour les tests
          tenantId = 'de0a8e08-5e28-4593-8151-853f0f9e4aae'; // UUID réel du tenant Cotonou
          orgName = 'BENIN EXCELLENCE Cotonou';
          setOrganization({ id: tenantId, name: orgName, code: 'BE-COTONOU' });
        } else {
          // Récupérer l'organisation par son code via l'API
          try {
            console.log('🔍 [HomePage] Recherche organisation par code:', orgCode);
            const tenantData = await setupService.getTenantByCode(orgCode);
            console.log('✅ [HomePage] Organisation trouvée:', tenantData);

            tenantId = tenantData.id;
            orgName = tenantData.name;
            setOrganization({
              id: tenantId,
              name: orgName,
              code: tenantData.code
            });
          } catch (error) {
            console.error('❌ [HomePage] Organisation introuvable:', orgCode, error);
            // Organisation inconnue - afficher une erreur
            setError(`L'organisation "${orgCode}" n'existe pas ou n'est pas accessible.`);
            setLoading(false);
            return;
          }
        }

        // Charger les formulaires actifs de l'organisation
        console.log('🔄 [HomePage] Chargement des formulaires pour tenant:', tenantId);
        const formsData = await formService.getPublicForms(tenantId);
        console.log('📋 [HomePage] Formulaires reçus:', formsData);

        // Séparer les formulaires par purpose
        const presenceFormData = formsData.find(form => form.purpose === 'PRESENCE');
        const enrollmentFormData = formsData.find(form => form.purpose === 'ENROLLMENT');

        console.log('🎯 [HomePage] Formulaire présence:', presenceFormData);
        console.log('🎯 [HomePage] Formulaire enregistrement:', enrollmentFormData);
        console.log('📊 [HomePage] Total formulaires trouvés:', formsData.length);

        setPresenceForm(presenceFormData || null);
        setEnrollmentForm(enrollmentFormData || null);
        setHasForms(formsData.length > 0);

      } catch (err) {
        console.error('Erreur chargement données:', err);
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [orgCode]);

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

  if (loading) {
    return (
      <VisitorLayout>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement de l'organisation...</p>
              </div>
            </div>
          </div>
        </main>
      </VisitorLayout>
    );
  }

  if (error) {
    return (
      <VisitorLayout>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
              <div className="text-center">
                <div className="text-red-600 mb-4">
                  <Shield className="w-12 h-12 mx-auto mb-2" />
                  <h2 className="text-xl font-bold">Organisation introuvable</h2>
                </div>
                <p className="text-gray-600">{error}</p>
              </div>
            </div>
          </div>
        </main>
      </VisitorLayout>
    );
  }

  return (
    <VisitorLayout>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenue à {organization?.name || 'BENIN EXCELLENCE'}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choisissez l'action que vous souhaitez effectuer
          </p>
          {organization && (
            <div className="mt-6 inline-flex items-center px-4 py-2 rounded-full text-sm bg-blue-100 text-blue-800">
              <Shield className="w-5 h-5 mr-2" />
              {organization.name}
            </div>
          )}
        </div>

        {/* Main Presence Form */}
        <div className="max-w-2xl mx-auto">
          {!hasForms ? (
            // No forms available
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Aucun formulaire disponible
                </h2>
                <p className="text-gray-600 mb-6">
                  Les formulaires de présence n'ont pas encore été configurés pour cette organisation.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Contactez l'administrateur</strong> pour configurer les formulaires de présence.
                  </p>
                </div>
                {organization && (
                  <div className="mt-6 inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                    <Shield className="w-4 h-4 mr-2" />
                    {organization.name}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Forms available
            <>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    {(() => {
                      console.log('🎨 [HomePage] Rendu - presenceForm:', presenceForm);
                      return presenceForm?.name || 'Enregistrer ma présence';
                    })()}
                  </h2>
                  <p className="text-gray-600">
                    {presenceForm?.description || 'Entrez votre identifiant unique pour marquer votre présence'}
                  </p>
                  {organization && (
                    <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      <Shield className="w-4 h-4 mr-2" />
                      {organization.name}
                    </div>
                  )}
                </div>

                {/* Presence Input Form */}
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
                      {enrollmentForm?.name || 'Première visite ?'}
                    </h3>
                    <p className="text-gray-700 mb-4">
                      {enrollmentForm?.description || 'Si c\'est votre première fois, vous devez d\'abord vous enregistrer pour obtenir votre identifiant unique.'}
                    </p>
                    <Link
                      to={orgCode ? `/org/${orgCode}/register` : '/register'}
                      className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                    >
                      S'enregistrer →
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-lg">ℹ️</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">
                  Comment ça marche ?
                </h4>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• <strong>Pour marquer votre présence :</strong> Choisissez le formulaire de présence et entrez votre UUID</li>
                  <li>• <strong>Pour vous enregistrer :</strong> Choisissez le formulaire d'enregistrement si c'est votre première visite</li>
                  <li>• <strong>UUID unique :</strong> Conservez précieusement votre identifiant (ex: BE-XXXXXX)</li>
                  <li>• <strong>Support :</strong> Contactez l'administration en cas de problème</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </VisitorLayout>
  );
}
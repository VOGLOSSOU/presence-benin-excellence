import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { UserPlus, ArrowLeft, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import VisitorLayout from '@/layouts/VisitorLayout';
import Modal from '@/components/common/Modal';
import { formService, setupService } from '@/services';
import { enrollmentService } from '@/services';

interface FormField {
  id: string;
  label: string;
  fieldType: string;
  isRequired: boolean;
  options?: string[];
  systemField?: string;
}

interface EnrollmentForm {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
}

export default function RegistrationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orgCode } = useParams<{ orgCode: string }>();
  const [enrollmentForm, setEnrollmentForm] = useState<EnrollmentForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedUUID, setGeneratedUUID] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Charger le formulaire dynamique au montage
  useEffect(() => {
    const loadForm = async () => {
      try {
        setLoading(true);
        setError('');

        // Récupérer formId depuis l'URL
        const urlParams = new URLSearchParams(location.search);
        const formId = urlParams.get('formId');

        if (!formId) {
          setError('Formulaire d\'enregistrement non spécifié');
          return;
        }

        // Récupérer le tenantId depuis l'organisation
        let tenantId: string;

        if (orgCode) {
          // Récupérer l'organisation par son code
          console.log('🔍 [RegistrationPage] Recherche organisation par code:', orgCode);
          const tenantData = await setupService.getTenantByCode(orgCode);
          tenantId = tenantData.id;
          console.log('✅ [RegistrationPage] Organisation trouvée:', tenantData);
        } else {
          // Organisation par défaut (Cotonou pour les tests)
          tenantId = 'de0a8e08-5e28-4593-8151-853f0f9e4aae';
        }

        console.log('🔄 [RegistrationPage] Chargement formulaire:', formId, 'pour tenant:', tenantId);
        const form = await formService.getPublicFormById(tenantId, formId);
        console.log('✅ [RegistrationPage] Formulaire chargé:', form);

        setEnrollmentForm(form);

        // Initialiser formData avec les champs du formulaire
        const initialData: Record<string, any> = {};
        form.fields.forEach(field => {
          initialData[field.id] = '';
        });
        setFormData(initialData);

      } catch (err) {
        console.error('❌ [RegistrationPage] Erreur chargement formulaire:', err);
        setError(err instanceof Error ? err.message : 'Erreur de chargement du formulaire');
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [location.search, orgCode]);

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollmentForm) return;

    setSubmitting(true);
    setError('');

    try {
      // Préparer les données pour l'API
      const fieldValues = enrollmentForm.fields.map(field => ({
        fieldTemplateId: field.id,
        value: formData[field.id] || ''
      }));

      // Trouver les champs requis
      const requiredFields = enrollmentForm.fields.filter(f => f.isRequired);
      const missingFields = requiredFields.filter(f => !formData[f.id]?.trim());

      if (missingFields.length > 0) {
        setError(`Champs requis manquants: ${missingFields.map(f => f.label).join(', ')}`);
        return;
      }

      // Mapper automatiquement les champs système
      const systemFields: Record<string, any> = {};

      enrollmentForm.fields.forEach(field => {
        if (field.systemField) {
          const value = formData[field.id];
          console.log('🔍 [RegistrationPage] Mapping champ système:', field.systemField, '=', value);
          if (field.systemField === 'title') {
            // Pour le titre, s'assurer que c'est un enum valide
            systemFields[field.systemField] = (value || 'AUTRE') as 'ETUDIANT' | 'PROFESSIONNEL' | 'ELEVE' | 'AUTRE';
          } else {
            systemFields[field.systemField] = value || undefined;
          }
        }
      });

      console.log('🔍 [RegistrationPage] Champs système mappés:', systemFields);

      const enrollmentData: any = {
        lastName: systemFields.lastName || 'Nom',
        firstName: systemFields.firstName || 'Prénom',
        title: systemFields.title || 'AUTRE' as 'ETUDIANT' | 'PROFESSIONNEL' | 'ELEVE' | 'AUTRE',
        formTemplateId: enrollmentForm.id,
        fieldValues
      };

      // Ajouter seulement les champs définis
      if (systemFields.institution) enrollmentData.institution = systemFields.institution;
      if (systemFields.phone) enrollmentData.phone = systemFields.phone;
      if (systemFields.email) enrollmentData.email = systemFields.email;

      console.log('📤 [RegistrationPage] Soumission enregistrement:', enrollmentData);

      const result = await enrollmentService.enrollUser(enrollmentData);

      console.log('✅ [RegistrationPage] Enregistrement réussi:', result);

      // Stocker les informations de l'utilisateur pour l'affichage
      setUserInfo({
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        title: result.user.title,
        institution: (result.user as any).institution,
        phone: result.user.phone,
        email: result.user.email,
        uuidCode: result.user.uuidCode
      });

      setGeneratedUUID(result.user.uuidCode);
      setShowSuccessModal(true);

    } catch (err) {
      console.error('❌ [RegistrationPage] Erreur enregistrement:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <VisitorLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à la page précédente
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            S'enregistrer à BENIN EXCELLENCE
          </h1>
          <p className="text-xl text-gray-600">
            Obtenez votre identifiant unique en quelques étapes
          </p>
        </div>


        {/* Formulaire dynamique */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {loading ? (
            <div className="text-center py-12">
              <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-gray-600">Chargement du formulaire...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">Erreur de chargement</h3>
              <p className="text-red-700">{error}</p>
            </div>
          ) : enrollmentForm ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {enrollmentForm.name}
                </h2>
                {enrollmentForm.description && (
                  <p className="text-gray-600">{enrollmentForm.description}</p>
                )}
              </div>

              {/* Champs dynamiques */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollmentForm.fields.map((field) => (
                  <div key={field.id} className={field.fieldType === 'TEXTAREA' ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {field.label} {field.isRequired && <span className="text-red-500">*</span>}
                    </label>

                    {field.fieldType === 'TEXT' && (
                      <input
                        type="text"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={field.isRequired}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={`Entrez ${field.label.toLowerCase()}`}
                      />
                    )}

                    {field.fieldType === 'NUMBER' && (
                      <input
                        type="number"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={field.isRequired}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={`Entrez ${field.label.toLowerCase()}`}
                      />
                    )}

                    {field.fieldType === 'DATE' && (
                      <input
                        type="date"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={field.isRequired}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    )}

                    {field.fieldType === 'SELECT' && field.options && (
                      <select
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={field.isRequired}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Sélectionnez {field.label.toLowerCase()}</option>
                        {field.options.map((option, index) => (
                          <option key={index} value={option}>{option}</option>
                        ))}
                      </select>
                    )}

                    {field.fieldType === 'TEXTAREA' && (
                      <textarea
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={field.isRequired}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder={`Entrez ${field.label.toLowerCase()}`}
                      />
                    )}

                    {field.fieldType === 'CHECKBOX' && (
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData[field.id] === 'true'}
                          onChange={(e) => handleInputChange(field.id, e.target.checked ? 'true' : 'false')}
                          required={field.isRequired}
                          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">{field.label}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-left">
                    <p className="text-blue-800 font-semibold">Important</p>
                    <p className="text-blue-700 text-sm">
                      Après validation, vous recevrez un identifiant unique (ex: BE-XXXXXX) que vous utiliserez pour marquer votre présence.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-12 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Enregistrement en cours...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      <span>M'enregistrer</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucun formulaire disponible</p>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate(-1); // Retour à la page précédente
        }}
        title="🎉 Enregistrement réussi !"
        size="lg"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Bienvenue à BENIN EXCELLENCE !
            </h3>
            <p className="text-gray-600 mb-4">
              Votre enregistrement a été effectué avec succès. Voici votre identifiant unique :
            </p>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
              <div className="text-2xl font-mono font-bold text-primary-600 mb-2">
                {generatedUUID}
              </div>
              <p className="text-sm text-blue-700">
                Conservez précieusement cet identifiant. Il vous sera demandé à chaque présence.
              </p>
            </div>

            {/* Informations personnelles */}
            {userInfo && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Vos informations enregistrées
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-green-700">Nom complet:</span>
                    <span className="ml-2 text-green-900">{userInfo.firstName} {userInfo.lastName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Titre:</span>
                    <span className="ml-2 text-green-900">{userInfo.title}</span>
                  </div>
                  {userInfo.institution && (
                    <div className="md:col-span-2">
                      <span className="font-medium text-green-700">Institution:</span>
                      <span className="ml-2 text-green-900">{userInfo.institution}</span>
                    </div>
                  )}
                  {userInfo.phone && (
                    <div>
                      <span className="font-medium text-green-700">Téléphone:</span>
                      <span className="ml-2 text-green-900">{userInfo.phone}</span>
                    </div>
                  )}
                  {userInfo.email && (
                    <div>
                      <span className="font-medium text-green-700">Email:</span>
                      <span className="ml-2 text-green-900">{userInfo.email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-left">
              <h4 className="font-semibold text-yellow-800 mb-2">📝 Prochaines étapes :</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Utilisez votre UUID pour marquer votre présence</li>
                <li>• Vous pouvez consulter votre historique à tout moment</li>
                <li>• Contactez l'administration en cas de problème</li>
              </ul>
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate(-1);
                }}
                className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
              >
                Commencer à marquer ma présence
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </VisitorLayout>
  );
}
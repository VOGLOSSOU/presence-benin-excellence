import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import VisitorLayout from '@/layouts/VisitorLayout';
import Modal from '@/components/common/Modal';

export default function RegistrationPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    profileType: '',
    email: '',
    phone: '',
    university: '',
    company: '',
    school: '',
    position: '',
    description: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedUUID, setGeneratedUUID] = useState('');

  const profileTypes = [
    { value: 'student', label: 'Étudiant', icon: '🎓' },
    { value: 'professional', label: 'Professionnel', icon: '💼' },
    { value: 'pupil', label: 'Élève', icon: '📚' },
    { value: 'other', label: 'Autre', icon: '👤' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <VisitorLayout>
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            S'enregistrer à BENIN EXCELLENCE
          </h1>
          <p className="text-xl text-gray-600">
            Obtenez votre identifiant unique en quelques étapes
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= stepNumber
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > stepNumber ? 'bg-primary-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 text-sm text-gray-600">
            <span className={step >= 1 ? 'text-primary-600 font-semibold' : ''}>Informations personnelles</span>
            <span className="mx-4">→</span>
            <span className={step >= 2 ? 'text-primary-600 font-semibold' : ''}>Profil spécifique</span>
            <span className="mx-4">→</span>
            <span className={step >= 3 ? 'text-primary-600 font-semibold' : ''}>Confirmation</span>
          </div>
        </div>

        {/* Form Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations personnelles</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prénoms *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Vos prénoms"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="votre.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="+229 XX XX XX XX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Quel est votre profil ? *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {profileTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleInputChange('profileType', type.value)}
                      className={`p-4 border-2 rounded-xl text-center transition-all ${
                        formData.profileType === type.value
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="font-semibold">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={nextStep}
                  disabled={!formData.lastName || !formData.firstName || !formData.profileType}
                  className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Informations spécifiques à votre profil
              </h2>

              {formData.profileType === 'student' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Université *
                  </label>
                  <select
                    value={formData.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez votre université</option>
                    <option value="uac">Université d'Abomey-Calavi</option>
                    <option value="epac">École Polytechnique d'Abomey-Calavi</option>
                    <option value="autre">Autre université</option>
                  </select>
                </div>
              )}

              {formData.profileType === 'professional' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Entreprise *
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Nom de votre entreprise"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Poste
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Votre poste actuel"
                    />
                  </div>
                </div>
              )}

              {formData.profileType === 'pupil' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Établissement scolaire *
                  </label>
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => handleInputChange('school', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Nom de votre école/lycée"
                  />
                </div>
              )}

              {formData.profileType === 'other' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description de votre profil
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Décrivez brièvement votre profil..."
                  />
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Précédent
                </button>
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Confirmation de votre enregistrement
              </h2>

              <div className="bg-gray-50 rounded-lg p-6 text-left max-w-lg mx-auto">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nom:</span>
                    <span className="font-semibold">{formData.lastName} {formData.firstName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profil:</span>
                    <span className="font-semibold">
                      {profileTypes.find(t => t.value === formData.profileType)?.label}
                    </span>
                  </div>
                  {formData.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-semibold">{formData.email}</span>
                    </div>
                  )}
                  {formData.phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Téléphone:</span>
                      <span className="font-semibold">{formData.phone}</span>
                    </div>
                  )}

                  {/* Informations spécifiques selon le profil */}
                  {formData.profileType === 'student' && formData.university && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Université:</span>
                      <span className="font-semibold">{formData.university}</span>
                    </div>
                  )}
                  {formData.profileType === 'professional' && (
                    <>
                      {formData.company && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Entreprise:</span>
                          <span className="font-semibold">{formData.company}</span>
                        </div>
                      )}
                      {formData.position && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Poste:</span>
                          <span className="font-semibold">{formData.position}</span>
                        </div>
                      )}
                    </>
                  )}
                  {formData.profileType === 'pupil' && formData.school && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Établissement:</span>
                      <span className="font-semibold">{formData.school}</span>
                    </div>
                  )}
                  {formData.profileType === 'other' && formData.description && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Description:</span>
                      <span className="font-semibold">{formData.description}</span>
                    </div>
                  )}

                </div>
              </div>

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

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => {
                    // Générer un UUID simulé
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                    let code = '';
                    for (let i = 0; i < 6; i++) {
                      code += chars.charAt(Math.floor(Math.random() * chars.length));
                    }
                    const uuid = `BE-${code}`;
                    setGeneratedUUID(uuid);
                    setShowSuccessModal(true);
                  }}
                  className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirmer l'enregistrement
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
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

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-left">
              <h4 className="font-semibold text-yellow-800 mb-2">📝 Prochaines étapes :</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Utilisez votre UUID pour marquer votre présence</li>
                <li>• Vous pouvez consulter votre historique à tout moment</li>
                <li>• Contactez l'administration en cas de problème</li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    </VisitorLayout>
  );
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Crown } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services';
import { getUserFromToken } from '@/utils/jwt';
import PasswordInput from '@/components/common/PasswordInput';

export default function SystemLoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Appel API réel d'authentification
      const result = await authService.login({
        username: formData.username,
        password: formData.password,
      });

      // Extraire les informations utilisateur du token JWT
      const userFromToken = getUserFromToken(result.token);

      if (!userFromToken) {
        throw new Error('Token invalide');
      }

      // Créer un objet AdminUser complet
      const adminUser = {
        id: userFromToken.id,
        username: userFromToken.username,
        role: userFromToken.role,
        tenantId: userFromToken.tenantId,
        createdAt: new Date(), // Valeur par défaut
      };

      // Login successful
      login(adminUser, result.token);

      // Redirection vers le dashboard système
      navigate('/system/dashboard');
    } catch (error) {
      // Erreur - affichage du message d'erreur
      setError(error instanceof Error ? error.message : 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Administration Système</h2>
            <p className="text-gray-600 mt-2">Accès au panneau de contrôle général</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur système</label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder=""
                  disabled={isLoading}
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck="false"
                />
                <Shield className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <PasswordInput
              label="Mot de passe système"
              value={formData.password}
              onChange={(value) => handleInputChange('password', value)}
              required
              disabled={isLoading}
            />

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Crown className="w-4 h-4 mr-2" />
                    Accéder au système
                  </div>
                )}
              </button>
            </div>
          </form>


          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-gray-500 hover:text-primary-600 transition-colors"
            >
              ← Retour à la connexion admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
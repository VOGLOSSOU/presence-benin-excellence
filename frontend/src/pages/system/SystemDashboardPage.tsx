import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building,
  Users,
  Plus,
  Settings,
  Shield,
  Crown,
  Globe,
  BarChart3,
  ArrowLeft,
  RefreshCw,
  LogOut,
  PowerOff,
  Power,
  Trash2,
  Eye,
  EyeOff,
  Info,
  Clock,
  Lock
} from 'lucide-react';
import { setupService, reportService } from '@/services';
import { useAuthStore } from '@/stores/authStore';
import PasswordInput from '@/components/common/PasswordInput';

interface Organization {
  id: string;
  name: string;
  code: string;
  adminUsername?: string;
  adminId?: string;
  usersCount?: number;
  formsCount?: number;
  status?: string;
  createdAt?: string;
}

interface SystemStats {
  totalOrganizations: number;
  totalUsers: number;
  totalPresences: number;
  systemHealth: string;
}

export default function SystemDashboardPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalOrganizations: 0,
    totalUsers: 0,
    totalPresences: 0,
    systemHealth: 'healthy'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // État pour le formulaire de création
  const [createForm, setCreateForm] = useState({
    organizationName: '',
    adminUsername: '',
    adminPassword: ''
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // État pour les actions sur les organisations
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [showOrgActions, setShowOrgActions] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showOrgDetails, setShowOrgDetails] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetPasswordForm, setResetPasswordForm] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [resetPasswordError, setResetPasswordError] = useState('');

  // Charger les données au montage du composant
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Fermer le menu d'actions quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showOrgActions && !(event.target as Element).closest('.org-actions-menu')) {
        setShowOrgActions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOrgActions]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Charger les organisations
      console.log('🔄 [SystemDashboard] Chargement des organisations...');
      const orgsResponse = await setupService.getAllOrganizations();
      console.log('📊 [SystemDashboard] Organisations reçues:', orgsResponse);
      setOrganizations(orgsResponse);

      // Charger les statistiques système
      console.log('🔄 [SystemDashboard] Chargement des stats...');
      const statsResponse = await setupService.getSystemStats();
      console.log('📈 [SystemDashboard] Stats reçues:', statsResponse);
      setSystemStats(statsResponse);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError(error instanceof Error ? error.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleLogout = () => {
    logout();
    navigate('/system/login');
  };

  // Gestion des actions sur les organisations
  const handleOrgAction = (org: Organization, action: string) => {
    setSelectedOrg(org);
    setShowOrgActions(false);

    switch (action) {
      case 'view-details':
        setShowOrgDetails(true);
        break;
      case 'toggle-status':
        handleToggleOrgStatus(org);
        break;
      case 'reset-password':
        setShowResetPassword(true);
        break;
      case 'delete':
        handleDeleteOrg(org);
        break;
    }
  };

  const handleToggleOrgStatus = async (org: Organization) => {
    if (!org.id) return;

    setActionLoading(true);
    try {
      if (org.status === 'active') {
        await setupService.deactivateOrganization(org.id);
      } else {
        await setupService.activateOrganization(org.id);
      }
      await loadDashboardData(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      alert('Erreur lors du changement de statut de l\'organisation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteOrg = async (org: Organization) => {
    if (!org.id) return;

    const confirmDelete = window.confirm(
      `Êtes-vous sûr de vouloir supprimer définitivement l'organisation "${org.name}" ?\n\nCette action est IRRÉVERSIBLE et supprimera toutes les données associées.`
    );

    if (!confirmDelete) return;

    setActionLoading(true);
    try {
      await setupService.deleteOrganization(org.id);
      await loadDashboardData(); // Recharger les données
      alert('Organisation supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression de l\'organisation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg?.adminId) {
      setResetPasswordError('Aucun admin trouvé pour cette organisation');
      return;
    }

    if (resetPasswordForm.newPassword !== resetPasswordForm.confirmPassword) {
      setResetPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    setActionLoading(true);
    setResetPasswordError('');

    try {
      await setupService.resetAdminPassword(selectedOrg.adminId, resetPasswordForm.newPassword);
      alert('Mot de passe réinitialisé avec succès !');
      setShowResetPassword(false);
      setResetPasswordForm({ newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('❌ [SystemDashboard] Erreur reset mot de passe:', error);

      // Gestion des erreurs de validation détaillées
      if (error?.response?.data?.error && Array.isArray(error.response.data.error)) {
        // Erreurs de validation Zod détaillées
        const validationErrors = error.response.data.error
          .map((err: any) => `• ${err.message}`)
          .join('\n');
        setResetPasswordError(`Erreurs de validation :\n${validationErrors}`);
      } else if (error?.response?.data?.message) {
        // Message d'erreur spécifique
        setResetPasswordError(error.response.data.message);
      } else if (error?.message) {
        // Erreur avec message
        setResetPasswordError(error.message);
      } else {
        // Erreur générique
        setResetPasswordError('Une erreur inattendue s\'est produite lors du reset');
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');

    try {
      console.log('🏗️ [SystemDashboard] Création d\'organisation:', createForm);

      const result = await setupService.createOrganization(createForm);
      console.log('✅ [SystemDashboard] Organisation créée:', result);

      // Fermer le modal et réinitialiser le formulaire
      setShowCreateModal(false);
      setCreateForm({
        organizationName: '',
        adminUsername: '',
        adminPassword: ''
      });

      // Recharger les données
      await loadDashboardData();

      // Afficher un message de succès (optionnel)
      alert(`Organisation "${result.tenant.name}" créée avec succès !\n\nAdmin: ${result.admin.username}\nMot de passe: ${createForm.adminPassword}`);

    } catch (error: any) {
      console.error('❌ [SystemDashboard] Erreur création:', error);

      // Gestion des erreurs de validation détaillées
      if (error?.response?.data?.error && Array.isArray(error.response.data.error)) {
        // Erreurs de validation Zod détaillées
        const validationErrors = error.response.data.error
          .map((err: any) => `• ${err.message}`)
          .join('\n');
        setCreateError(`Erreurs de validation :\n${validationErrors}`);
      } else if (error?.response?.data?.message) {
        // Message d'erreur spécifique
        setCreateError(error.response.data.message);
      } else if (error?.message) {
        // Erreur avec message
        setCreateError(error.message);
      } else {
        // Erreur générique
        setCreateError('Une erreur inattendue s\'est produite lors de la création');
      }
    } finally {
      setCreating(false);
    }
  };

  const handleFormChange = (field: string, value: string) => {
    setCreateForm(prev => ({ ...prev, [field]: value }));
    if (createError) setCreateError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Administration Système</h1>
                  <p className="text-sm text-gray-600">Panneau de contrôle général</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Connecté en tant que</p>
                <p className="text-gray-900 font-semibold">{user?.username || 'System Administrator'}</p>
              </div>
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Organisations</p>
                <p className="text-3xl font-bold text-gray-900">{systemStats.totalOrganizations}</p>
              </div>
              <Building className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs totaux</p>
                <p className="text-3xl font-bold text-gray-900">{systemStats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Présences totales</p>
                <p className="text-3xl font-bold text-gray-900">{systemStats.totalPresences.toLocaleString()}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">État système</p>
                <p className="text-3xl font-bold text-gray-900 capitalize">{systemStats.systemHealth}</p>
              </div>
              <Globe className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Organizations Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Gestion des Organisations</h2>
                <p className="text-gray-600 mt-1">Administrer toutes les organisations BENIN EXCELLENCE</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Actualiser les données"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-all flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nouvelle Organisation</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
                <p className="text-gray-600">Chargement des organisations...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <div className="text-red-600 mb-4">
                  <p className="text-lg font-semibold">Erreur de chargement</p>
                  <p className="text-sm">{error}</p>
                </div>
                <button
                  onClick={handleRefresh}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                >
                  Réessayer
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Organisation
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Admin Principal
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateurs
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Formulaires
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {organizations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        Aucune organisation trouvée
                      </td>
                    </tr>
                  ) : (
                    organizations.map((org) => (
                      <tr key={org.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{org.name}</div>
                            <div className="text-sm text-gray-500">{org.code}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{org.adminUsername || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{org.usersCount?.toLocaleString() || '0'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{org.formsCount || '0'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            org.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {org.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="relative">
                            <button
                              onClick={() => {
                                setSelectedOrg(org);
                                setShowOrgActions(!showOrgActions);
                              }}
                              className="text-primary-600 hover:text-primary-800 mr-4"
                              title="Actions sur l'organisation"
                            >
                              <Settings className="w-4 h-4" />
                            </button>

                            {/* Menu déroulant des actions */}
                            {showOrgActions && selectedOrg?.id === org.id && (
                              <div className="org-actions-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                <div className="py-1">
                                  <button
                                    onClick={() => handleOrgAction(org, 'view-details')}
                                    disabled={actionLoading}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                  >
                                    <Info className="w-4 h-4 mr-3 text-gray-500" />
                                    Voir détails
                                  </button>

                                  <button
                                    onClick={() => handleOrgAction(org, 'toggle-status')}
                                    disabled={actionLoading}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                  >
                                    {org.status === 'active' ? (
                                      <>
                                        <PowerOff className="w-4 h-4 mr-3 text-gray-500" />
                                        Désactiver
                                      </>
                                    ) : (
                                      <>
                                        <Power className="w-4 h-4 mr-3 text-gray-500" />
                                        Réactiver
                                      </>
                                    )}
                                  </button>

                                  <button
                                    onClick={() => handleOrgAction(org, 'reset-password')}
                                    disabled={actionLoading}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                  >
                                    <Lock className="w-4 h-4 mr-3 text-gray-500" />
                                    Reset mot de passe
                                  </button>

                                  <div className="border-t border-gray-200"></div>

                                  <button
                                    onClick={() => handleOrgAction(org, 'delete')}
                                    disabled={actionLoading}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                                  >
                                    <Trash2 className="w-4 h-4 mr-3 text-red-500" />
                                    Supprimer
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Sécurité</h3>
                <p className="text-gray-600 text-sm">Gérer les accès système</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Rapports</h3>
                <p className="text-gray-600 text-sm">Analyses globales du système</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
                <p className="text-gray-600 text-sm">Paramètres système</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Create Organization Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Créer une nouvelle organisation</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateOrganization} className="space-y-4">
                  {createError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {createError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'organisation *
                    </label>
                    <input
                      type="text"
                      required
                      value={createForm.organizationName}
                      onChange={(e) => handleFormChange('organizationName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="BENIN EXCELLENCE [Ville]"
                      disabled={creating}
                      autoComplete="off"
                      autoCapitalize="words"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom d'utilisateur admin *
                    </label>
                    <input
                      type="text"
                      required
                      value={createForm.adminUsername}
                      onChange={(e) => handleFormChange('adminUsername', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder=""
                      disabled={creating}
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                  </div>

                  <PasswordInput
                    label="Mot de passe temporaire *"
                    value={createForm.adminPassword}
                    onChange={(value) => handleFormChange('adminPassword', value)}
                    placeholder="Mot de passe sécurisé"
                    required
                    disabled={creating}
                  />

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {creating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Création...</span>
                        </>
                      ) : (
                        <span>Créer l'organisation</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPassword && selectedOrg && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowResetPassword(false)} />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-md w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Reset mot de passe admin</h3>
                  <button
                    onClick={() => setShowResetPassword(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Organisation: <strong>{selectedOrg.name}</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Admin: <strong>{selectedOrg.adminUsername}</strong>
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                  {resetPasswordError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {resetPasswordError}
                    </div>
                  )}

                  <PasswordInput
                    label="Nouveau mot de passe *"
                    value={resetPasswordForm.newPassword}
                    onChange={(value) => {
                      setResetPasswordForm(prev => ({ ...prev, newPassword: value }));
                      if (resetPasswordError) setResetPasswordError('');
                    }}
                    placeholder="Mot de passe sécurisé"
                    required
                    disabled={actionLoading}
                  />

                  <PasswordInput
                    label="Confirmer le mot de passe *"
                    value={resetPasswordForm.confirmPassword}
                    onChange={(value) => {
                      setResetPasswordForm(prev => ({ ...prev, confirmPassword: value }));
                      if (resetPasswordError) setResetPasswordError('');
                    }}
                    placeholder="Confirmer le mot de passe"
                    required
                    disabled={actionLoading}
                  />

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {actionLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Reset...</span>
                        </>
                      ) : (
                        <span>Reset le mot de passe</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Organization Details Modal */}
      {showOrgDetails && selectedOrg && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowOrgDetails(false)} />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-md w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Détails de l'organisation</h3>
                  <button
                    onClick={() => setShowOrgDetails(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Building className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Nom de l'organisation</p>
                      <p className="text-sm text-gray-600">{selectedOrg.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Code</p>
                      <p className="text-sm text-gray-600">{selectedOrg.code}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Crown className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Admin Principal</p>
                      <p className="text-sm text-gray-600">{selectedOrg.adminUsername || 'N/A'}</p>
                    </div>
                  </div>


                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Date de création</p>
                      <p className="text-sm text-gray-600">
                        {selectedOrg.createdAt ? new Date(selectedOrg.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Globe className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Statut</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedOrg.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedOrg.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowOrgDetails(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
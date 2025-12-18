import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Plus,
  Settings,
  BarChart3,
  Calendar,
  ArrowLeft,
  UserCheck,
  AlertCircle,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { setupService } from '@/services';
import { useAuthStore } from '@/stores/authStore';

interface OrganizationStats {
  totalUsers: number;
  activeUsers: number;
  totalPresences: number;
  todayPresences: number;
  totalForms: number;
  activeForms: number;
}

interface ActivityItem {
  id: string;
  type: string;
  user: string;
  action: string;
  time: string;
  status: string;
}

interface TenantInfo {
  id: string;
  name: string;
  code: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [stats, setStats] = useState<OrganizationStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalPresences: 0,
    todayPresences: 0,
    totalForms: 0,
    activeForms: 0
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Charger les données au montage du composant
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('🔄 [DashboardPage] Chargement des données...');
      console.log('👤 [DashboardPage] User:', user);

      // Vérifier que l'utilisateur a un tenantId
      if (!user?.tenantId) {
        console.warn('⚠️ [DashboardPage] User n\'a pas de tenantId:', user);
        setError(
          `Vous êtes connecté en tant que ${user?.role} mais vous n'êtes pas associé à une organisation spécifique.\n\n` +
          `Pour accéder au dashboard d'organisation :\n` +
          `1. Allez sur /system/dashboard (si vous êtes SYSTEM_ADMIN)\n` +
          `2. Créez une nouvelle organisation\n` +
          `3. Utilisez le compte SUPER_ADMIN créé pour cette organisation`
        );
        return;
      }

      console.log('🏢 [DashboardPage] TenantId trouvé:', user.tenantId);

      // Charger les informations du tenant
      try {
        const tenantResponse = await setupService.getTenantInfo(user.tenantId);
        console.log('✅ [DashboardPage] Tenant info:', tenantResponse);
        setTenantInfo(tenantResponse);
      } catch (tenantErr) {
        console.warn('⚠️ [DashboardPage] Erreur chargement tenant:', tenantErr);
        // Ne pas bloquer si on ne peut pas charger le tenant
      }

      // Charger les statistiques
      console.log('📊 [DashboardPage] Chargement stats...');
      const statsResponse = await setupService.getOrganizationStats();
      console.log('✅ [DashboardPage] Stats:', statsResponse);
      setStats(statsResponse);

      // Charger l'activité récente
      console.log('📈 [DashboardPage] Chargement activité...');
      const activityResponse = await setupService.getRecentActivity();
      console.log('✅ [DashboardPage] Activité:', activityResponse);
      setRecentActivity(activityResponse);

      console.log('🎉 [DashboardPage] Toutes les données chargées avec succès');

    } catch (err) {
      console.error('❌ [DashboardPage] Erreur lors du chargement des données:', err);
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleOpenVisitorAccess = () => {
    if (!tenantInfo?.code) {
      alert('Impossible de générer le lien : code d\'organisation manquant');
      return;
    }

    const visitorUrl = `${window.location.origin}/org/${tenantInfo.code}`;
    window.open(visitorUrl, '_blank');

    // Copier dans le presse-papiers silencieusement
    navigator.clipboard.writeText(visitorUrl).catch(() => {
      // Silencieux en cas d'erreur
    });
  };

  const quickActions = [
    {
      title: 'Nouveau Formulaire',
      description: 'Créer un formulaire d\'enregistrement',
      icon: FileText,
      link: '/admin/forms',
      color: 'blue'
    },
    {
      title: 'Voir Utilisateurs',
      description: 'Gérer les visiteurs enregistrés',
      icon: Users,
      link: '/admin/users',
      color: 'green'
    },
    {
      title: 'Rapports',
      description: 'Analyser les statistiques',
      icon: BarChart3,
      link: '/admin/reports',
      color: 'purple'
    },
    {
      title: 'Ouvrir l\'accès visiteurs',
      description: 'Générer le lien pour les visiteurs',
      icon: UserCheck,
      action: 'openVisitorAccess',
      color: 'emerald'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Tableau de Bord</h1>
                <p className="text-sm text-gray-600">
                  {tenantInfo ? tenantInfo.name : 'BENIN EXCELLENCE'}
                </p>
              </div>
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
                 onClick={handleLogout}
                 className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                 title="Se déconnecter"
               >
                 <LogOut className="w-4 h-4" />
                 <span>Déconnexion</span>
               </button>
               <div className="text-right">
                 <p className="text-sm text-gray-500">Connecté en tant que</p>
                 <p className="text-gray-900 font-semibold">Super Admin</p>
               </div>
               <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                 <UserCheck className="w-5 h-5 text-white" />
               </div>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Aperçu général</h2>
            <div className="flex space-x-2">
              {['today', 'week', 'month'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedPeriod === period
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {period === 'today' ? 'Aujourd\'hui' : period === 'week' ? 'Cette semaine' : 'Ce mois'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? (
            // Loading state
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))
          ) : error ? (
            // Error state
            <div className="col-span-full bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Erreur de chargement</h3>
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Success state - Stats normales
            <>
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs actifs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12% ce mois
                </p>
              </div>
              <Users className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Présences aujourd'hui</p>
                <p className="text-3xl font-bold text-gray-900">{stats.todayPresences}</p>
                <p className="text-sm text-blue-600 flex items-center mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  En cours
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total présences</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPresences.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">Ce mois</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Formulaires actifs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeForms}</p>
                <p className="text-sm text-gray-500 mt-1">Sur {stats.totalForms} créés</p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </div>
           </>
         )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
              <p className="text-sm text-gray-600 mt-1">Dernières actions dans votre organisation</p>
            </div>
            <div className="divide-y divide-gray-200">
              {loading ? (
                // Loading state for activity
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="p-4 animate-pulse">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : recentActivity.length === 0 ? (
                // Empty state
                <div className="p-8 text-center text-gray-500">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>Aucune activité récente</p>
                </div>
              ) : (
                // Activity items
                recentActivity.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.status === 'success' ? 'bg-green-100' :
                        activity.status === 'info' ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {activity.type === 'presence' && <CheckCircle className="w-4 h-4 text-green-600" />}
                        {activity.type === 'enrollment' && <UserCheck className="w-4 h-4 text-blue-600" />}
                        {activity.type === 'form' && <FileText className="w-4 h-4 text-purple-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-gray-200">
              <Link
                to="/admin/reports"
                className="text-sm text-primary-600 hover:text-primary-800 font-medium"
              >
                Voir toutes les activités →
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Actions rapides</h3>
              <p className="text-sm text-gray-600 mt-1">Accès aux fonctionnalités principales</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  action.link ? (
                    <Link
                      key={index}
                      to={action.link}
                      className={`p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all group ${
                        action.color === 'blue' ? 'hover:border-blue-300' :
                        action.color === 'green' ? 'hover:border-green-300' :
                        action.color === 'purple' ? 'hover:border-purple-300' :
                        action.color === 'emerald' ? 'hover:border-emerald-300' :
                        'hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                        action.color === 'blue' ? 'bg-blue-100 group-hover:bg-blue-200' :
                        action.color === 'green' ? 'bg-green-100 group-hover:bg-green-200' :
                        action.color === 'purple' ? 'bg-purple-100 group-hover:bg-purple-200' :
                        action.color === 'emerald' ? 'bg-emerald-100 group-hover:bg-emerald-200' :
                        'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <action.icon className={`w-5 h-5 ${
                          action.color === 'blue' ? 'text-blue-600' :
                          action.color === 'green' ? 'text-green-600' :
                          action.color === 'purple' ? 'text-purple-600' :
                          action.color === 'emerald' ? 'text-emerald-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </Link>
                  ) : (
                    <button
                      key={index}
                      onClick={() => handleOpenVisitorAccess()}
                      className={`p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all group text-left w-full ${
                        action.color === 'emerald' ? 'hover:border-emerald-300' :
                        'hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                        action.color === 'emerald' ? 'bg-emerald-100 group-hover:bg-emerald-200' :
                        'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        <action.icon className={`w-5 h-5 ${
                          action.color === 'emerald' ? 'text-emerald-600' :
                          'text-gray-600'
                        }`} />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </button>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Système opérationnel</h3>
                  <p className="text-sm text-gray-600">Tous les services fonctionnent normalement</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Dernière vérification</p>
                <p className="text-sm font-medium text-gray-900">il y a 2 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
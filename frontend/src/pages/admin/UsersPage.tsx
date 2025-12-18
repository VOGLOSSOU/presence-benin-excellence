import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Eye,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { userService, User } from '@/services/userService';

interface CreateUserForm {
  lastName: string;
  firstName: string;
  title: string;
  phone: string;
  email: string;
}

export default function UsersPage() {
  const { user } = useAuthStore();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Forms
  const [createForm, setCreateForm] = useState<CreateUserForm>({
    lastName: '',
    firstName: '',
    title: 'ETUDIANT',
    phone: '',
    email: ''
  });
  const [editForm, setEditForm] = useState<CreateUserForm>({
    lastName: '',
    firstName: '',
    title: 'ETUDIANT',
    phone: '',
    email: ''
  });

  // Form states
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [createError, setCreateError] = useState('');
  const [editError, setEditError] = useState('');

  // Charger les utilisateurs
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await userService.getAllUsers();
      setUsers(response);
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // Filtrage des utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.uuidCode}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Gestion des actions utilisateur
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');

    try {
      const newUser = await userService.createUser(createForm);
      setUsers(prev => [newUser, ...prev]);
      setShowCreateModal(false);
      setCreateForm({
        lastName: '',
        firstName: '',
        title: 'ETUDIANT',
        phone: '',
        email: ''
      });
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setCreateError(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setCreating(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setEditing(true);
    setEditError('');

    try {
      const updatedUser = await userService.updateUser(selectedUser.id, editForm);
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? updatedUser : u));
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      setEditError(err instanceof Error ? err.message : 'Erreur lors de la modification');
    } finally {
      setEditing(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setDeleting(true);
    try {
      await userService.deleteUser(selectedUser.id);
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      // TODO: Afficher une erreur à l'utilisateur
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      const updatedUser = await userService.toggleUserStatus(user.id);
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    } catch (err) {
      console.error('Erreur lors du changement de statut:', err);
      // TODO: Afficher une erreur à l'utilisateur
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      lastName: user.lastName,
      firstName: user.firstName,
      title: user.title,
      phone: user.phone || '',
      email: user.email || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'ACTIF').length,
    inactiveUsers: users.filter(u => u.status === 'INACTIF').length,
    totalPresences: users.reduce((sum, u) => sum + u.presencesCount, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/dashboard"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
                  <p className="text-sm text-gray-600">Administration des visiteurs enregistrés</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadUsers}
                disabled={loading}
                className="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Actualiser les données"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvel Utilisateur</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total utilisateurs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs actifs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs inactifs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.inactiveUsers}</p>
              </div>
              <UserX className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total présences</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPresences.toLocaleString()}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, prénom ou code UUID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="actif">Actifs</option>
                <option value="inactif">Inactifs</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
                <p className="text-gray-600">Chargement des utilisateurs...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={loadUsers}
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
                      Utilisateur
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code UUID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Présences
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
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        {searchTerm || statusFilter !== 'all'
                          ? 'Aucun utilisateur trouvé avec ces critères'
                          : 'Aucun utilisateur enregistré'
                        }
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500 capitalize">
                              {user.title.toLowerCase()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-mono">
                            {user.uuidCode}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.phone && <div>{user.phone}</div>}
                            {user.email && <div className="text-gray-500">{user.email}</div>}
                            {!user.phone && !user.email && (
                              <span className="text-gray-400">Non renseigné</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.presencesCount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === 'ACTIF'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status === 'ACTIF' ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openEditModal(user)}
                              className="text-primary-600 hover:text-primary-800"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleUserStatus(user)}
                              className={`${
                                user.status === 'ACTIF'
                                  ? 'text-orange-600 hover:text-orange-800'
                                  : 'text-green-600 hover:text-green-800'
                              }`}
                              title={user.status === 'ACTIF' ? 'Désactiver' : 'Activer'}
                            >
                              {user.status === 'ACTIF' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => openDeleteModal(user)}
                              className="text-red-600 hover:text-red-800"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
      </main>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Créer un nouvel utilisateur</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-4">
                  {createError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {createError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        value={createForm.firstName}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Jean"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={createForm.lastName}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Dupont"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre *
                    </label>
                    <select
                      value={createForm.title}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ETUDIANT">Étudiant</option>
                      <option value="ELEVE">Élève</option>
                      <option value="PROFESSIONNEL">Professionnel</option>
                      <option value="AUTRE">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={createForm.phone}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+229 97 12 34 56"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={createForm.email}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="jean.dupont@email.com"
                    />
                  </div>

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
                        <span>Créer l'utilisateur</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Modifier l'utilisateur</h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleEditUser} className="space-y-4">
                  {editError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {editError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <input
                        type="text"
                        required
                        value={editForm.firstName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom *
                      </label>
                      <input
                        type="text"
                        required
                        value={editForm.lastName}
                        onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Titre *
                    </label>
                    <select
                      value={editForm.title}
                      onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ETUDIANT">Étudiant</option>
                      <option value="ELEVE">Élève</option>
                      <option value="PROFESSIONNEL">Professionnel</option>
                      <option value="AUTRE">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={editing}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {editing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Modification...</span>
                        </>
                      ) : (
                        <span>Modifier</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-md w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Confirmer la suppression</h3>
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{selectedUser.firstName} {selectedUser.lastName}</strong> ?
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                      <div className="text-sm text-red-700">
                        <p className="font-medium">Cette action est irréversible !</p>
                        <p className="mt-1">
                          Toutes les données de présence de cet utilisateur seront supprimées définitivement.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {deleting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Suppression...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span>Supprimer</span>
                      </>
                    )}
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
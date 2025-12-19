import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  CheckCircle,
  XCircle,
  Users,
  Calendar,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Clock,
  MoreVertical
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { formService, FormTemplate, FormType, FieldType, FormPurpose } from '@/services/formService';
import SystemFieldSelector, { SystemField } from '@/components/common/SystemFieldSelector';
import { SYSTEM_FIELDS } from '@/utils/constants';

interface CreateFormData {
  name: string;
  description: string;
  purpose: FormPurpose;
  type?: FormType; // Optionnel pour ENROLLMENT
  selectedSystemFields: string[]; // Pour les formulaires d'enregistrement
  fields: CreateFieldData[]; // Gardé pour compatibilité avec les formulaires de présence
  intervals: CreateIntervalData[];
}

interface CreateFieldData {
  label: string;
  fieldType: FieldType;
  isRequired: boolean;
  options: string[];
  order: number;
}

interface CreateIntervalData {
  startTime: string;
  endTime: string;
}

export default function FormsPage() {
  const { user } = useAuthStore();

  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);

  // Form states
  const [createForm, setCreateForm] = useState<CreateFormData>({
    name: '',
    description: '',
    purpose: 'ENROLLMENT', // Valeur par défaut
    type: undefined, // Sera défini seulement pour PRESENCE
    selectedSystemFields: [], // Champs système sélectionnés
    fields: [],
    intervals: []
  });
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    purpose: 'ENROLLMENT' as FormPurpose,
    type: undefined as FormType | undefined,
    active: true
  });

  // UI states
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [createError, setCreateError] = useState('');
  const [editError, setEditError] = useState('');

  // Charger les formulaires
  const loadForms = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await formService.getAllForms();
      setForms(response);
    } catch (err) {
      console.error('Erreur lors du chargement des formulaires:', err);
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  // Gestion des actions formulaires
  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation : le type de présence est automatiquement défini à ARRIVAL_DEPARTURE chez BENIN EXCELLENCE

    // Validation : vérifier qu'il y a au moins un champ système sélectionné pour les formulaires d'enregistrement
    if (createForm.purpose === 'ENROLLMENT' && createForm.selectedSystemFields.length === 0) {
      setCreateError('Veuillez sélectionner au moins un champ système pour le formulaire d\'enregistrement');
      return;
    }

    setCreating(true);
    setCreateError('');

    try {
      // Pour les formulaires d'enregistrement, convertir les champs système sélectionnés en champs de formulaire
      let formDataToSend = { ...createForm };

      if (createForm.purpose === 'ENROLLMENT') {
        formDataToSend.fields = createForm.selectedSystemFields.map((fieldKey, index) => {
          const systemField = SYSTEM_FIELDS.find(f => f.key === fieldKey);
          if (!systemField) throw new Error(`Champ système ${fieldKey} non trouvé`);
          return {
            label: systemField.label,
            fieldType: systemField.fieldType,
            isRequired: systemField.isRequired,
            options: systemField.options || [],
            order: index,
            systemField: fieldKey
          };
        });
      }

      const newForm = await formService.createForm(formDataToSend);
      setForms(prev => [newForm, ...prev]);
      setShowCreateModal(false);
      setCreateForm({
        name: '',
        description: '',
        purpose: 'ENROLLMENT',
        type: undefined,
        selectedSystemFields: [],
        fields: [],
        intervals: []
      });
      setCreateError('');
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      setCreateError(err instanceof Error ? err.message : 'Erreur lors de la création');
    } finally {
      setCreating(false);
    }
  };

  const handleEditForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForm) return;

    setEditing(true);
    setEditError('');

    try {
      const updatedForm = await formService.updateForm(selectedForm.id, editForm);
      setForms(prev => prev.map(f => f.id === selectedForm.id ? updatedForm : f));
      setShowEditModal(false);
      setSelectedForm(null);
    } catch (err) {
      console.error('Erreur lors de la modification:', err);
      setEditError(err instanceof Error ? err.message : 'Erreur lors de la modification');
    } finally {
      setEditing(false);
    }
  };

  const handleDeleteForm = async () => {
    if (!selectedForm) return;

    setDeleting(true);
    try {
      await formService.deleteForm(selectedForm.id);
      setForms(prev => prev.filter(f => f.id !== selectedForm.id));
      setShowDeleteModal(false);
      setSelectedForm(null);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      // TODO: Afficher une erreur à l'utilisateur
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleFormStatus = async (form: FormTemplate) => {
    try {
      const updatedForm = await formService.toggleFormStatus(form.id);
      setForms(prev => prev.map(f => f.id === form.id ? updatedForm : f));
    } catch (err) {
      console.error('Erreur lors du changement de statut:', err);
      // TODO: Afficher une erreur à l'utilisateur
    }
  };

  const openEditModal = (form: FormTemplate) => {
    setSelectedForm(form);
    setEditForm({
      name: form.name,
      description: form.description || '',
      purpose: form.purpose,
      type: form.type,
      active: form.active
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (form: FormTemplate) => {
    setSelectedForm(form);
    setShowDeleteModal(true);
  };

  const openPreviewModal = (form: FormTemplate) => {
    setSelectedForm(form);
    setShowPreviewModal(true);
  };

  // Gestion des champs dans le formulaire de création
  const addField = () => {
    // Pour les formulaires d'enregistrement seulement
    if (createForm.purpose === 'PRESENCE') return;

    const newField: CreateFieldData = {
      label: '',
      fieldType: 'TEXT',
      isRequired: false,
      options: [],
      order: createForm.fields.length
    };
    setCreateForm(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (index: number, field: Partial<CreateFieldData>) => {
    setCreateForm(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => i === index ? { ...f, ...field } : f)
    }));
  };

  const removeField = (index: number) => {
    setCreateForm(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  // Gestion des intervalles pour les formulaires ARRIVAL_DEPARTURE
  const addInterval = () => {
    const newInterval: CreateIntervalData = {
      startTime: '08:00',
      endTime: '18:00'
    };
    setCreateForm(prev => ({
      ...prev,
      intervals: [...prev.intervals, newInterval]
    }));
  };

  const updateInterval = (index: number, interval: Partial<CreateIntervalData>) => {
    setCreateForm(prev => ({
      ...prev,
      intervals: prev.intervals.map((i, idx) => idx === index ? { ...i, ...interval } : i)
    }));
  };

  const removeInterval = (index: number) => {
    setCreateForm(prev => ({
      ...prev,
      intervals: prev.intervals.filter((_, i) => i !== index)
    }));
  };

  const stats = {
    totalForms: forms.length,
    activeForms: forms.filter(f => f.active).length,
    totalFields: forms.reduce((sum, f) => sum + f.fieldsCount, 0),
    totalUsages: forms.reduce((sum, f) => sum + f.usagesCount, 0)
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
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Gestion des Formulaires</h1>
                  <p className="text-sm text-gray-600">Administration des formulaires d'enregistrement</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadForms}
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
                <span>Nouveau Formulaire</span>
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
                <p className="text-sm font-medium text-gray-600">Total formulaires</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalForms}</p>
              </div>
              <FileText className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Formulaires actifs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeForms}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Champs totaux</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalFields}</p>
              </div>
              <Settings className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisations totales</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsages.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Forms Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
                <p className="text-gray-600">Chargement des formulaires...</p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={loadForms}
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
                      Formulaire
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usage
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Champs
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisations
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
                  {forms.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                        Aucun formulaire créé
                      </td>
                    </tr>
                  ) : (
                    forms.map((form) => (
                      <tr key={form.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 max-w-xs align-top">
                          <div className="space-y-1">
                            <div className="text-sm font-medium text-gray-900 truncate" title={form.name}>{form.name}</div>
                            <div
                              className="text-sm text-gray-500 break-words overflow-hidden"
                              style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical' as const,
                                lineHeight: '1.25rem',
                                maxHeight: '2.5rem'
                              }}
                              title={form.description}
                            >
                              {form.description}
                            </div>
                            <div className="text-xs text-gray-400">
                              Créé le {new Date(form.createdAt).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            form.purpose === 'PRESENCE'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {form.purpose === 'PRESENCE' ? 'Présence' : 'Enregistrement'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {form.purpose === 'PRESENCE' ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              form.type === 'ARRIVAL_DEPARTURE'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {form.type === 'ARRIVAL_DEPARTURE' ? 'Arrivée/Départ' : 'Simple'}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">Aucun</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{form.fieldsCount} champs</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{form.usagesCount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            form.active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {form.active ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => openPreviewModal(form)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Aperçu du formulaire"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openEditModal(form)}
                              className="text-primary-600 hover:text-primary-800"
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleFormStatus(form)}
                              className={`${
                                form.active
                                  ? 'text-orange-600 hover:text-orange-800'
                                  : 'text-green-600 hover:text-green-800'
                              }`}
                              title={form.active ? 'Désactiver' : 'Activer'}
                            >
                              {form.active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => openDeleteModal(form)}
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

      {/* Create Form Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Créer un nouveau formulaire</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateForm} className="space-y-6">
                  {createError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {createError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du formulaire *
                      </label>
                      <input
                        type="text"
                        required
                        value={createForm.name}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Formulaire Étudiant"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={createForm.description}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Description du formulaire..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Type de formulaire *
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="formPurpose"
                            value="ENROLLMENT"
                            checked={createForm.purpose === 'ENROLLMENT'}
                            onChange={(e) => setCreateForm(prev => ({ ...prev, purpose: e.target.value as FormPurpose, type: undefined }))}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            required
                          />
                          <span className="ml-3 text-sm">
                            <span className="font-medium text-gray-900">Enregistrement</span>
                            <span className="text-gray-500 block">Collecte d'informations sur les visiteurs</span>
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="formPurpose"
                            value="PRESENCE"
                            checked={createForm.purpose === 'PRESENCE'}
                            onChange={(e) => {
                              const newPurpose = e.target.value as FormPurpose;
                              const newType = newPurpose === 'PRESENCE' ? 'ARRIVAL_DEPARTURE' : undefined; // Toujours arrivée/départ chez BENIN EXCELLENCE
                              const newFields = newPurpose === 'PRESENCE' ? [{
                                label: 'UUID du visiteur',
                                fieldType: 'TEXT' as const,
                                isRequired: true,
                                options: [],
                                order: 0
                              }] : [];
                              setCreateForm(prev => ({
                                ...prev,
                                purpose: newPurpose,
                                type: newType,
                                fields: newFields
                              }));
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            required
                          />
                          <span className="ml-3 text-sm">
                            <span className="font-medium text-gray-900">Présence</span>
                            <span className="text-gray-500 block">Marquage de présence des visiteurs</span>
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Type de présence - Masqué car toujours arrivée/départ chez BENIN EXCELLENCE */}
                    {createForm.purpose === 'PRESENCE' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-green-900">Type de présence configuré</h4>
                            <p className="text-sm text-green-700">Arrivée/Départ - Deux présences par jour avec horaires</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Champs du formulaire */}
                  <div>
                    {createForm.purpose === 'PRESENCE' ? (
                      // Pour les formulaires de présence : seulement le message informatif
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4">Configuration de présence</h4>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                          <div className="flex items-center justify-center space-x-2 text-blue-800 mb-2">
                            <CheckCircle className="w-6 h-6" />
                            <span className="font-medium text-lg">Champ automatique configuré</span>
                          </div>
                          <p className="text-blue-700 text-sm">
                            Un champ <strong>"UUID du visiteur"</strong> (requis) sera automatiquement créé pour vérifier l'identité du visiteur lors du marquage de présence.
                          </p>
                          <p className="text-blue-600 text-xs mt-2">
                            L'administrateur n'a qu'à déterminer le type de présence souhaité.
                          </p>
                        </div>
                      </div>
                    ) : (
                      // Pour les formulaires d'enregistrement : sélecteur de champs système
                      <div>
                        <h4 className="text-md font-medium text-gray-900 mb-4">Champs du formulaire</h4>
                        <SystemFieldSelector
                          availableFields={Object.values(SYSTEM_FIELDS)}
                          selectedFields={createForm.selectedSystemFields}
                          onFieldToggle={(fieldKey) => {
                            setCreateForm(prev => ({
                              ...prev,
                              selectedSystemFields: prev.selectedSystemFields.includes(fieldKey)
                                ? prev.selectedSystemFields.filter(f => f !== fieldKey)
                                : [...prev.selectedSystemFields, fieldKey]
                            }));
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Intervalles pour les formulaires ARRIVAL_DEPARTURE */}
                  {createForm.purpose === 'PRESENCE' && createForm.type === 'ARRIVAL_DEPARTURE' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-medium text-gray-900">Périodes de présence</h4>
                        <button
                          type="button"
                          onClick={addInterval}
                          className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center space-x-2 shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Ajouter une période</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {createForm.intervals.map((interval, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Heure de début *
                                </label>
                                <input
                                  type="time"
                                  required
                                  value={interval.startTime}
                                  onChange={(e) => updateInterval(index, { startTime: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Heure de fin *
                                </label>
                                <input
                                  type="time"
                                  required
                                  value={interval.endTime}
                                  onChange={(e) => updateInterval(index, { endTime: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>

                              <div className="flex items-center">
                                <button
                                  type="button"
                                  onClick={() => removeInterval(index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

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
                      disabled={creating || (createForm.purpose === 'ENROLLMENT' && createForm.selectedSystemFields.length === 0)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      {creating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Création...</span>
                        </>
                      ) : createForm.purpose === 'ENROLLMENT' && createForm.selectedSystemFields.length === 0 ? (
                        <span>Sélectionnez au moins un champ système</span>
                      ) : (
                        <span>Créer le formulaire</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form Modal */}
      {showEditModal && selectedForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Modifier le formulaire</h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleEditForm} className="space-y-4">
                  {editError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {editError}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom du formulaire *
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={editForm.description}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Usage du formulaire *
                    </label>
                    <select
                      value={editForm.purpose}
                      onChange={(e) => setEditForm(prev => ({
                        ...prev,
                        purpose: e.target.value as FormPurpose,
                        type: e.target.value === 'ENROLLMENT' ? undefined : (prev.type || 'SIMPLE_PRESENCE')
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ENROLLMENT">Enregistrement</option>
                      <option value="PRESENCE">Présence</option>
                    </select>
                  </div>

                  {editForm.purpose === 'PRESENCE' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de présence *
                      </label>
                      <select
                        value={editForm.type || 'SIMPLE_PRESENCE'}
                        onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value as FormType }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="SIMPLE_PRESENCE">Présence simple</option>
                        <option value="ARRIVAL_DEPARTURE">Arrivée/Départ</option>
                      </select>
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="active"
                      checked={editForm.active}
                      onChange={(e) => setEditForm(prev => ({ ...prev, active: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="active" className="ml-2 text-sm text-gray-700">
                      Formulaire actif
                    </label>
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

      {/* Preview Form Modal */}
      {showPreviewModal && selectedForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPreviewModal(false)} />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Aperçu du formulaire</h3>
                  </div>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                {/* Form Header */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedForm.name}</h4>
                  {selectedForm.description && (
                    <p className="text-gray-600 mb-3">{selectedForm.description}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedForm.purpose === 'PRESENCE'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {selectedForm.purpose === 'PRESENCE' ? 'Présence' : 'Enregistrement'}
                    </span>
                    {selectedForm.purpose === 'PRESENCE' && selectedForm.type && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedForm.type === 'ARRIVAL_DEPARTURE'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {selectedForm.type === 'ARRIVAL_DEPARTURE' ? 'Arrivée/Départ' : 'Simple'}
                      </span>
                    )}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedForm.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedForm.active ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="mb-6">
                  <h5 className="text-md font-medium text-gray-900 mb-4">Champs du formulaire</h5>
                  <div className="space-y-4">
                    {selectedForm.fields && selectedForm.fields.length > 0 ? (
                      selectedForm.fields.map((field, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <label className="text-sm font-medium text-gray-900">
                              {field.label}
                              {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {field.fieldType === 'TEXT' && 'Texte'}
                              {field.fieldType === 'NUMBER' && 'Nombre'}
                              {field.fieldType === 'DATE' && 'Date'}
                              {field.fieldType === 'SELECT' && 'Sélection'}
                              {field.fieldType === 'CHECKBOX' && 'Cases à cocher'}
                              {field.fieldType === 'TEXTAREA' && 'Zone de texte'}
                            </span>
                          </div>

                          {/* Field Preview */}
                          <div className="mt-2">
                            {field.fieldType === 'TEXT' && (
                              <input
                                type="text"
                                placeholder={`Saisir ${field.label.toLowerCase()}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                disabled
                              />
                            )}
                            {field.fieldType === 'NUMBER' && (
                              <input
                                type="number"
                                placeholder={`Saisir ${field.label.toLowerCase()}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                disabled
                              />
                            )}
                            {field.fieldType === 'DATE' && (
                              <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                disabled
                              />
                            )}
                            {field.fieldType === 'SELECT' && (
                              <div className="space-y-2">
                                <select className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" disabled>
                                  <option>Sélectionner une option</option>
                                  {field.options && field.options.map((option, idx) => (
                                    <option key={idx} value={option}>{option}</option>
                                  ))}
                                </select>
                                {field.options && field.options.length > 0 && (
                                  <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                                    <strong>Options disponibles :</strong> {field.options.join(', ')}
                                  </div>
                                )}
                              </div>
                            )}
                            {field.fieldType === 'CHECKBOX' && (
                              <div className="space-y-2">
                                {field.options && field.options.map((option, idx) => (
                                  <label key={idx} className="flex items-center">
                                    <input
                                      type="checkbox"
                                      className="rounded border-gray-300 text-blue-600 bg-gray-50"
                                      disabled
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{option}</span>
                                  </label>
                                ))}
                                {field.options && field.options.length > 0 && (
                                  <div className="text-xs text-gray-600 bg-green-50 p-2 rounded mt-2">
                                    <strong>Cases à cocher :</strong> {field.options.join(', ')}
                                  </div>
                                )}
                              </div>
                            )}
                            {field.fieldType === 'TEXTAREA' && (
                              <textarea
                                rows={3}
                                placeholder={`Saisir ${field.label.toLowerCase()}`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                                disabled
                              />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">Aucun champ défini</p>
                    )}
                  </div>
                </div>

                {/* Time Intervals (for ARRIVAL_DEPARTURE) */}
                {selectedForm.purpose === 'PRESENCE' && selectedForm.type === 'ARRIVAL_DEPARTURE' && selectedForm.intervals && selectedForm.intervals.length > 0 && (
                  <div className="mb-6">
                    <h5 className="text-md font-medium text-gray-900 mb-4">Périodes de présence</h5>
                    <div className="space-y-3">
                      {selectedForm.intervals.map((interval, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                          <Clock className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">
                            {interval.startTime} - {interval.endTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form Stats */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Utilisations:</span>
                      <span className="ml-2 font-medium text-gray-900">{selectedForm.usagesCount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Créé le:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {new Date(selectedForm.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Fermer l'aperçu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Form Modal */}
      {showDeleteModal && selectedForm && (
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
                    Êtes-vous sûr de vouloir supprimer le formulaire <strong>{selectedForm.name}</strong> ?
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                      <div className="text-sm text-red-700">
                        <p className="font-medium">Cette action est irréversible !</p>
                        <p className="mt-1">
                          Toutes les données de présence associées à ce formulaire seront supprimées définitivement.
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
                    onClick={handleDeleteForm}
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
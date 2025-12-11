"use client";

import { useState, useEffect } from 'react';
import { Activity, FilterOptions } from '@/lib/types';
import { storage } from '@/lib/storage';
import { ActivityForm } from '@/components/custom/activity-form';
import { ActivityList } from '@/components/custom/activity-list';
import { PomodoroTimer } from '@/components/custom/pomodoro-timer';
import { GroupSelector } from '@/components/custom/group-selector';
import { GroupManagementModal } from '@/components/custom/group-management-modal';
import { NotificationCenter } from '@/components/custom/notification-center';
import { Plus, Filter, Calendar, TrendingUp, AlertCircle, CheckCircle2, Users, User } from 'lucide-react';

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>();
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>();
  const [showGroupManagement, setShowGroupManagement] = useState(false);
  const [stats, setStats] = useState({
    todayActivities: 0,
    overdueActivities: 0,
    completedToday: 0,
    totalToday: 0,
    progressPercentage: 0,
    personalTasks: 0,
    groupTasks: 0,
  });

  // Carregar atividades
  useEffect(() => {
    loadActivities();
    // Atualizar a cada 10 segundos para simular real-time
    const interval = setInterval(loadActivities, 10000);
    return () => clearInterval(interval);
  }, []);

  // Aplicar filtros
  useEffect(() => {
    applyFilters();
  }, [activities, filters, selectedGroupId]);

  const loadActivities = () => {
    const loadedActivities = storage.getActivities();
    setActivities(loadedActivities);
    setStats(storage.getDashboardStats());
  };

  const applyFilters = () => {
    let filtered = activities;

    // Filtro de grupo/pessoal
    if (selectedGroupId) {
      filtered = filtered.filter(a => a.groupId === selectedGroupId);
    } else {
      // Mostrar apenas pessoais quando nenhum grupo selecionado
      filtered = filtered.filter(a => !a.groupId);
    }

    // Aplicar outros filtros
    if (filters.status) {
      filtered = filtered.filter(a => a.status === filters.status);
    }
    if (filters.priority) {
      filtered = filtered.filter(a => a.priority === filters.priority);
    }
    if (filters.category) {
      filtered = filtered.filter(a => a.category === filters.category);
    }
    if (filters.date) {
      filtered = filtered.filter(a => a.date === filters.date);
    }

    setFilteredActivities(filtered);
  };

  const handleAddActivity = (activityData: Omit<Activity, 'id' | 'createdAt' | 'createdBy'>) => {
    if (editingActivity) {
      storage.updateActivity(editingActivity.id, activityData);
      setEditingActivity(undefined);
    } else {
      storage.addActivity(activityData);
    }
    loadActivities();
    setShowForm(false);
  };

  const handleToggleComplete = (id: string) => {
    storage.toggleComplete(id);
    loadActivities();
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta atividade?')) {
      storage.deleteActivity(id);
      loadActivities();
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingActivity(undefined);
  };

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    if (value === 'todos' || value === '') {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    } else {
      setFilters({ ...filters, [key]: value });
    }
  };

  const handleSelectGroup = (groupId: string | undefined) => {
    setSelectedGroupId(groupId);
    setFilters({}); // Limpar outros filtros ao mudar de grupo
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              TimeFlow
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Organize seu tempo, conquiste seus objetivos
            </p>
          </div>
          <NotificationCenter />
        </header>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-blue-500" />
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats.todayActivities}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Atividades Hoje</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats.overdueActivities}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Atrasadas</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats.completedToday}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Concluídas Hoje</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-indigo-500" />
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats.progressPercentage}%
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Progresso Diário</p>
            <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tasks Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900">
                <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.personalTasks}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tarefas Pessoais</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.groupTasks}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tarefas de Grupos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Group Selector */}
        <div className="mb-8">
          <GroupSelector
            selectedGroupId={selectedGroupId}
            onSelectGroup={handleSelectGroup}
            onManageGroups={() => setShowGroupManagement(true)}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activities Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters and Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Filter className="w-6 h-6" />
                  {selectedGroupId ? 'Atividades do Grupo' : 'Minhas Atividades'}
                </h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Nova Atividade
                </button>
              </div>

              {/* Filtros */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <select
                  onChange={(e) => updateFilter('status', e.target.value)}
                  value={filters.status || 'todos'}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                >
                  <option value="todos">Todos Status</option>
                  <option value="pendente">Pendente</option>
                  <option value="concluida">Concluída</option>
                </select>

                <select
                  onChange={(e) => updateFilter('priority', e.target.value)}
                  value={filters.priority || 'todos'}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                >
                  <option value="todos">Todas Prioridades</option>
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </select>

                <select
                  onChange={(e) => updateFilter('category', e.target.value)}
                  value={filters.category || 'todos'}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                >
                  <option value="todos">Todas Categorias</option>
                  <option value="trabalho">Trabalho</option>
                  <option value="pessoal">Pessoal</option>
                  <option value="estudos">Estudos</option>
                  <option value="saude">Saúde</option>
                  <option value="outros">Outros</option>
                </select>

                <input
                  type="date"
                  onChange={(e) => updateFilter('date', e.target.value)}
                  value={filters.date || ''}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            {/* Activity List */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <ActivityList
                activities={filteredActivities}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </div>
          </div>

          {/* Pomodoro Timer */}
          <div className="lg:col-span-1">
            <PomodoroTimer />
          </div>
        </div>
      </div>

      {/* Activity Form Modal */}
      {showForm && (
        <ActivityForm
          onSubmit={handleAddActivity}
          onClose={handleCloseForm}
          initialData={editingActivity}
          preselectedGroupId={selectedGroupId}
        />
      )}

      {/* Group Management Modal */}
      {showGroupManagement && (
        <GroupManagementModal
          onClose={() => setShowGroupManagement(false)}
          onGroupsUpdated={loadActivities}
        />
      )}
    </div>
  );
}

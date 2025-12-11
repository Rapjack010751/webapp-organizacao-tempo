"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Settings, User, Bell, Palette, Shield, LogOut, Save, ArrowLeft, Moon, Sun, Monitor } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState(auth.getCurrentUser());
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Formulário de perfil
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // Formulário de senha
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Configurações de notificação
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    weeklyReport: false,
  });

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      auth.updateProfile(profileData);
      setUser(auth.getCurrentUser());
      setMessage('Perfil atualizado com sucesso!');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      auth.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setMessage('Senha alterada com sucesso!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      auth.logout();
      router.push('/login');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell },
    { id: 'appearance', label: 'Aparência', icon: Palette },
    { id: 'security', label: 'Segurança', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Settings className="w-10 h-10" />
                Configurações
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Gerencie suas preferências e conta
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium transition-colors flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              {message && (
                <div className={`mb-6 p-4 rounded-xl ${
                  message.includes('sucesso')
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                }`}>
                  {message}
                </div>
              )}

              {/* Tab: Perfil */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Informações do Perfil
                  </h2>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Salvar Alterações
                    </button>
                  </form>
                </div>
              )}

              {/* Tab: Notificações */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Preferências de Notificação
                  </h2>
                  <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {key === 'emailNotifications' && 'Notificações por Email'}
                            {key === 'pushNotifications' && 'Notificações Push'}
                            {key === 'taskReminders' && 'Lembretes de Tarefas'}
                            {key === 'weeklyReport' && 'Relatório Semanal'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {key === 'emailNotifications' && 'Receba atualizações por email'}
                            {key === 'pushNotifications' && 'Notificações no navegador'}
                            {key === 'taskReminders' && 'Alertas de tarefas pendentes'}
                            {key === 'weeklyReport' && 'Resumo semanal de produtividade'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, [key]: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Aparência */}
              {activeTab === 'appearance' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Personalização
                  </h2>
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-lg">
                            Tema da Interface
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Escolha entre claro, escuro ou automático
                          </p>
                        </div>
                        <ThemeToggle />
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-700">
                      <p className="font-medium text-gray-900 dark:text-white mb-4">
                        Visualização de Tarefas
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="p-4 rounded-xl border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium">
                          Lista
                        </button>
                        <button className="p-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-colors text-gray-700 dark:text-gray-300">
                          Grade
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Segurança */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Segurança da Conta
                  </h2>
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Senha Atual
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nova Senha
                      </label>
                      <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Confirmar Nova Senha
                      </label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center gap-2"
                    >
                      <Shield className="w-5 h-5" />
                      Alterar Senha
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

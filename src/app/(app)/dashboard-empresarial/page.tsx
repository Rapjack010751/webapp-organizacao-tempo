"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, Users, Target, TrendingUp, Calendar, Clock, CheckCircle2, AlertCircle, BarChart3, Zap } from 'lucide-react';

export default function DashboardEmpresarialPage() {
  const router = useRouter();
  const [userPreferences, setUserPreferences] = useState<any>(null);

  useEffect(() => {
    const preferences = localStorage.getItem('user_preferences');
    if (preferences) {
      setUserPreferences(JSON.parse(preferences));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Briefcase className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Dashboard Empresarial
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Gestão profissional de projetos e equipes
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Voltar ao TimeFlow
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Personalização baseada no quiz */}
        {userPreferences && (
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-blue-500" />
              Personalizado para você
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userPreferences.timeSpent?.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Foco principal:</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {userPreferences.timeSpent.join(', ')}
                  </p>
                </div>
              )}
              {userPreferences.goals?.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Objetivos:</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {userPreferences.goals.join(', ')}
                  </p>
                </div>
              )}
              {userPreferences.workStyle && (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Estilo de trabalho:</p>
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">
                    {userPreferences.workStyle}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* KPIs Empresariais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">12</span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-medium">Projetos Ativos</h3>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">+3 este mês</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">8</span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-medium">Membros da Equipe</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">100% ativos</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">87%</span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-medium">Taxa de Conclusão</h3>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">+12% vs mês anterior</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">3</span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-medium">Prazos Próximos</h3>
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">Requer atenção</p>
          </div>
        </div>

        {/* Seções principais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projetos em Andamento */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-500" />
              Projetos em Andamento
            </h2>
            <div className="space-y-4">
              {[
                { name: 'Lançamento Produto Q1', progress: 75, team: 5, deadline: '15 dias' },
                { name: 'Redesign Website', progress: 45, team: 3, deadline: '30 dias' },
                { name: 'Campanha Marketing', progress: 90, team: 4, deadline: '7 dias' },
              ].map((project, index) => (
                <div key={index} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4 inline mr-1" />
                      {project.deadline}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1">
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {project.team} membros
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Atividades Recentes */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-purple-500" />
              Atividades Recentes
            </h2>
            <div className="space-y-4">
              {[
                { action: 'Tarefa concluída', project: 'Lançamento Q1', time: '2h atrás' },
                { action: 'Reunião agendada', project: 'Redesign', time: '4h atrás' },
                { action: 'Documento atualizado', project: 'Marketing', time: '6h atrás' },
                { action: 'Membro adicionado', project: 'Lançamento Q1', time: '1d atrás' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {activity.project}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gráfico de Performance */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-green-500" />
            Performance da Equipe
          </h2>
          <div className="grid grid-cols-7 gap-2 h-48">
            {[65, 78, 82, 75, 88, 92, 85].map((value, index) => (
              <div key={index} className="flex flex-col items-center justify-end">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-indigo-600 rounded-t-lg transition-all hover:from-blue-600 hover:to-indigo-700"
                  style={{ height: `${value}%` }}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

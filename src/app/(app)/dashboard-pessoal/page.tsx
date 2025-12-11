"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, BookOpen, Dumbbell, Coffee, Target, TrendingUp, Calendar, Clock, CheckCircle2, Zap, Sun, Moon } from 'lucide-react';

export default function DashboardPessoalPage() {
  const router = useRouter();
  const [userPreferences, setUserPreferences] = useState<any>(null);

  useEffect(() => {
    const preferences = localStorage.getItem('user_preferences');
    if (preferences) {
      setUserPreferences(JSON.parse(preferences));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Dashboard Pessoal
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Seu espaço para crescimento e bem-estar
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
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-200 dark:border-pink-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Zap className="w-6 h-6 text-pink-500" />
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

        {/* Métricas Pessoais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">8</span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-medium">Hábitos Ativos</h3>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">+2 este mês</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">12h</span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-medium">Tempo de Estudo</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">Esta semana</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">5/7</span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-medium">Dias de Exercício</h3>
            <p className="text-sm text-green-600 dark:text-green-400 mt-2">Meta: 5 dias</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Coffee className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-3xl font-bold text-gray-900 dark:text-white">3.2h</span>
            </div>
            <h3 className="text-gray-600 dark:text-gray-400 font-medium">Tempo Livre</h3>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">Média diária</p>
          </div>
        </div>

        {/* Seções principais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Objetivos Pessoais */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-pink-500" />
              Objetivos Pessoais
            </h2>
            <div className="space-y-4">
              {[
                { name: 'Ler 2 livros por mês', progress: 65, icon: BookOpen, color: 'blue' },
                { name: 'Exercitar 5x por semana', progress: 85, icon: Dumbbell, color: 'green' },
                { name: 'Meditar diariamente', progress: 40, icon: Heart, color: 'pink' },
                { name: 'Aprender novo idioma', progress: 55, icon: BookOpen, color: 'purple' },
              ].map((goal, index) => {
                const Icon = goal.icon;
                return (
                  <div key={index} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg bg-${goal.color}-100 dark:bg-${goal.color}-900 flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 text-${goal.color}-600 dark:text-${goal.color}-400`} />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white flex-1">{goal.name}</h3>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r from-${goal.color}-400 to-${goal.color}-600 rounded-full transition-all`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rotina Diária */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-purple-500" />
              Rotina de Hoje
            </h2>
            <div className="space-y-4">
              {[
                { time: '07:00', activity: 'Meditação matinal', done: true, icon: Sun },
                { time: '08:30', activity: 'Exercício físico', done: true, icon: Dumbbell },
                { time: '12:00', activity: 'Leitura (30min)', done: false, icon: BookOpen },
                { time: '18:00', activity: 'Tempo com família', done: false, icon: Heart },
                { time: '21:00', activity: 'Reflexão do dia', done: false, icon: Moon },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${item.done ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-700'} transition-colors`}>
                    <div className={`w-8 h-8 rounded-lg ${item.done ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'} flex items-center justify-center`}>
                      {item.done ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${item.done ? 'text-green-700 dark:text-green-300 line-through' : 'text-gray-900 dark:text-white'}`}>
                        {item.activity}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {item.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Progresso Semanal */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            Progresso Semanal
          </h2>
          <div className="grid grid-cols-7 gap-2 h-48">
            {[45, 62, 78, 55, 88, 72, 65].map((value, index) => (
              <div key={index} className="flex flex-col items-center justify-end">
                <div
                  className="w-full bg-gradient-to-t from-pink-400 to-purple-600 rounded-t-lg transition-all hover:from-pink-500 hover:to-purple-700"
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

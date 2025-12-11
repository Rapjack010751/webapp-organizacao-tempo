'use client';

import { 
  CheckCircle2, 
  Target, 
  Clock, 
  TrendingUp, 
  Zap, 
  Users,
  Calendar,
  Trophy,
  Bell,
  Palette
} from 'lucide-react';

const features = [
  {
    icon: CheckCircle2,
    title: 'Gestão de Tarefas Inteligente',
    description: 'Organize suas tarefas com prioridades, categorias e subtarefas. Suporte completo a Markdown para descrições detalhadas.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Clock,
    title: 'Pomodoro Avançado',
    description: 'Múltiplos modos de foco (25/5, 50/10, 60/15) com estatísticas detalhadas e modo automático para máxima produtividade.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Target,
    title: 'Sistema de Hábitos',
    description: 'Crie hábitos personalizados, acompanhe streaks automáticos e visualize seu progresso semanal com gráficos intuitivos.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: TrendingUp,
    title: 'Dashboard Analítico',
    description: 'Insights automáticos, gráficos semanais e mensais, tempo total focado e taxa de conclusão por categoria.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Trophy,
    title: 'Gamificação Completa',
    description: 'Sistema de pontos, níveis, conquistas automáticas e recompensas que tornam a produtividade divertida e motivadora.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Users,
    title: 'Colaboração em Grupos',
    description: 'Crie grupos, compartilhe tarefas, gerencie permissões e trabalhe em equipe de forma eficiente.',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Bell,
    title: 'Notificações Inteligentes',
    description: 'Web Push Notifications para alertas de tarefas, lembretes do Pomodoro e notificações de conquistas desbloqueadas.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Calendar,
    title: 'Integração Google Calendar',
    description: 'Sincronize automaticamente suas tarefas com o Google Calendar e importe eventos como tarefas.',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Palette,
    title: 'Temas Personalizados',
    description: 'Escolha entre 5 temas lindos (Light, Dark, Ocean, Forest, Sunset) e personalize sua experiência.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Zap,
    title: 'PWA - Funciona Offline',
    description: 'Instale como app no seu dispositivo e continue produtivo mesmo sem internet. Sincronização automática quando voltar online.',
    gradient: 'from-cyan-500 to-blue-500',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Tudo que você precisa para
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}ser mais produtivo
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Uma plataforma completa com todas as ferramentas essenciais para organizar seu tempo, 
            criar hábitos saudáveis e alcançar seus objetivos.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
              >
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <a
              href="/app"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              Experimentar Gratuitamente
            </a>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Sem cartão de crédito • Grátis para sempre
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

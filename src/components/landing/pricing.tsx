'use client';

import { Check, Sparkles, Zap, Crown } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: 'R$ 0',
    period: '/mês',
    description: 'Perfeito para começar sua jornada de produtividade',
    icon: Sparkles,
    gradient: 'from-blue-500 to-cyan-500',
    features: [
      'Até 50 tarefas ativas',
      'Sistema de hábitos básico',
      'Pomodoro com 3 modos',
      'Dashboard com estatísticas',
      '1 grupo colaborativo',
      'Temas Light e Dark',
      'Suporte por email',
    ],
    cta: 'Começar Grátis',
    popular: false,
  },
  {
    name: 'Pro',
    price: 'R$ 19,90',
    period: '/mês',
    description: 'Para profissionais que levam produtividade a sério',
    icon: Zap,
    gradient: 'from-purple-500 to-pink-500',
    features: [
      'Tarefas ilimitadas',
      'Hábitos ilimitados',
      'Subtarefas e Markdown',
      'Grupos ilimitados',
      'Todos os 5 temas',
      'Integração Google Calendar',
      'Web Push Notifications',
      'Gamificação completa',
      'Insights avançados',
      'Exportar dados (CSV/JSON)',
      'Suporte prioritário',
      'Sem anúncios',
    ],
    cta: 'Assinar Pro',
    popular: true,
  },
  {
    name: 'Teams',
    price: 'R$ 49,90',
    period: '/mês',
    description: 'Ideal para equipes e empresas',
    icon: Crown,
    gradient: 'from-orange-500 to-red-500',
    features: [
      'Tudo do Pro',
      'Até 20 membros',
      'Grupos ilimitados',
      'Permissões avançadas',
      'Relatórios personalizados',
      'API de integração',
      'SSO (Single Sign-On)',
      'Gerenciamento centralizado',
      'Onboarding dedicado',
      'Suporte 24/7',
    ],
    cta: 'Falar com Vendas',
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Planos para todos os
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {' '}perfis
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Comece grátis e faça upgrade quando precisar de mais poder. 
            Sem taxas ocultas, cancele quando quiser.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <div
                key={index}
                className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  plan.popular
                    ? 'border-purple-500 shadow-2xl shadow-purple-500/20 scale-105 lg:scale-110'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold shadow-lg">
                      Mais Popular
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${plan.gradient} mb-6 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {plan.description}
                </p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {plan.period}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <a
                  href="/app"
                  className={`block w-full py-4 rounded-xl font-semibold text-center transition-all duration-300 mb-8 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {plan.cta}
                </a>

                {/* Features */}
                <ul className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'text-purple-600' : 'text-green-600'
                      }`} />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Note */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Todos os planos incluem atualizações gratuitas e suporte técnico.
            <br />
            <span className="font-semibold">Garantia de 30 dias</span> - não gostou? Devolvemos seu dinheiro.
          </p>
        </div>
      </div>
    </section>
  );
}

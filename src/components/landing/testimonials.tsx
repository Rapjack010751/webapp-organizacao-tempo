'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Ana Silva',
    role: 'Desenvolvedora Frontend',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    content: 'O TimeFlow transformou completamente minha rotina de trabalho. Consegui aumentar minha produtividade em 40% usando o Pomodoro e o sistema de hábitos. Simplesmente incrível!',
    rating: 5,
  },
  {
    name: 'Carlos Mendes',
    role: 'Gerente de Projetos',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    content: 'Testei várias ferramentas de produtividade, mas nenhuma se compara ao TimeFlow. A integração com Google Calendar e o sistema de grupos facilitaram muito a gestão da minha equipe.',
    rating: 5,
  },
  {
    name: 'Mariana Costa',
    role: 'Estudante de Medicina',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    content: 'Como estudante, preciso de organização máxima. O TimeFlow me ajudou a criar hábitos de estudo consistentes e acompanhar meu progresso. Minha nota melhorou significativamente!',
    rating: 5,
  },
  {
    name: 'Rafael Santos',
    role: 'Empreendedor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    content: 'A gamificação do TimeFlow é genial! Me mantém motivado todos os dias. Conquistar badges e subir de nível tornou a produtividade divertida. Recomendo para todos os empreendedores.',
    rating: 5,
  },
  {
    name: 'Juliana Oliveira',
    role: 'Designer UX/UI',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    content: 'O design do TimeFlow é impecável! Além de ser lindo, é super intuitivo. Os temas personalizados são perfeitos e a experiência mobile é excelente. Uso todos os dias!',
    rating: 5,
  },
  {
    name: 'Pedro Almeida',
    role: 'Freelancer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    content: 'Como freelancer, preciso gerenciar múltiplos projetos simultaneamente. O TimeFlow me ajuda a manter tudo organizado e priorizado. As notificações inteligentes são um diferencial.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            O que nossos usuários
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {' '}estão dizendo
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Milhares de pessoas já transformaram sua produtividade com o TimeFlow. 
            Veja o que elas têm a dizer.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { value: '4.9/5', label: 'Avaliação Média' },
            { value: '10k+', label: 'Usuários Felizes' },
            { value: '98%', label: 'Taxa de Satisfação' },
            { value: '24/7', label: 'Suporte Disponível' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

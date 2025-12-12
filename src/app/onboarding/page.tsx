"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, User, Clock, Target, Zap, Coffee, BookOpen, Dumbbell, Heart, ChevronRight, ChevronLeft, Check, Mail, Users } from 'lucide-react';

interface QuizData {
  usage: 'empresarial' | 'pessoal' | '';
  timeSpent: string[];
  goals: string[];
  challenges: string[];
  workStyle: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState<QuizData>({
    usage: '',
    timeSpent: [],
    goals: [],
    challenges: [],
    workStyle: '',
  });

  const steps = [
    {
      id: 'usage',
      title: 'Como você pretende usar o TimeFlow?',
      description: 'Isso nos ajudará a personalizar sua experiência',
      options: [
        {
          value: 'empresarial',
          icon: Briefcase,
          label: 'Uso Empresarial',
          description: 'Gerenciar projetos, equipes e tarefas profissionais',
        },
        {
          value: 'pessoal',
          icon: User,
          label: 'Uso Pessoal',
          description: 'Organizar vida pessoal, hábitos e objetivos individuais',
        },
      ],
    },
    {
      id: 'timeSpent',
      title: 'Com o que você gasta mais tempo?',
      description: 'Selecione todas as opções que se aplicam',
      multiple: true,
      options: [
        { value: 'reunioes', icon: Users, label: 'Reuniões e Calls' },
        { value: 'projetos', icon: Target, label: 'Gerenciamento de Projetos' },
        { value: 'emails', icon: Mail, label: 'E-mails e Comunicação' },
        { value: 'estudos', icon: BookOpen, label: 'Estudos e Aprendizado' },
        { value: 'exercicios', icon: Dumbbell, label: 'Exercícios e Saúde' },
        { value: 'familia', icon: Heart, label: 'Família e Relacionamentos' },
      ],
    },
    {
      id: 'goals',
      title: 'O que você gostaria de fazer com mais tempo?',
      description: 'Escolha seus principais objetivos',
      multiple: true,
      options: [
        { value: 'produtividade', icon: Zap, label: 'Aumentar Produtividade' },
        { value: 'aprender', icon: BookOpen, label: 'Aprender Coisas Novas' },
        { value: 'exercitar', icon: Dumbbell, label: 'Exercitar-se Mais' },
        { value: 'descansar', icon: Coffee, label: 'Ter Mais Tempo Livre' },
        { value: 'familia', icon: Heart, label: 'Passar Tempo com Família' },
        { value: 'hobbies', icon: Target, label: 'Dedicar-se a Hobbies' },
      ],
    },
    {
      id: 'challenges',
      title: 'Quais são seus maiores desafios?',
      description: 'Vamos te ajudar a superá-los',
      multiple: true,
      options: [
        { value: 'procrastinacao', icon: Clock, label: 'Procrastinação' },
        { value: 'foco', icon: Target, label: 'Manter o Foco' },
        { value: 'priorizar', icon: Zap, label: 'Priorizar Tarefas' },
        { value: 'equilibrio', icon: Heart, label: 'Equilíbrio Vida-Trabalho' },
        { value: 'organizacao', icon: Briefcase, label: 'Organização Geral' },
        { value: 'prazos', icon: Clock, label: 'Cumprir Prazos' },
      ],
    },
    {
      id: 'workStyle',
      title: 'Qual é seu estilo de trabalho?',
      description: 'Vamos adaptar o app para você',
      options: [
        {
          value: 'intenso',
          icon: Zap,
          label: 'Intenso e Focado',
          description: 'Prefiro sessões curtas e produtivas com pausas frequentes',
        },
        {
          value: 'equilibrado',
          icon: Target,
          label: 'Equilibrado',
          description: 'Gosto de balancear trabalho intenso com pausas regulares',
        },
        {
          value: 'flexivel',
          icon: Coffee,
          label: 'Flexível e Adaptável',
          description: 'Prefiro ajustar meu ritmo conforme a demanda do dia',
        },
      ],
    },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleSelect = (value: string) => {
    const stepId = currentStepData.id as keyof QuizData;
    
    if (currentStepData.multiple) {
      const currentValues = quizData[stepId] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      setQuizData({ ...quizData, [stepId]: newValues });
    } else {
      setQuizData({ ...quizData, [stepId]: value });
    }
  };

  const isSelected = (value: string) => {
    const stepId = currentStepData.id as keyof QuizData;
    const currentValue = quizData[stepId];
    
    if (Array.isArray(currentValue)) {
      return currentValue.includes(value);
    }
    return currentValue === value;
  };

  const canProceed = () => {
    const stepId = currentStepData.id as keyof QuizData;
    const currentValue = quizData[stepId];
    
    if (Array.isArray(currentValue)) {
      return currentValue.length > 0;
    }
    return currentValue !== '';
  };

  const handleNext = () => {
    if (isLastStep) {
      // Salvar preferências no localStorage
      localStorage.setItem('onboarding_completed', 'true');
      localStorage.setItem('user_preferences', JSON.stringify(quizData));
      
      // Redirecionar para o dashboard correto baseado na escolha do usuário
      if (quizData.usage === 'empresarial') {
        router.push('/dashboard-empresarial');
      } else if (quizData.usage === 'pessoal') {
        router.push('/dashboard-pessoal');
      } else {
        // Fallback para página principal caso não tenha escolhido
        router.push('/');
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl mb-4">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Vamos personalizar sua experiência
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Responda algumas perguntas rápidas para configurar o TimeFlow do seu jeito
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Pergunta {currentStep + 1} de {steps.length}
            </span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 mb-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {currentStepData.description}
          </p>

          {/* Options */}
          <div className={`grid gap-4 ${currentStepData.multiple ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
            {currentStepData.options.map((option) => {
              const Icon = option.icon;
              const selected = isSelected(option.value);

              return (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                    selected
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      selected
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {option.label}
                      </h3>
                      {option.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {option.description}
                        </p>
                      )}
                    </div>
                    {selected && (
                      <div className="absolute top-4 right-4">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition-colors"
          >
            Pular
          </button>

          <div className="flex gap-3">
            {!isFirstStep && (
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Voltar
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center gap-2 transform hover:scale-105 active:scale-95"
            >
              {isLastStep ? 'Finalizar' : 'Próximo'}
              {!isLastStep && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? 'w-8 bg-blue-500'
                  : index < currentStep
                  ? 'w-2 bg-blue-300'
                  : 'w-2 bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

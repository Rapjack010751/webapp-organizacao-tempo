"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff, TrendingUp, Clock, Users, BarChart3, Zap, Target } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login com email/senha
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        // Verificar se já completou onboarding
        const onboardingCompleted = localStorage.getItem('onboarding_completed');
        router.push(onboardingCompleted ? '/' : '/onboarding');
      } else {
        // Registro com email/senha
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            },
          },
        });

        if (error) throw error;

        // Novo usuário sempre vai para onboarding
        router.push('/onboarding');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao processar');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;

      // O redirecionamento será automático pelo Supabase
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login com Google');
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      alert('Por favor, digite seu email no campo acima primeiro.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      alert('Email de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (err: any) {
      alert(err.message || 'Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl flex gap-8 lg:gap-12">
        {/* Coluna Esquerda - Apresentação do Produto */}
        <div className="hidden lg:flex flex-1 flex-col justify-center space-y-8">
          {/* Frase de Impacto */}
          <div className="mb-6">
            <h2 className="text-5xl font-extrabold leading-tight mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Transforme seu tempo
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                em conquistas reais
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-xl">
              Descubra como milhares de pessoas estão recuperando horas preciosas e alcançando objetivos que pareciam impossíveis.
            </p>
          </div>

          {/* Gráfico de Impacto Visual */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Impacto Real nos Primeiros 30 Dias
            </h3>
            
            {/* Gráfico de Barras Simplificado */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Produtividade</span>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">+87%</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-[slideIn_1s_ease-out]" style={{ width: '87%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tempo Livre</span>
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400">+5.2h/semana</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-[slideIn_1.2s_ease-out]" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Objetivos Alcançados</span>
                  <span className="text-sm font-bold text-purple-600 dark:text-purple-400">+92%</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full animate-[slideIn_1.4s_ease-out]" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Estatísticas em Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-transform duration-300">
              <TrendingUp className="w-8 h-8 mb-3 opacity-90" />
              <div className="text-4xl font-bold mb-1">87%</div>
              <p className="text-sm text-green-50">
                Aumento de produtividade
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-transform duration-300">
              <Clock className="w-8 h-8 mb-3 opacity-90" />
              <div className="text-4xl font-bold mb-1">5.2h</div>
              <p className="text-sm text-blue-50">
                Tempo livre por semana
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-transform duration-300">
              <Users className="w-8 h-8 mb-3 opacity-90" />
              <div className="text-4xl font-bold mb-1">50k+</div>
              <p className="text-sm text-purple-50">
                Usuários ativos
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 shadow-xl text-white transform hover:scale-105 transition-transform duration-300">
              <Target className="w-8 h-8 mb-3 opacity-90" />
              <div className="text-4xl font-bold mb-1">92%</div>
              <p className="text-sm text-orange-50">
                Objetivos alcançados
              </p>
            </div>
          </div>

          {/* Recursos Principais */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Recursos que Fazem a Diferença
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">⏱️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Pomodoro Inteligente</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Técnica comprovada para maximizar foco e produtividade</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📊</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Analytics Detalhado</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Visualize seu progresso e identifique padrões de produtividade</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🎯</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Metas Personalizadas</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Defina objetivos e acompanhe conquistas em tempo real</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Direita - Formulário */}
        <div className="w-full lg:w-[480px]">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              TimeFlow
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Organize seu tempo, conquiste seus objetivos
            </p>
          </div>

          {/* Card de Login/Registro */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
            {/* Tabs */}
            <div className="flex gap-2 mb-8 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  isLogin
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <LogIn className="w-5 h-5 inline mr-2" />
                Entrar
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  !isLogin
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <UserPlus className="w-5 h-5 inline mr-2" />
                Registrar
              </button>
            </div>

            {/* Botão de Login Social - Apenas Google */}
            <div className="mb-6">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 transition-all flex items-center justify-center gap-3 font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar com Google
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Ou continue com email
                </span>
              </div>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Seu nome"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Senha
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Esqueceu a senha?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-shake">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/50 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    {isLogin ? <LogIn className="w-5 h-5 mr-2" /> : <UserPlus className="w-5 h-5 mr-2" />}
                    {isLogin ? 'Entrar' : 'Criar Conta'}
                  </span>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
                >
                  {isLogin ? 'Registre-se' : 'Faça login'}
                </button>
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all transform hover:scale-105">
              <div className="text-2xl mb-1">⏱️</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Pomodoro</p>
            </div>
            <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all transform hover:scale-105">
              <div className="text-2xl mb-1">📊</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Analytics</p>
            </div>
            <div className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all transform hover:scale-105">
              <div className="text-2xl mb-1">🎯</div>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Metas</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            width: 0%;
          }
          to {
            width: var(--final-width);
          }
        }
      `}</style>
    </div>
  );
}

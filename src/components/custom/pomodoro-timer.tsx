"use client";

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';

type TimerMode = 'work' | 'break';

export function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutos em segundos
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const workDuration = 25 * 60; // 25 minutos
  const breakDuration = 5 * 60; // 5 minutos

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer acabou
            setIsRunning(false);
            playNotificationSound();
            
            // Trocar modo automaticamente
            if (mode === 'work') {
              setMode('break');
              return breakDuration;
            } else {
              setMode('work');
              return workDuration;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  const playNotificationSound = () => {
    // Notificação visual (pode adicionar som depois)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(
        mode === 'work' ? 'Hora do intervalo!' : 'Hora de voltar ao trabalho!',
        {
          body: mode === 'work' 
            ? 'Faça uma pausa de 5 minutos' 
            : 'Vamos começar mais 25 minutos de foco',
          icon: '/icon.svg',
        }
      );
    }
  };

  const toggleTimer = () => {
    if (!isRunning && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? workDuration : breakDuration);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'work' ? workDuration : breakDuration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work'
    ? ((workDuration - timeLeft) / workDuration) * 100
    : ((breakDuration - timeLeft) / breakDuration) * 100;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 sm:p-8 shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Modo Foco (Pomodoro)
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Técnica de produtividade com intervalos regulares
        </p>
      </div>

      {/* Seletor de Modo */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => switchMode('work')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            mode === 'work'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
          }`}
        >
          <Zap className="w-5 h-5" />
          Trabalho (25min)
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            mode === 'break'
              ? 'bg-green-500 text-white shadow-lg'
              : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
          }`}
        >
          <Coffee className="w-5 h-5" />
          Pausa (5min)
        </button>
      </div>

      {/* Timer Display */}
      <div className="relative mb-8">
        <div className="w-48 h-48 sm:w-56 sm:h-56 mx-auto">
          {/* Círculo de progresso */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className={mode === 'work' ? 'text-blue-500' : 'text-green-500'}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          
          {/* Tempo no centro */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-100 font-mono">
                {formatTime(timeLeft)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {mode === 'work' ? 'Foco Total' : 'Relaxe'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controles */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={toggleTimer}
          className={`px-8 py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2 ${
            isRunning
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5" />
              Pausar
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Iniciar
            </>
          )}
        </button>
        <button
          onClick={resetTimer}
          className="px-6 py-4 rounded-xl font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl"
          title="Resetar"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Dica */}
      <div className="mt-6 p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          💡 <strong>Dica:</strong> Durante o foco, evite distrações. No intervalo, levante e descanse!
        </p>
      </div>
    </div>
  );
}

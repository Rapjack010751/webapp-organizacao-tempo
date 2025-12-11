"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock de atividades - depois virá do Supabase
const mockActivities = [
  {
    id: "1",
    title: "Reunião de equipe",
    date: new Date(2024, 11, 15, 10, 0),
    type: "meeting",
    color: "bg-blue-500",
  },
  {
    id: "2",
    title: "Revisar código",
    date: new Date(2024, 11, 15, 14, 30),
    type: "task",
    color: "bg-green-500",
  },
  {
    id: "3",
    title: "Exercício físico",
    date: new Date(2024, 11, 16, 7, 0),
    type: "habit",
    color: "bg-purple-500",
  },
  {
    id: "4",
    title: "Sessão Pomodoro",
    date: new Date(2024, 11, 17, 9, 0),
    type: "focus",
    color: "bg-orange-500",
  },
];

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getActivitiesForDate = (day: number) => {
    return mockActivities.filter((activity) => {
      const activityDate = activity.date;
      return (
        activityDate.getDate() === day &&
        activityDate.getMonth() === month &&
        activityDate.getFullYear() === year
      );
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  const selectedDayActivities = selectedDate
    ? getActivitiesForDate(selectedDate.getDate())
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendário</h1>
          <p className="text-muted-foreground">
            Visualize suas atividades e organize seu tempo
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Atividade
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="space-y-4">
            {/* Header do Calendário */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {MONTHS[month]} {year}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={previousMonth}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextMonth}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Grid do Calendário */}
            <div className="grid grid-cols-7 gap-2">
              {/* Dias da semana */}
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground py-2"
                >
                  {day}
                </div>
              ))}

              {/* Dias vazios antes do início do mês */}
              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square" />
              ))}

              {/* Dias do mês */}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const activities = getActivitiesForDate(day);
                const today = isToday(day);
                const selected = isSelected(day);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(year, month, day))}
                    className={cn(
                      "aspect-square p-2 rounded-lg border-2 transition-all hover:border-primary/50",
                      "flex flex-col items-center justify-start gap-1",
                      today && "border-primary bg-primary/5",
                      selected && "border-primary bg-primary/10",
                      !today && !selected && "border-transparent hover:bg-accent"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-medium",
                        today && "text-primary font-bold"
                      )}
                    >
                      {day}
                    </span>
                    {activities.length > 0 && (
                      <div className="flex gap-1 flex-wrap justify-center">
                        {activities.slice(0, 3).map((activity) => (
                          <div
                            key={activity.id}
                            className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              activity.color
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Painel lateral com atividades do dia selecionado */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">
                {selectedDate
                  ? `${selectedDate.getDate()} de ${MONTHS[selectedDate.getMonth()]}`
                  : "Selecione um dia"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedDayActivities.length} atividade(s)
              </p>
            </div>

            <div className="space-y-3">
              {selectedDayActivities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma atividade neste dia</p>
                </div>
              ) : (
                selectedDayActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full mt-1",
                          activity.color
                        )}
                      />
                      <div className="flex-1 space-y-1">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.date.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedDate && (
              <Button className="w-full gap-2" variant="outline">
                <Plus className="h-4 w-4" />
                Adicionar Atividade
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Legenda */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-muted-foreground">Reuniões</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">Tarefas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-sm text-muted-foreground">Hábitos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-sm text-muted-foreground">Foco</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

"use client";

import { Activity, Group } from '@/lib/types';
import { storage } from '@/lib/storage';
import { CheckCircle2, Circle, Trash2, Edit, Calendar, Clock, AlertCircle, Tag, Users, User } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ActivityListProps {
  activities: Activity[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (activity: Activity) => void;
}

export function ActivityList({ activities, onToggleComplete, onDelete, onEdit }: ActivityListProps) {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    setGroups(storage.getUserGroups());
  }, [activities]);

  const getPriorityColor = (priority: Activity['priority']) => {
    switch (priority) {
      case 'alta': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-300';
      case 'media': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
      case 'baixa': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
    }
  };

  const getCategoryColor = (category: Activity['category']) => {
    switch (category) {
      case 'trabalho': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
      case 'pessoal': return 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300';
      case 'estudos': return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-300';
      case 'saude': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
      case 'outros': return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getGroupName = (groupId?: string) => {
    if (!groupId) return null;
    const group = groups.find(g => g.id === groupId);
    return group?.name;
  };

  const getAssigneeNames = (assigneeIds: string[]) => {
    if (assigneeIds.length === 0) return null;
    
    const names: string[] = [];
    groups.forEach(group => {
      group.members.forEach(member => {
        if (assigneeIds.includes(member.userId)) {
          names.push(member.userName);
        }
      });
    });
    
    return names;
  };

  const canEdit = (activity: Activity) => {
    return storage.canEditActivity(activity.id);
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">Nenhuma atividade encontrada</p>
        <p className="text-sm mt-2">Crie sua primeira atividade para começar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const groupName = getGroupName(activity.groupId);
        const assigneeNames = getAssigneeNames(activity.assignees);
        const isOverdue = new Date(`${activity.date}T${activity.time}`) < new Date() && activity.status === 'pendente';

        return (
          <div
            key={activity.id}
            className={`p-5 rounded-xl border transition-all hover:shadow-lg ${
              activity.status === 'concluida'
                ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-75'
                : isOverdue
                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Checkbox */}
              <button
                onClick={() => onToggleComplete(activity.id)}
                className="flex-shrink-0 mt-1 hover:scale-110 transition-transform"
              >
                {activity.status === 'concluida' ? (
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400 hover:text-blue-500" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h3
                  className={`text-lg font-semibold mb-2 ${
                    activity.status === 'concluida'
                      ? 'line-through text-gray-500 dark:text-gray-400'
                      : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {activity.title}
                </h3>

                {/* Description */}
                {activity.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {activity.description}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {/* Date & Time */}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <Calendar className="w-3 h-3" />
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </span>

                  {/* Priority */}
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(activity.priority)}`}>
                    <AlertCircle className="w-3 h-3" />
                    {activity.priority.charAt(0).toUpperCase() + activity.priority.slice(1)}
                  </span>

                  {/* Category */}
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(activity.category)}`}>
                    <Tag className="w-3 h-3" />
                    {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                  </span>

                  {/* Duration */}
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                    <Clock className="w-3 h-3" />
                    {activity.duration} min
                  </span>

                  {/* Group Badge */}
                  {groupName && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                      <Users className="w-3 h-3" />
                      {groupName}
                    </span>
                  )}

                  {/* Personal Badge */}
                  {!activity.groupId && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                      <User className="w-3 h-3" />
                      Pessoal
                    </span>
                  )}
                </div>

                {/* Assignees */}
                {assigneeNames && assigneeNames.length > 0 && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-600 dark:text-gray-400">Atribuído para:</span>
                    <div className="flex items-center gap-1">
                      {assigneeNames.map((name, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Overdue Warning */}
                {isOverdue && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-medium">
                    <AlertCircle className="w-4 h-4" />
                    Atrasada
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex gap-2">
                {canEdit(activity) && (
                  <button
                    onClick={() => onEdit(activity)}
                    className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                )}
                {canEdit(activity) && (
                  <button
                    onClick={() => onDelete(activity.id)}
                    className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors"
                    title="Deletar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

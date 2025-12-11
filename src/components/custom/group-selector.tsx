"use client";

import { useState, useEffect } from 'react';
import { Group } from '@/lib/types';
import { storage } from '@/lib/storage';
import { Users, Plus, Settings } from 'lucide-react';

interface GroupSelectorProps {
  selectedGroupId?: string;
  onSelectGroup: (groupId: string | undefined) => void;
  onManageGroups: () => void;
}

export function GroupSelector({ selectedGroupId, onSelectGroup, onManageGroups }: GroupSelectorProps) {
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = () => {
    const userGroups = storage.getUserGroups();
    setGroups(userGroups);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onSelectGroup(undefined)}
        className={`px-4 py-2 rounded-lg font-medium transition-all ${
          !selectedGroupId
            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        }`}
      >
        Pessoal
      </button>

      {groups.map((group) => (
        <button
          key={group.id}
          onClick={() => onSelectGroup(group.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            selectedGroupId === group.id
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Users className="w-4 h-4" />
          {group.name}
        </button>
      ))}

      <button
        onClick={onManageGroups}
        className="px-4 py-2 rounded-lg font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center gap-2"
      >
        <Settings className="w-4 h-4" />
        Gerenciar
      </button>
    </div>
  );
}

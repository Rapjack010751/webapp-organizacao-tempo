"use client";

import { useState, useEffect } from 'react';
import { Group, GroupSettings } from '@/lib/types';
import { storage } from '@/lib/storage';
import { Settings, Users, Lock, CheckCircle2, Save } from 'lucide-react';

interface GroupSettingsManagerProps {
  group: Group;
  onUpdate: () => void;
}

export function GroupSettingsManager({ group, onUpdate }: GroupSettingsManagerProps) {
  const [settings, setSettings] = useState<GroupSettings>(group.settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSettings(group.settings);
    setHasChanges(false);
  }, [group]);

  const handleSettingChange = (key: keyof GroupSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setSaving(true);
    const success = storage.updateGroup(group.id, { settings });
    
    setTimeout(() => {
      setSaving(false);
      if (success) {
        setHasChanges(false);
        onUpdate();
      }
    }, 500);
  };

  const canManage = storage.canManageGroup(group.id);

  if (!canManage) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center gap-3">
          <Lock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Acesso Restrito
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Apenas proprietários e administradores podem gerenciar as configurações do grupo.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
            <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Configurações do Grupo
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Personalize o comportamento e permissões do grupo
            </p>
          </div>
        </div>

        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar Alterações
              </>
            )}
          </button>
        )}
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {/* Permissions Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Permissões de Membros
          </h4>

          <div className="space-y-4">
            <SettingToggle
              label="Membros podem convidar outros"
              description="Permite que membros comuns criem convites para o grupo"
              checked={settings.allowMembersToInvite}
              onChange={(checked) => handleSettingChange('allowMembersToInvite', checked)}
            />

            <SettingToggle
              label="Membros podem criar tarefas"
              description="Permite que membros comuns criem novas tarefas no grupo"
              checked={settings.allowMembersToCreateTasks}
              onChange={(checked) => handleSettingChange('allowMembersToCreateTasks', checked)}
            />

            <SettingToggle
              label="Requer aprovação para tarefas"
              description="Tarefas criadas por membros precisam ser aprovadas por admins"
              checked={settings.requireApprovalForTasks}
              onChange={(checked) => handleSettingChange('requireApprovalForTasks', checked)}
            />
          </div>
        </div>

        {/* Group Limits Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Limites do Grupo
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Número máximo de membros
              </label>
              <input
                type="number"
                min="2"
                max="100"
                value={settings.maxMembers}
                onChange={(e) => handleSettingChange('maxMembers', parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Atualmente: {group.members.length} / {settings.maxMembers} membros
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Dicas de Configuração
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <li>• Permita que membros convidem outros para grupos colaborativos</li>
                <li>• Ative a aprovação de tarefas para manter controle de qualidade</li>
                <li>• Ajuste o limite de membros conforme o tamanho do seu time</li>
                <li>• Revise as permissões regularmente para manter a segurança</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SettingToggleProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function SettingToggle({ label, description, checked, onChange }: SettingToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="font-medium text-gray-900 dark:text-gray-100 mb-1">
          {label}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          checked 
            ? 'bg-blue-600' 
            : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

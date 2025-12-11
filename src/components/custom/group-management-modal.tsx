"use client";

import { useState, useEffect } from 'react';
import { Group } from '@/lib/types';
import { storage } from '@/lib/storage';
import { 
  X, Plus, Users, Briefcase, FolderKanban, User, 
  UserPlus, Settings, Trash2, LogOut, ChevronRight 
} from 'lucide-react';
import { GroupMembersManager } from './group-members-manager';
import { GroupSettingsManager } from './group-settings-manager';

interface GroupManagementModalProps {
  onClose: () => void;
  onGroupsUpdated: () => void;
}

type ViewMode = 'list' | 'members' | 'settings';

export function GroupManagementModal({ onClose, onGroupsUpdated }: GroupManagementModalProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);

  // Form states
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupType, setGroupType] = useState<Group['type']>('pessoal');
  const [inviteCode, setInviteCode] = useState('');

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = () => {
    const userGroups = storage.getUserGroups();
    setGroups(userGroups);
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;

    storage.createGroup({
      name: groupName,
      description: groupDescription,
      type: groupType,
    });

    setGroupName('');
    setGroupDescription('');
    setGroupType('pessoal');
    setShowCreateForm(false);
    loadGroups();
    onGroupsUpdated();
  };

  const handleJoinGroup = () => {
    if (!inviteCode.trim()) return;

    const group = storage.joinGroup(inviteCode.toUpperCase());
    if (group) {
      setInviteCode('');
      setShowJoinForm(false);
      loadGroups();
      onGroupsUpdated();
      alert(`Você entrou no grupo "${group.name}"!`);
    } else {
      alert('Código de convite inválido ou grupo cheio!');
    }
  };

  const handleDeleteGroup = (groupId: string, groupName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o grupo "${groupName}"? Todas as tarefas do grupo serão deletadas.`)) return;

    storage.deleteGroup(groupId);
    loadGroups();
    onGroupsUpdated();
    setSelectedGroup(null);
    setViewMode('list');
  };

  const handleLeaveGroup = (groupId: string, groupName: string) => {
    if (!confirm(`Tem certeza que deseja sair do grupo "${groupName}"?`)) return;

    const success = storage.leaveGroup(groupId);
    if (success) {
      loadGroups();
      onGroupsUpdated();
      setSelectedGroup(null);
      setViewMode('list');
    } else {
      alert('Você não pode sair do grupo como proprietário. Transfira a propriedade ou exclua o grupo.');
    }
  };

  const handleSelectGroup = (group: Group, mode: ViewMode) => {
    setSelectedGroup(group);
    setViewMode(mode);
  };

  const handleBack = () => {
    setViewMode('list');
    setSelectedGroup(null);
  };

  const handleUpdate = () => {
    loadGroups();
    onGroupsUpdated();
    // Atualizar grupo selecionado
    if (selectedGroup) {
      const updated = storage.getGroups().find(g => g.id === selectedGroup.id);
      if (updated) setSelectedGroup(updated);
    }
  };

  const getGroupIcon = (type: Group['type']) => {
    switch (type) {
      case 'familiar': return <Users className="w-5 h-5" />;
      case 'empresarial': return <Briefcase className="w-5 h-5" />;
      case 'projetos': return <FolderKanban className="w-5 h-5" />;
      case 'pessoal': return <User className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {viewMode !== 'list' && (
              <button
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
            )}
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              {viewMode === 'list' && <Users className="w-6 h-6" />}
              {viewMode === 'members' && <Users className="w-6 h-6" />}
              {viewMode === 'settings' && <Settings className="w-6 h-6" />}
              {viewMode === 'list' && 'Gerenciar Grupos'}
              {viewMode === 'members' && `Membros - ${selectedGroup?.name}`}
              {viewMode === 'settings' && `Configurações - ${selectedGroup?.name}`}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {viewMode === 'list' && (
            <>
              {/* Actions */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Criar Grupo
                </button>
                <button
                  onClick={() => setShowJoinForm(!showJoinForm)}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Entrar em Grupo
                </button>
              </div>

              {/* Create Form */}
              {showCreateForm && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Criar Novo Grupo</h3>
                  
                  <input
                    type="text"
                    placeholder="Nome do grupo"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  <textarea
                    placeholder="Descrição (opcional)"
                    value={groupDescription}
                    onChange={(e) => setGroupDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />

                  <select
                    value={groupType}
                    onChange={(e) => setGroupType(e.target.value as Group['type'])}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pessoal">Pessoal</option>
                    <option value="familiar">Familiar</option>
                    <option value="empresarial">Empresarial</option>
                    <option value="projetos">Projetos</option>
                  </select>

                  <button
                    onClick={handleCreateGroup}
                    disabled={!groupName.trim()}
                    className="w-full px-4 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Criar Grupo
                  </button>
                </div>
              )}

              {/* Join Form */}
              {showJoinForm && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-6 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Entrar em Grupo</h3>
                  
                  <input
                    type="text"
                    placeholder="Código do convite"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase font-mono text-lg tracking-wider"
                  />

                  <button
                    onClick={handleJoinGroup}
                    disabled={!inviteCode.trim()}
                    className="w-full px-4 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Entrar no Grupo
                  </button>
                </div>
              )}

              {/* Groups List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Meus Grupos ({groups.length})
                </h3>
                
                {groups.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Nenhum grupo ainda</p>
                    <p className="text-sm">Crie um novo grupo ou entre usando um código de convite.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {groups.map((group) => {
                      const isOwner = storage.isGroupOwner(group.id);

                      return (
                        <div
                          key={group.id}
                          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                                {getGroupIcon(group.type)}
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                  {group.name}
                                </h4>
                                {group.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {group.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                    {group.type}
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {group.members.length} {group.members.length === 1 ? 'membro' : 'membros'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSelectGroup(group, 'members')}
                              className="flex-1 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                            >
                              <Users className="w-4 h-4" />
                              Membros
                            </button>
                            
                            {(isOwner || storage.canManageGroup(group.id)) && (
                              <button
                                onClick={() => handleSelectGroup(group, 'settings')}
                                className="flex-1 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                              >
                                <Settings className="w-4 h-4" />
                                Configurações
                              </button>
                            )}

                            {isOwner ? (
                              <button
                                onClick={() => handleDeleteGroup(group.id, group.name)}
                                className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2 text-sm font-medium"
                              >
                                <Trash2 className="w-4 h-4" />
                                Excluir
                              </button>
                            ) : (
                              <button
                                onClick={() => handleLeaveGroup(group.id, group.name)}
                                className="px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2 text-sm font-medium"
                              >
                                <LogOut className="w-4 h-4" />
                                Sair
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {viewMode === 'members' && selectedGroup && (
            <GroupMembersManager 
              group={selectedGroup} 
              onUpdate={handleUpdate}
            />
          )}

          {viewMode === 'settings' && selectedGroup && (
            <GroupSettingsManager 
              group={selectedGroup} 
              onUpdate={handleUpdate}
            />
          )}
        </div>
      </div>
    </div>
  );
}

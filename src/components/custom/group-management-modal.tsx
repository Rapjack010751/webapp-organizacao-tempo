"use client";

import { useState, useEffect } from 'react';
import { Group } from '@/lib/types';
import { storage } from '@/lib/storage';
import { X, Plus, Users, Briefcase, FolderKanban, User, Copy, Check, Trash2, UserPlus, Crown, Shield } from 'lucide-react';

interface GroupManagementModalProps {
  onClose: () => void;
  onGroupsUpdated: () => void;
}

export function GroupManagementModal({ onClose, onGroupsUpdated }: GroupManagementModalProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

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
      alert('Código de convite inválido!');
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    if (!confirm('Tem certeza que deseja excluir este grupo? Todas as tarefas do grupo serão deletadas.')) return;

    storage.deleteGroup(groupId);
    loadGroups();
    onGroupsUpdated();
    setSelectedGroup(null);
  };

  const handleLeaveGroup = (groupId: string) => {
    if (!confirm('Tem certeza que deseja sair deste grupo?')) return;

    const success = storage.leaveGroup(groupId);
    if (success) {
      loadGroups();
      onGroupsUpdated();
      setSelectedGroup(null);
    } else {
      alert('Você não pode sair do grupo como proprietário.');
    }
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getGroupIcon = (type: Group['type']) => {
    switch (type) {
      case 'familiar': return <Users className="w-5 h-5" />;
      case 'empresarial': return <Briefcase className="w-5 h-5" />;
      case 'projetos': return <FolderKanban className="w-5 h-5" />;
      case 'pessoal': return <User className="w-5 h-5" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin': return <Shield className="w-4 h-4 text-blue-500" />;
      default: return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'owner': return 'Proprietário';
      case 'admin': return 'Administrador';
      case 'member': return 'Membro';
      default: return role;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Gerenciar Grupos
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
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
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Meus Grupos ({groups.length})</h3>
            
            {groups.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Você ainda não faz parte de nenhum grupo.</p>
                <p className="text-sm mt-2">Crie um novo grupo ou entre usando um código de convite.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {groups.map((group) => {
                  const isOwner = storage.isGroupOwner(group.id);
                  const canManage = storage.canManageGroup(group.id);

                  return (
                    <div
                      key={group.id}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                            {getGroupIcon(group.type)}
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{group.name}</h4>
                            {group.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{group.description}</p>
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

                        <div className="flex gap-2">
                          {canManage && (
                            <button
                              onClick={() => copyInviteCode(group.inviteCode)}
                              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              title="Copiar código de convite"
                            >
                              {copiedCode === group.inviteCode ? (
                                <Check className="w-5 h-5 text-green-500" />
                              ) : (
                                <Copy className="w-5 h-5" />
                              )}
                            </button>
                          )}
                          {isOwner ? (
                            <button
                              onClick={() => handleDeleteGroup(group.id)}
                              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 text-red-600 transition-colors"
                              title="Excluir grupo"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleLeaveGroup(group.id)}
                              className="px-3 py-1 rounded-lg text-sm bg-red-100 dark:bg-red-900 text-red-600 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                            >
                              Sair
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Invite Code */}
                      {canManage && (
                        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Código de Convite:</p>
                          <p className="text-lg font-mono font-bold text-gray-900 dark:text-gray-100">{group.inviteCode}</p>
                        </div>
                      )}

                      {/* Members */}
                      <div>
                        <button
                          onClick={() => setSelectedGroup(selectedGroup?.id === group.id ? null : group)}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2"
                        >
                          {selectedGroup?.id === group.id ? 'Ocultar membros' : 'Ver membros'}
                        </button>

                        {selectedGroup?.id === group.id && (
                          <div className="space-y-2 mt-3">
                            {group.members.map((member) => (
                              <div
                                key={member.userId}
                                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                                    {member.userName.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{member.userName}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      Entrou em {new Date(member.joinedAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {getRoleIcon(member.role)}
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {getRoleLabel(member.role)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

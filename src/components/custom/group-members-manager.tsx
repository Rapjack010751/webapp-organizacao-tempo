"use client";

import { useState, useEffect } from 'react';
import { Group, GroupMember, Permissions } from '@/lib/types';
import { storage } from '@/lib/storage';
import { 
  Users, Crown, Shield, User, MoreVertical, 
  UserMinus, UserCog, Copy, Check, X 
} from 'lucide-react';

interface GroupMembersManagerProps {
  group: Group;
  onUpdate: () => void;
}

export function GroupMembersManager({ group, onUpdate }: GroupMembersManagerProps) {
  const [permissions, setPermissions] = useState<Permissions | null>(null);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null);
  const [showRoleMenu, setShowRoleMenu] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const perms = storage.getUserPermissions(group.id);
    setPermissions(perms);
  }, [group.id]);

  const handleRemoveMember = (userId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja remover ${userName} do grupo?`)) return;
    
    const success = storage.removeMember(group.id, userId);
    if (success) {
      onUpdate();
      setShowRoleMenu(null);
    }
  };

  const handleChangeRole = (userId: string, newRole: GroupMember['role']) => {
    const success = storage.updateMemberRole(group.id, userId, newRole);
    if (success) {
      onUpdate();
      setShowRoleMenu(null);
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(group.inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300';
      case 'admin': return 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  if (!permissions) return null;

  return (
    <div className="space-y-6">
      {/* Invite Section */}
      {permissions.canInviteMembers && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                Convide Novos Membros
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Compartilhe este código para que outras pessoas entrem no grupo
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-blue-300 dark:border-blue-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Código de Convite:</p>
              <p className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100 tracking-wider">
                {group.inviteCode}
              </p>
            </div>
            <button
              onClick={copyInviteCode}
              className="px-6 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2"
            >
              {copiedCode ? (
                <>
                  <Check className="w-5 h-5" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copiar
                </>
              )}
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>
              {group.members.length} / {group.settings.maxMembers} membros
            </span>
          </div>
        </div>
      )}

      {/* Members List */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Membros do Grupo ({group.members.length})
        </h3>

        <div className="space-y-3">
          {group.members.map((member) => {
            const isCurrentUserOwner = permissions.canChangeRoles;
            const canModifyMember = isCurrentUserOwner && member.userId !== group.ownerId;

            return (
              <div
                key={member.userId}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg">
                      {member.userName.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {member.userName}
                        </p>
                        {member.userId === group.ownerId && (
                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            Criador
                          </span>
                        )}
                      </div>
                      {member.userEmail && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {member.userEmail}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Entrou em {new Date(member.joinedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>

                    {/* Role Badge */}
                    <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 ${getRoleBadgeColor(member.role)}`}>
                      {getRoleIcon(member.role)}
                      <span className="text-sm font-medium">
                        {getRoleLabel(member.role)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  {canModifyMember && (
                    <div className="relative ml-4">
                      <button
                        onClick={() => setShowRoleMenu(showRoleMenu === member.userId ? null : member.userId)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {showRoleMenu === member.userId && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10">
                          <div className="p-2">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2">
                              Alterar Papel
                            </p>
                            
                            {member.role !== 'admin' && (
                              <button
                                onClick={() => handleChangeRole(member.userId, 'admin')}
                                className="w-full px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-left flex items-center gap-2 text-sm"
                              >
                                <Shield className="w-4 h-4 text-blue-500" />
                                <span>Promover a Admin</span>
                              </button>
                            )}
                            
                            {member.role !== 'member' && (
                              <button
                                onClick={() => handleChangeRole(member.userId, 'member')}
                                className="w-full px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-left flex items-center gap-2 text-sm"
                              >
                                <User className="w-4 h-4 text-gray-500" />
                                <span>Rebaixar a Membro</span>
                              </button>
                            )}

                            <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

                            <button
                              onClick={() => handleRemoveMember(member.userId, member.userName)}
                              className="w-full px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-left flex items-center gap-2 text-sm text-red-600"
                            >
                              <UserMinus className="w-4 h-4" />
                              <span>Remover do Grupo</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Permissions Info */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Suas Permissões Neste Grupo
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <PermissionItem 
            label="Criar tarefas" 
            granted={permissions.canCreateTasks} 
          />
          <PermissionItem 
            label="Editar tarefas" 
            granted={permissions.canEditTasks} 
          />
          <PermissionItem 
            label="Deletar tarefas" 
            granted={permissions.canDeleteTasks} 
          />
          <PermissionItem 
            label="Convidar membros" 
            granted={permissions.canInviteMembers} 
          />
          <PermissionItem 
            label="Remover membros" 
            granted={permissions.canRemoveMembers} 
          />
          <PermissionItem 
            label="Gerenciar configurações" 
            granted={permissions.canManageSettings} 
          />
        </div>
      </div>
    </div>
  );
}

function PermissionItem({ label, granted }: { label: string; granted: boolean }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
        granted 
          ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400' 
          : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
      }`}>
        {granted ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      </div>
      <span className={granted ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-500'}>
        {label}
      </span>
    </div>
  );
}

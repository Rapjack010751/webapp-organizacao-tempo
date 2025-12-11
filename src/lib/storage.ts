// Gerenciamento de dados com localStorage e simulação de real-time
import { Activity, DashboardStats, FilterOptions, Group, User, Notification, GroupMember, Invite, GroupSettings, Permissions, GroupActivityLog } from './types';

const STORAGE_KEYS = {
  ACTIVITIES: 'timeflow_activities',
  GROUPS: 'timeflow_groups',
  USER: 'timeflow_user',
  NOTIFICATIONS: 'timeflow_notifications',
  INVITES: 'timeflow_invites',
  ACTIVITY_LOGS: 'timeflow_activity_logs',
};

// Simulação de usuário atual (em produção viria do backend/auth)
const getCurrentUser = (): User => {
  if (typeof window === 'undefined') return { id: 'user-1', name: 'Usuário', email: 'user@example.com', createdAt: new Date().toISOString() };
  
  const stored = localStorage.getItem(STORAGE_KEYS.USER);
  if (stored) return JSON.parse(stored);
  
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: 'Meu Usuário',
    email: 'usuario@timeflow.com',
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  return newUser;
};

// Configurações padrão para novos grupos
const DEFAULT_GROUP_SETTINGS: GroupSettings = {
  allowMembersToInvite: true,
  allowMembersToCreateTasks: true,
  requireApprovalForTasks: false,
  maxMembers: 50,
};

export const storage = {
  // ==================== USUÁRIO ====================
  getCurrentUser,

  updateUser: (updates: Partial<User>): User => {
    const user = getCurrentUser();
    const updated = { ...user, ...updates };
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
    return updated;
  },

  // ==================== ATIVIDADES ====================
  getActivities: (): Activity[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return data ? JSON.parse(data) : [];
  },

  saveActivities: (activities: Activity[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  },

  addActivity: (activity: Omit<Activity, 'id' | 'createdAt' | 'createdBy'>): Activity => {
    const activities = storage.getActivities();
    const user = getCurrentUser();
    const newActivity: Activity = {
      ...activity,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      assignees: activity.assignees || [],
      isShared: !!activity.groupId,
      tags: activity.tags || [],
      attachments: activity.attachments || [],
      comments: activity.comments || [],
    };
    activities.push(newActivity);
    storage.saveActivities(activities);

    // Criar notificação se for tarefa de grupo
    if (newActivity.groupId) {
      storage.addNotification({
        type: 'task_created',
        title: 'Nova tarefa criada',
        message: `${user.name} criou: ${newActivity.title}`,
        groupId: newActivity.groupId,
        activityId: newActivity.id,
        userId: user.id,
      });

      // Log de atividade do grupo
      storage.addGroupActivityLog({
        groupId: newActivity.groupId,
        userId: user.id,
        userName: user.name,
        action: 'task_created',
        description: `Criou a tarefa "${newActivity.title}"`,
        metadata: { activityId: newActivity.id },
      });
    }

    return newActivity;
  },

  updateActivity: (id: string, updates: Partial<Activity>): Activity | null => {
    const activities = storage.getActivities();
    const index = activities.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    activities[index] = { ...activities[index], ...updates };
    storage.saveActivities(activities);
    return activities[index];
  },

  deleteActivity: (id: string): boolean => {
    const activities = storage.getActivities();
    const activity = activities.find(a => a.id === id);
    const filtered = activities.filter(a => a.id !== id);
    if (filtered.length === activities.length) return false;

    // Log de atividade do grupo
    if (activity?.groupId) {
      const user = getCurrentUser();
      storage.addGroupActivityLog({
        groupId: activity.groupId,
        userId: user.id,
        userName: user.name,
        action: 'task_deleted',
        description: `Deletou a tarefa "${activity.title}"`,
        metadata: { activityId: activity.id },
      });
    }

    storage.saveActivities(filtered);
    return true;
  },

  toggleComplete: (id: string): Activity | null => {
    const activities = storage.getActivities();
    const activity = activities.find(a => a.id === id);
    if (!activity) return null;

    const newStatus = activity.status === 'concluida' ? 'pendente' : 'concluida';
    const completedAt = newStatus === 'concluida' ? new Date().toISOString() : undefined;

    const updated = storage.updateActivity(id, { status: newStatus, completedAt });

    // Notificação de conclusão
    if (newStatus === 'concluida' && activity.groupId) {
      const user = getCurrentUser();
      storage.addNotification({
        type: 'task_completed',
        title: 'Tarefa concluída',
        message: `${user.name} concluiu: ${activity.title}`,
        groupId: activity.groupId,
        activityId: activity.id,
        userId: user.id,
      });

      // Log de atividade do grupo
      storage.addGroupActivityLog({
        groupId: activity.groupId,
        userId: user.id,
        userName: user.name,
        action: 'task_completed',
        description: `Concluiu a tarefa "${activity.title}"`,
        metadata: { activityId: activity.id },
      });
    }

    return updated;
  },

  filterActivities: (filters: FilterOptions): Activity[] => {
    let activities = storage.getActivities();
    const user = getCurrentUser();

    // Filtro de escopo (pessoal/grupos)
    if (filters.scope === 'personal') {
      activities = activities.filter(a => !a.groupId);
    } else if (filters.scope === 'groups') {
      activities = activities.filter(a => !!a.groupId);
    }

    if (filters.status) {
      activities = activities.filter(a => a.status === filters.status);
    }
    if (filters.priority) {
      activities = activities.filter(a => a.priority === filters.priority);
    }
    if (filters.category) {
      activities = activities.filter(a => a.category === filters.category);
    }
    if (filters.date) {
      activities = activities.filter(a => a.date === filters.date);
    }
    if (filters.groupId) {
      activities = activities.filter(a => a.groupId === filters.groupId);
    }
    if (filters.assignee) {
      activities = activities.filter(a => a.assignees.includes(filters.assignee));
    }
    if (filters.tags && filters.tags.length > 0) {
      activities = activities.filter(a => 
        filters.tags!.some(tag => a.tags?.includes(tag))
      );
    }

    return activities;
  },

  getDashboardStats: (): DashboardStats => {
    const activities = storage.getActivities();
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();

    const todayActivities = activities.filter(a => a.date === today);
    const completedToday = todayActivities.filter(a => a.status === 'concluida').length;
    
    const overdueActivities = activities.filter(a => {
      if (a.status === 'concluida') return false;
      const activityDate = new Date(`${a.date}T${a.time}`);
      return activityDate < now;
    }).length;

    const progressPercentage = todayActivities.length > 0 
      ? Math.round((completedToday / todayActivities.length) * 100)
      : 0;

    const personalTasks = activities.filter(a => !a.groupId && a.status === 'pendente').length;
    const groupTasks = activities.filter(a => !!a.groupId && a.status === 'pendente').length;

    // Estatísticas semanais
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekActivities = activities.filter(a => new Date(a.date) >= weekStart);
    const weekCompleted = weekActivities.filter(a => a.status === 'concluida').length;
    const weeklyProgress = weekActivities.length > 0 
      ? Math.round((weekCompleted / weekActivities.length) * 100)
      : 0;

    return {
      todayActivities: todayActivities.length,
      overdueActivities,
      completedToday,
      totalToday: todayActivities.length,
      progressPercentage,
      personalTasks,
      groupTasks,
      weeklyProgress,
    };
  },

  // ==================== GRUPOS ====================
  getGroups: (): Group[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.GROUPS);
    return data ? JSON.parse(data) : [];
  },

  saveGroups: (groups: Group[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.GROUPS, JSON.stringify(groups));
  },

  createGroup: (data: { name: string; description: string; type: Group['type'] }): Group => {
    const groups = storage.getGroups();
    const user = getCurrentUser();
    
    const newGroup: Group = {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      type: data.type,
      ownerId: user.id,
      inviteCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      members: [{
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        role: 'owner',
        joinedAt: new Date().toISOString(),
      }],
      settings: { ...DEFAULT_GROUP_SETTINGS },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    groups.push(newGroup);
    storage.saveGroups(groups);

    // Criar convite permanente
    storage.createInvite(newGroup.id, undefined, 999);

    return newGroup;
  },

  updateGroup: (id: string, updates: Partial<Group>): Group | null => {
    const groups = storage.getGroups();
    const index = groups.findIndex(g => g.id === id);
    if (index === -1) return null;

    groups[index] = { 
      ...groups[index], 
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    storage.saveGroups(groups);

    // Log de atividade
    if (updates.settings) {
      const user = getCurrentUser();
      storage.addGroupActivityLog({
        groupId: id,
        userId: user.id,
        userName: user.name,
        action: 'settings_changed',
        description: 'Atualizou as configurações do grupo',
      });
    }

    return groups[index];
  },

  deleteGroup: (id: string): boolean => {
    const groups = storage.getGroups();
    const filtered = groups.filter(g => g.id !== id);
    if (filtered.length === groups.length) return false;

    // Deletar atividades do grupo
    const activities = storage.getActivities();
    const filteredActivities = activities.filter(a => a.groupId !== id);
    storage.saveActivities(filteredActivities);

    // Deletar convites do grupo
    const invites = storage.getInvites();
    const filteredInvites = invites.filter(i => i.groupId !== id);
    localStorage.setItem(STORAGE_KEYS.INVITES, JSON.stringify(filteredInvites));

    storage.saveGroups(filtered);
    return true;
  },

  joinGroup: (inviteCode: string): Group | null => {
    const groups = storage.getGroups();
    const group = groups.find(g => g.inviteCode === inviteCode);
    if (!group) return null;

    const user = getCurrentUser();
    
    // Verificar se já é membro
    if (group.members.some(m => m.userId === user.id)) {
      return group;
    }

    // Verificar limite de membros
    if (group.members.length >= group.settings.maxMembers) {
      return null;
    }

    const newMember: GroupMember = {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      role: 'member',
      joinedAt: new Date().toISOString(),
    };

    group.members.push(newMember);
    storage.updateGroup(group.id, { members: group.members });

    // Notificação
    storage.addNotification({
      type: 'member_joined',
      title: 'Novo membro',
      message: `${user.name} entrou no grupo ${group.name}`,
      groupId: group.id,
      userId: user.id,
    });

    // Log de atividade
    storage.addGroupActivityLog({
      groupId: group.id,
      userId: user.id,
      userName: user.name,
      action: 'member_joined',
      description: 'Entrou no grupo',
    });

    return group;
  },

  leaveGroup: (groupId: string): boolean => {
    const groups = storage.getGroups();
    const group = groups.find(g => g.id === groupId);
    if (!group) return false;

    const user = getCurrentUser();
    
    // Owner não pode sair
    if (group.ownerId === user.id) return false;

    group.members = group.members.filter(m => m.userId !== user.id);
    storage.updateGroup(groupId, { members: group.members });

    // Log de atividade
    storage.addGroupActivityLog({
      groupId: groupId,
      userId: user.id,
      userName: user.name,
      action: 'member_left',
      description: 'Saiu do grupo',
    });

    return true;
  },

  removeMember: (groupId: string, userId: string): boolean => {
    const groups = storage.getGroups();
    const group = groups.find(g => g.id === groupId);
    if (!group) return false;

    const currentUser = getCurrentUser();
    const member = group.members.find(m => m.userId === userId);
    if (!member) return false;

    // Não pode remover o owner
    if (userId === group.ownerId) return false;

    // Verificar permissões
    if (!storage.canManageGroup(groupId)) return false;

    group.members = group.members.filter(m => m.userId !== userId);
    storage.updateGroup(groupId, { members: group.members });

    // Notificação
    storage.addNotification({
      type: 'member_removed',
      title: 'Membro removido',
      message: `${member.userName} foi removido do grupo ${group.name}`,
      groupId: groupId,
      userId: currentUser.id,
    });

    // Log de atividade
    storage.addGroupActivityLog({
      groupId: groupId,
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'member_removed',
      description: `Removeu ${member.userName} do grupo`,
      metadata: { removedUserId: userId },
    });

    return true;
  },

  updateMemberRole: (groupId: string, userId: string, role: GroupMember['role']): boolean => {
    const groups = storage.getGroups();
    const group = groups.find(g => g.id === groupId);
    if (!group) return false;

    const member = group.members.find(m => m.userId === userId);
    if (!member) return false;

    // Não pode mudar role do owner
    if (userId === group.ownerId) return false;

    // Verificar permissões
    if (!storage.isGroupOwner(groupId)) return false;

    const oldRole = member.role;
    member.role = role;
    storage.updateGroup(groupId, { members: group.members });

    // Notificação
    const currentUser = getCurrentUser();
    storage.addNotification({
      type: 'role_changed',
      title: 'Papel alterado',
      message: `${member.userName} agora é ${role} no grupo ${group.name}`,
      groupId: groupId,
      userId: currentUser.id,
    });

    // Log de atividade
    storage.addGroupActivityLog({
      groupId: groupId,
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'role_changed',
      description: `Alterou o papel de ${member.userName} de ${oldRole} para ${role}`,
      metadata: { targetUserId: userId, oldRole, newRole: role },
    });

    return true;
  },

  getUserGroups: (): Group[] => {
    const user = getCurrentUser();
    const groups = storage.getGroups();
    return groups.filter(g => g.members.some(m => m.userId === user.id));
  },

  // ==================== CONVITES ====================
  getInvites: (): Invite[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.INVITES);
    return data ? JSON.parse(data) : [];
  },

  createInvite: (groupId: string, expiresInDays?: number, maxUses?: number): Invite | null => {
    const group = storage.getGroups().find(g => g.id === groupId);
    if (!group) return null;

    const user = getCurrentUser();
    const invites = storage.getInvites();

    const expiresAt = new Date();
    if (expiresInDays) {
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 10); // 10 anos para convites permanentes
    }

    const newInvite: Invite = {
      id: crypto.randomUUID(),
      code: group.inviteCode,
      groupId: groupId,
      groupName: group.name,
      createdBy: user.id,
      createdByName: user.name,
      expiresAt: expiresAt.toISOString(),
      maxUses: maxUses,
      currentUses: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    invites.push(newInvite);
    localStorage.setItem(STORAGE_KEYS.INVITES, JSON.stringify(invites));

    // Notificação
    storage.addNotification({
      type: 'invite_created',
      title: 'Convite criado',
      message: `Novo convite criado para o grupo ${group.name}`,
      groupId: groupId,
      userId: user.id,
    });

    return newInvite;
  },

  getGroupInvites: (groupId: string): Invite[] => {
    const invites = storage.getInvites();
    const now = new Date();
    
    return invites.filter(i => 
      i.groupId === groupId && 
      i.isActive && 
      new Date(i.expiresAt) > now &&
      (!i.maxUses || i.currentUses < i.maxUses)
    );
  },

  deactivateInvite: (inviteId: string): boolean => {
    const invites = storage.getInvites();
    const invite = invites.find(i => i.id === inviteId);
    if (!invite) return false;

    invite.isActive = false;
    localStorage.setItem(STORAGE_KEYS.INVITES, JSON.stringify(invites));
    return true;
  },

  // ==================== NOTIFICAÇÕES ====================
  getNotifications: (): Notification[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return data ? JSON.parse(data) : [];
  },

  addNotification: (data: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification => {
    const notifications = storage.getNotifications();
    const newNotification: Notification = {
      ...data,
      id: crypto.randomUUID(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    notifications.unshift(newNotification);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications.slice(0, 50))); // Manter últimas 50
    return newNotification;
  },

  markNotificationAsRead: (id: string): boolean => {
    const notifications = storage.getNotifications();
    const notification = notifications.find(n => n.id === id);
    if (!notification) return false;
    
    notification.read = true;
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    return true;
  },

  markAllAsRead: (): void => {
    const notifications = storage.getNotifications();
    notifications.forEach(n => n.read = true);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  },

  getUnreadCount: (): number => {
    return storage.getNotifications().filter(n => !n.read).length;
  },

  // ==================== LOGS DE ATIVIDADE ====================
  getActivityLogs: (): GroupActivityLog[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
    return data ? JSON.parse(data) : [];
  },

  addGroupActivityLog: (data: Omit<GroupActivityLog, 'id' | 'createdAt'>): GroupActivityLog => {
    const logs = storage.getActivityLogs();
    const newLog: GroupActivityLog = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    logs.unshift(newLog);
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(logs.slice(0, 100))); // Manter últimos 100
    return newLog;
  },

  getGroupActivityLogs: (groupId: string, limit: number = 20): GroupActivityLog[] => {
    const logs = storage.getActivityLogs();
    return logs.filter(l => l.groupId === groupId).slice(0, limit);
  },

  // ==================== PERMISSÕES ====================
  getUserPermissions: (groupId: string): Permissions => {
    const group = storage.getGroups().find(g => g.id === groupId);
    if (!group) {
      return {
        canCreateTasks: false,
        canEditTasks: false,
        canDeleteTasks: false,
        canInviteMembers: false,
        canRemoveMembers: false,
        canChangeRoles: false,
        canManageSettings: false,
        canDeleteGroup: false,
      };
    }

    const user = getCurrentUser();
    const member = group.members.find(m => m.userId === user.id);
    if (!member) {
      return {
        canCreateTasks: false,
        canEditTasks: false,
        canDeleteTasks: false,
        canInviteMembers: false,
        canRemoveMembers: false,
        canChangeRoles: false,
        canManageSettings: false,
        canDeleteGroup: false,
      };
    }

    const isOwner = member.role === 'owner';
    const isAdmin = member.role === 'admin';
    const isMember = member.role === 'member';

    return {
      canCreateTasks: isOwner || isAdmin || (isMember && group.settings.allowMembersToCreateTasks),
      canEditTasks: isOwner || isAdmin,
      canDeleteTasks: isOwner || isAdmin,
      canInviteMembers: isOwner || isAdmin || (isMember && group.settings.allowMembersToInvite),
      canRemoveMembers: isOwner || isAdmin,
      canChangeRoles: isOwner,
      canManageSettings: isOwner || isAdmin,
      canDeleteGroup: isOwner,
    };
  },

  canEditActivity: (activityId: string): boolean => {
    const activity = storage.getActivities().find(a => a.id === activityId);
    if (!activity) return false;

    const user = getCurrentUser();
    
    // Criador pode editar
    if (activity.createdBy === user.id) return true;

    // Se for tarefa de grupo, verificar permissões
    if (activity.groupId) {
      const permissions = storage.getUserPermissions(activity.groupId);
      return permissions.canEditTasks;
    }

    return false;
  },

  canManageGroup: (groupId: string): boolean => {
    const permissions = storage.getUserPermissions(groupId);
    return permissions.canManageSettings;
  },

  isGroupOwner: (groupId: string): boolean => {
    const group = storage.getGroups().find(g => g.id === groupId);
    if (!group) return false;

    const user = getCurrentUser();
    return group.ownerId === user.id;
  },
};

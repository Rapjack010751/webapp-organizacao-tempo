// Gerenciamento de dados com localStorage e simulação de real-time
import { Activity, DashboardStats, FilterOptions, Group, User, Notification, GroupMember, Invite } from './types';

const STORAGE_KEYS = {
  ACTIVITIES: 'timeflow_activities',
  GROUPS: 'timeflow_groups',
  USER: 'timeflow_user',
  NOTIFICATIONS: 'timeflow_notifications',
  INVITES: 'timeflow_invites',
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
    const filtered = activities.filter(a => a.id !== id);
    if (filtered.length === activities.length) return false;
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

    return {
      todayActivities: todayActivities.length,
      overdueActivities,
      completedToday,
      totalToday: todayActivities.length,
      progressPercentage,
      personalTasks,
      groupTasks,
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
        role: 'owner',
        joinedAt: new Date().toISOString(),
      }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    groups.push(newGroup);
    storage.saveGroups(groups);
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

    const newMember: GroupMember = {
      userId: user.id,
      userName: user.name,
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
    return true;
  },

  updateMemberRole: (groupId: string, userId: string, role: GroupMember['role']): boolean => {
    const groups = storage.getGroups();
    const group = groups.find(g => g.id === groupId);
    if (!group) return false;

    const member = group.members.find(m => m.userId === userId);
    if (!member) return false;

    member.role = role;
    storage.updateGroup(groupId, { members: group.members });
    return true;
  },

  getUserGroups: (): Group[] => {
    const user = getCurrentUser();
    const groups = storage.getGroups();
    return groups.filter(g => g.members.some(m => m.userId === user.id));
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

  getUnreadCount: (): number => {
    return storage.getNotifications().filter(n => !n.read).length;
  },

  // ==================== PERMISSÕES ====================
  canEditActivity: (activityId: string): boolean => {
    const activity = storage.getActivities().find(a => a.id === activityId);
    if (!activity) return false;

    const user = getCurrentUser();
    
    // Criador pode editar
    if (activity.createdBy === user.id) return true;

    // Se for tarefa de grupo, verificar permissões
    if (activity.groupId) {
      const group = storage.getGroups().find(g => g.id === activity.groupId);
      if (!group) return false;

      const member = group.members.find(m => m.userId === user.id);
      if (!member) return false;

      // Owner e Admin podem editar qualquer tarefa do grupo
      return member.role === 'owner' || member.role === 'admin';
    }

    return false;
  },

  canManageGroup: (groupId: string): boolean => {
    const group = storage.getGroups().find(g => g.id === groupId);
    if (!group) return false;

    const user = getCurrentUser();
    const member = group.members.find(m => m.userId === user.id);
    if (!member) return false;

    return member.role === 'owner' || member.role === 'admin';
  },

  isGroupOwner: (groupId: string): boolean => {
    const group = storage.getGroups().find(g => g.id === groupId);
    if (!group) return false;

    const user = getCurrentUser();
    return group.ownerId === user.id;
  },
};

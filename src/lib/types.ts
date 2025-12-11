// Tipos e interfaces do sistema de gerenciamento de atividades

export type Priority = 'baixa' | 'media' | 'alta';
export type Category = 'trabalho' | 'pessoal' | 'estudos' | 'saude' | 'outros';
export type Status = 'pendente' | 'concluida';
export type GroupType = 'familiar' | 'empresarial' | 'projetos' | 'pessoal';
export type UserRole = 'owner' | 'admin' | 'member';
export type NotificationType = 'member_joined' | 'task_created' | 'task_completed' | 'pomodoro_started' | 'task_assigned' | 'invite_created' | 'member_removed' | 'role_changed';

// Usuário
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

// Grupo
export interface Group {
  id: string;
  name: string;
  description: string;
  type: GroupType;
  ownerId: string;
  inviteCode: string;
  members: GroupMember[];
  settings: GroupSettings;
  createdAt: string;
  updatedAt: string;
}

// Configurações do grupo
export interface GroupSettings {
  allowMembersToInvite: boolean;
  allowMembersToCreateTasks: boolean;
  requireApprovalForTasks: boolean;
  maxMembers: number;
}

// Membro do grupo
export interface GroupMember {
  userId: string;
  userName: string;
  userEmail?: string;
  role: UserRole;
  joinedAt: string;
  invitedBy?: string;
}

// Atividade/Tarefa
export interface Activity {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  time: string; // HH:mm format
  priority: Priority;
  category: Category;
  duration: number; // em minutos
  status: Status;
  createdAt: string;
  completedAt?: string;
  
  // Campos para colaboração
  groupId?: string; // Se pertence a um grupo
  createdBy: string; // ID do usuário que criou
  assignees: string[]; // IDs dos usuários atribuídos
  isShared: boolean; // Se é compartilhada ou pessoal
  
  // Campos adicionais
  tags?: string[];
  attachments?: string[];
  comments?: ActivityComment[];
}

// Comentário em atividade
export interface ActivityComment {
  id: string;
  activityId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

// Notificação
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  groupId?: string;
  activityId?: string;
  userId: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

// Estatísticas do Dashboard
export interface DashboardStats {
  todayActivities: number;
  overdueActivities: number;
  completedToday: number;
  totalToday: number;
  progressPercentage: number;
  personalTasks: number;
  groupTasks: number;
  weeklyProgress?: number;
  monthlyProgress?: number;
}

// Opções de filtro
export interface FilterOptions {
  status?: Status;
  priority?: Priority;
  category?: Category;
  date?: string;
  groupId?: string;
  assignee?: string;
  scope?: 'personal' | 'groups' | 'all';
  tags?: string[];
}

// Estado do Pomodoro
export interface PomodoroState {
  isActive: boolean;
  timeLeft: number;
  isBreak: boolean;
  userId: string;
  activityId?: string;
  groupId?: string;
  sessionCount?: number;
}

// Convite
export interface Invite {
  id: string;
  code: string;
  groupId: string;
  groupName: string;
  createdBy: string;
  createdByName: string;
  expiresAt: string;
  maxUses?: number;
  currentUses: number;
  isActive: boolean;
  createdAt: string;
}

// Histórico de atividades do grupo
export interface GroupActivityLog {
  id: string;
  groupId: string;
  userId: string;
  userName: string;
  action: 'member_joined' | 'member_left' | 'member_removed' | 'role_changed' | 'task_created' | 'task_completed' | 'task_deleted' | 'settings_changed';
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// Permissões
export interface Permissions {
  canCreateTasks: boolean;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  canInviteMembers: boolean;
  canRemoveMembers: boolean;
  canChangeRoles: boolean;
  canManageSettings: boolean;
  canDeleteGroup: boolean;
}

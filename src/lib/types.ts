// Tipos e interfaces do sistema de gerenciamento de atividades

export type Priority = 'baixa' | 'media' | 'alta';
export type Category = 'trabalho' | 'pessoal' | 'estudos' | 'saude' | 'outros';
export type Status = 'pendente' | 'concluida';
export type GroupType = 'familiar' | 'empresarial' | 'projetos' | 'pessoal';
export type UserRole = 'owner' | 'admin' | 'member';
export type NotificationType = 'member_joined' | 'task_created' | 'task_completed' | 'pomodoro_started' | 'task_assigned';

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
  createdAt: string;
  updatedAt: string;
}

// Membro do grupo
export interface GroupMember {
  userId: string;
  userName: string;
  role: UserRole;
  joinedAt: string;
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
}

// Estado do Pomodoro
export interface PomodoroState {
  isActive: boolean;
  timeLeft: number;
  isBreak: boolean;
  userId: string;
  activityId?: string;
  groupId?: string;
}

// Convite
export interface Invite {
  code: string;
  groupId: string;
  groupName: string;
  expiresAt: string;
  createdBy: string;
}

// Sistema de autenticação simples (localStorage)
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const AUTH_KEY = 'timeflow_auth';
const USERS_KEY = 'timeflow_users';

export const auth = {
  // Registrar novo usuário
  register: (name: string, email: string, password: string): User => {
    const users = auth.getAllUsers();
    
    // Verificar se email já existe
    if (users.find(u => u.email === email)) {
      throw new Error('Email já cadastrado');
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      createdAt: new Date().toISOString(),
    };

    // Salvar usuário
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    // Salvar senha (em produção, usar hash)
    const passwords = JSON.parse(localStorage.getItem('timeflow_passwords') || '{}');
    passwords[email] = password;
    localStorage.setItem('timeflow_passwords', JSON.stringify(passwords));

    // Fazer login automático
    auth.login(email, password);

    return newUser;
  },

  // Login
  login: (email: string, password: string): User => {
    const users = auth.getAllUsers();
    const passwords = JSON.parse(localStorage.getItem('timeflow_passwords') || '{}');

    const user = users.find(u => u.email === email);
    
    if (!user || passwords[email] !== password) {
      throw new Error('Email ou senha incorretos');
    }

    // Salvar sessão
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));

    return user;
  },

  // Logout
  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  // Obter usuário atual
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Verificar se está autenticado
  isAuthenticated: (): boolean => {
    return !!auth.getCurrentUser();
  },

  // Atualizar perfil
  updateProfile: (updates: Partial<User>): User => {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) throw new Error('Usuário não autenticado');

    const users = auth.getAllUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex === -1) throw new Error('Usuário não encontrado');

    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;

    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));

    return updatedUser;
  },

  // Obter todos os usuários
  getAllUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Alterar senha
  changePassword: (currentPassword: string, newPassword: string): void => {
    const user = auth.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');

    const passwords = JSON.parse(localStorage.getItem('timeflow_passwords') || '{}');
    
    if (passwords[user.email] !== currentPassword) {
      throw new Error('Senha atual incorreta');
    }

    passwords[user.email] = newPassword;
    localStorage.setItem('timeflow_passwords', JSON.stringify(passwords));
  },
};

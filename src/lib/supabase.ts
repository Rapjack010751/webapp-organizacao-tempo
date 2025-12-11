import { createClient } from '@supabase/supabase-js';

// Variáveis de ambiente do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validação rigorosa das credenciais
const isValidSupabaseUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    // URL válida do Supabase deve terminar com .supabase.co
    return urlObj.hostname.endsWith('.supabase.co');
  } catch {
    return false;
  }
};

const isValidSupabaseKey = (key: string): boolean => {
  if (!key) return false;
  // Anon key do Supabase é um JWT que começa com "eyJ"
  return key.startsWith('eyJ') && key.length > 100;
};

// Verificar se credenciais são válidas
const hasValidCredentials = isValidSupabaseUrl(supabaseUrl) && isValidSupabaseKey(supabaseAnonKey);

// Log de aviso se credenciais inválidas
if (!hasValidCredentials) {
  console.warn('⚠️ Supabase não configurado corretamente.');
  console.warn('📋 Para configurar:');
  console.warn('   1. Acesse: Configurações do Projeto → Integrações → Supabase');
  console.warn('   2. Ou conecte sua conta Supabase via OAuth');
  console.warn('');
  console.warn('🔗 URL deve ser: https://seu-projeto.supabase.co');
  console.warn('🔑 Anon Key deve começar com: eyJ...');
}

// Cliente Supabase - só cria se credenciais válidas
export const supabase = hasValidCredentials
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : createClient(
      'https://placeholder.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder',
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

// Função helper para verificar se Supabase está configurado
export const isSupabaseConfigured = (): boolean => {
  return hasValidCredentials;
};

// Tipos do banco de dados
export type Database = {
  public: {
    Tables: {
      groups: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          owner_id: string;
          created_at: string;
          updated_at: string;
          max_members: number;
          is_public: boolean;
          invite_code: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
          max_members?: number;
          is_public?: boolean;
          invite_code?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          owner_id?: string;
          created_at?: string;
          updated_at?: string;
          max_members?: number;
          is_public?: boolean;
          invite_code?: string;
        };
      };
      group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member';
          joined_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          role?: 'owner' | 'admin' | 'member';
          joined_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          user_id?: string;
          role?: 'owner' | 'admin' | 'member';
          joined_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          group_id: string;
          title: string;
          description: string | null;
          assigned_to: string | null;
          status: 'pending' | 'in_progress' | 'completed';
          priority: 'low' | 'medium' | 'high';
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          title: string;
          description?: string | null;
          assigned_to?: string | null;
          status?: 'pending' | 'in_progress' | 'completed';
          priority?: 'low' | 'medium' | 'high';
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          title?: string;
          description?: string | null;
          assigned_to?: string | null;
          status?: 'pending' | 'in_progress' | 'completed';
          priority?: 'low' | 'medium' | 'high';
          due_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

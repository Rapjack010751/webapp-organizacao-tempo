import { createClient } from '@supabase/supabase-js';

// Variáveis de ambiente do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Cliente Supabase para uso no cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          usage_type: 'personal' | 'business';
          industry: string | null;
          team_size: string | null;
          goals: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          usage_type: 'personal' | 'business';
          industry?: string | null;
          team_size?: string | null;
          goals?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          usage_type?: 'personal' | 'business';
          industry?: string | null;
          team_size?: string | null;
          goals?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

// Função para buscar preferências do usuário
export async function getUserPreferences(userId: string) {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Erro ao buscar preferências:', error);
    return null;
  }

  return data;
}

// Função para salvar preferências do usuário
export async function saveUserPreferences(preferences: {
  user_id: string;
  usage_type: 'personal' | 'business';
  industry?: string;
  team_size?: string;
  goals?: string[];
}) {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert(preferences, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    console.error('Erro ao salvar preferências:', error);
    return null;
  }

  return data;
}

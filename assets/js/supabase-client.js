// Cliente Supabase Centralizado para o projeto Laboratório Lavorato
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Tenta obter credenciais do Vite (env), do LocalStorage (dinâmico) ou usa as credenciais padrão do projeto
const defaultUrl = 'https://vfilmjjotmhqfnfielyo.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmaWxtampvdG1ocWZuZmllbHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMjAxNDksImV4cCI6MjA5NjU5NjE0OX0.ccuSCXGooX1WY8K27Gv0ZKtrmY3mxNrNVQkNANFMlBo';

const supabaseUrl = (import.meta.env && import.meta.env.VITE_SUPABASE_URL)
  || localStorage.getItem('supabase_url')
  || defaultUrl;

const supabaseAnonKey = (import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY)
  || localStorage.getItem('supabase_anon_key')
  || defaultKey;

export const isSupabaseConfigured = () => {
    return supabaseUrl && supabaseAnonKey;
};

// Inicializa o cliente se as credenciais existirem, caso contrário retorna null
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isEmailAuthorized = async (email) => {
    if (!email) return false;
    if (!isSupabaseConfigured() || !supabase) {
        // Fallback local de desenvolvimento caso o Supabase não esteja conectado
        const localAllowed = [
            'admin@laboratoriolavorato.com.br',
            'pedrodelpra@gmail.com',
            'laboratoriolavorato@hotmail.com'
        ];
        return localAllowed.includes(email.trim().toLowerCase());
    }
    try {
        const { data, error } = await supabase
            .from('authorized_admins')
            .select('email')
            .eq('email', email.trim().toLowerCase())
            .maybeSingle();
        if (error) {
            console.error("Erro ao validar admin no banco:", error);
            return false;
        }
        return !!data;
    } catch (e) {
        console.error("Erro de rede ao validar admin:", e);
        return false;
    }
};

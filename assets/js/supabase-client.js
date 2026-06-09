// Cliente Supabase Centralizado para o projeto Laboratório Lavorato
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Tenta obter credenciais do Vite (env) ou do LocalStorage (dinâmico)
const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL)
  || localStorage.getItem('supabase_url')
  || '';

const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY)
  || localStorage.getItem('supabase_anon_key')
  || '';

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

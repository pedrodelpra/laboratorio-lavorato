-- ==============================================================================
-- SCRIPT DE CRIAÇÃO DA TABELA DE CONFIGURAÇÕES DO SITE NO SUPABASE
-- Execute este script no SQL Editor do seu projeto Supabase para habilitar a
-- persistência de banner Hero, FAQ, Depoimentos, etc.
-- ==============================================================================

-- 1. Criação da tabela de Configurações
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar o Row Level Security (RLS)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 3. Política: Permitir leitura pública (Qualquer visitante do site pode ler as configurações)
CREATE POLICY "Permitir leitura pública de configurações" 
ON public.site_settings 
FOR SELECT 
USING (true);

-- 4. Política: Permitir inserção apenas para admins autorizados
CREATE POLICY "Permitir inserções de config apenas para admins" 
ON public.site_settings 
FOR INSERT 
TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.authorized_admins 
        WHERE public.authorized_admins.email = auth.jwt() ->> 'email'
    )
);

-- 5. Política: Permitir atualização apenas para admins autorizados
CREATE POLICY "Permitir atualizações de config apenas para admins" 
ON public.site_settings 
FOR UPDATE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.authorized_admins 
        WHERE public.authorized_admins.email = auth.jwt() ->> 'email'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.authorized_admins 
        WHERE public.authorized_admins.email = auth.jwt() ->> 'email'
    )
);

-- 6. Política: Permitir exclusão apenas para admins autorizados
CREATE POLICY "Permitir exclusões de config apenas para admins" 
ON public.site_settings 
FOR DELETE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.authorized_admins 
        WHERE public.authorized_admins.email = auth.jwt() ->> 'email'
    )
);

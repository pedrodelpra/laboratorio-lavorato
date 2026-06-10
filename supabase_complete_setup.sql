-- ==============================================================================
-- SCRIPT DE CONFIGURAÇÃO COMPLETO DO SUPABASE
-- Execute este script no SQL Editor do seu projeto Supabase (https://supabase.com)
-- para recriar/ajustar todas as tabelas, RLS (Row Level Security) e políticas.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABELA DE ADMINISTRADORES AUTORIZADOS (authorized_admins)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.authorized_admins (
    email TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilita RLS
ALTER TABLE public.authorized_admins ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas se existirem para evitar conflitos
DROP POLICY IF EXISTS "Permitir leitura de admins para autenticados" ON public.authorized_admins;
DROP POLICY IF EXISTS "Permitir leitura pública de admins" ON public.authorized_admins;

-- Cria nova política de leitura (qualquer usuário autenticado pelo Supabase Auth pode ler para verificar seu email)
CREATE POLICY "Permitir leitura de admins para autenticados" 
ON public.authorized_admins FOR SELECT TO authenticated USING (true);

-- Insere os administradores padrão
INSERT INTO public.authorized_admins (email) 
VALUES 
    ('admin@laboratoriolavorato.com.br'),
    ('pedrodelpra@gmail.com'),
    ('laboratoriolavorato@hotmail.com')
ON CONFLICT (email) DO NOTHING;


-- ------------------------------------------------------------------------------
-- 2. TABELA DE LEADS (leads)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    cro TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT,
    contacted BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilita RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir inserções públicas de novos leads" ON public.leads;
DROP POLICY IF EXISTS "Permitir leitura apenas para admins autorizados" ON public.leads;
DROP POLICY IF EXISTS "Permitir atualizações apenas para admins autorizados" ON public.leads;
DROP POLICY IF EXISTS "Permitir exclusão apenas para admins autorizados" ON public.leads;

-- Cria novas políticas robustas
-- Qualquer pessoa (visitante anônimo do site) pode enviar um lead de contato
CREATE POLICY "Permitir inserções públicas de novos leads" 
ON public.leads FOR INSERT WITH CHECK (true);

-- Apenas admins autenticados cujo e-mail está na lista authorized_admins podem ver leads
CREATE POLICY "Permitir leitura apenas para admins autorizados" 
ON public.leads FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.authorized_admins 
        WHERE public.authorized_admins.email = auth.jwt() ->> 'email'
    )
);

-- Apenas admins autenticados podem atualizar leads (marcar como contatado, etc.)
CREATE POLICY "Permitir atualizações apenas para admins autorizados" 
ON public.leads FOR UPDATE TO authenticated 
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

-- Apenas admins autenticados podem deletar leads
CREATE POLICY "Permitir exclusão apenas para admins autorizados" 
ON public.leads FOR DELETE TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.authorized_admins 
        WHERE public.authorized_admins.email = auth.jwt() ->> 'email'
    )
);


-- ------------------------------------------------------------------------------
-- 3. TABELA DE ARTIGOS DO BLOG (blog_posts)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    readtime TEXT,
    image TEXT,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    date TEXT NOT NULL,
    has_footer BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilita RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir leitura pública de artigos" ON public.blog_posts;
DROP POLICY IF EXISTS "Permitir inserções apenas para admins autorizados" ON public.blog_posts;
DROP POLICY IF EXISTS "Permitir atualizações apenas para admins autorizados" ON public.blog_posts;
DROP POLICY IF EXISTS "Permitir exclusões apenas para admins autorizados" ON public.blog_posts;

-- Cria novas políticas
-- Qualquer visitante do site pode ler os artigos
CREATE POLICY "Permitir leitura pública de artigos" 
ON public.blog_posts FOR SELECT USING (true);

-- Apenas admins autorizados podem criar, editar e excluir artigos
CREATE POLICY "Permitir inserções apenas para admins autorizados" 
ON public.blog_posts FOR INSERT TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.authorized_admins 
        WHERE public.authorized_admins.email = auth.jwt() ->> 'email'
    )
);

CREATE POLICY "Permitir atualizações apenas para admins autorizados" 
ON public.blog_posts FOR UPDATE TO authenticated 
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

CREATE POLICY "Permitir exclusões apenas para admins autorizados" 
ON public.blog_posts FOR DELETE TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.authorized_admins 
        WHERE public.authorized_admins.email = auth.jwt() ->> 'email'
    )
);

-- Insere artigos padrão se não houver nenhum
INSERT INTO public.blog_posts (title, category, readtime, image, summary, content, date, has_footer)
VALUES
(
    'O Futuro da Moldagem: Como o Fluxo Digital está Redefinindo a Precisão',
    'fluxo',
    '6 min de leitura',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBEJwdgJMM3HvjDoBPVQ0Ddb_Yswrya0pNeJ4EesCrvlirRdmiJ08gs3skRJdUnqz9fi__LkhOfrlhqTNOfVQCkOwpsidzo5lm5sgQimuyoMQC7zHBmevJ8k-u4SuQdfUXt6pTjqFYXo-L56j0Jf-cOn3in6u2dWQsW5T5XH4LSEpQ5ATXFyWRvE6-R4lq3pX8BXueWQQO_V9Cwd7pq1CKmrAWkGMNeqV8bT3nVP3FgiLhNcEzoNZAV9b0Vq--q5HHh2UNkKg6cozw',
    'Descubra como as novas tecnologias de escaneamento intraoral e impressão 3D estão eliminando erros manuais e garantindo adaptações marginais perfeitas em próteses fixas.',
    'O avanço vertiginoso da odontologia digital trouxe uma revolução sem precedentes para clínicas e laboratórios.\n\nA transição da moldagem convencional com alginato ou silicone para o escaneamento intraoral elimina uma das maiores fontes de distorções e desconforto para o paciente.\n\nCom arquivos digitais enviados instantaneamente ao laboratório, o tempo de produção é reduzido pela metade, e a fidelidade aos tecidos moles e dentes preparados atinge margens de precisão micrométricas, garantindo próteses perfeitamente adaptadas e com necessidade mínima de ajustes clínicos.',
    '2026-06-01',
    true
),
(
    'Zircônia Multilayer: A Revolução da Estética e Resistência',
    'estetica',
    '5 min de leitura',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCKn_QH7fc-Ma5PbUDxPweV84-VsmX7d90m25wxarupiCx0oZa1K2CiiUBcxeZbG6mXonpfGMRlTTG-iUQY87rDyIlhGnEyp5JtqB5WaVCAaIH9zXPdA1PLlsMzqQWVt6ZnLcwPV8FV7InXU9o3RZT8EYxSQ2HAi2rJ48q4cN_prb30T2nQ-UEv-vhus6vX8bU8QEiykua951-4BunNcSxIBeR0zBDmfHpoDu_h4FWWX5dCJblhgmxq1X9PGytgLiF5owtIw45rVX8',
    'Entenda por que a zircônia de última geração se tornou a escolha número um para reabilitações extensas.',
    'A busca pelo equilíbrio entre translucidez natural e alta resistência mecânica encontrou seu ápice na zircônia multilayer.\n\nAntigamente, as próteses de zircônia eram criticadas pelo visual excessivamente opaco, necessitando de aplicação manual de cerâmica que corria o risco de lascamento (chipping).\n\nHoje, com os discos multicamadas com transição suave de cor e translucidez do colo à borda incisal, conseguimos fresar próteses monolíticas extremamente estéticas, capazes de resistir a cargas mastigatórias intensas na região posterior sem comprometer a beleza do sorriso.',
    '2026-05-28',
    true
)
ON CONFLICT DO NOTHING;


-- ------------------------------------------------------------------------------
-- 4. TABELA DE CONFIGURAÇÕES DO SITE (site_settings)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilita RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas se existirem
DROP POLICY IF EXISTS "Permitir leitura pública de configurações" ON public.site_settings;
DROP POLICY IF EXISTS "Permitir inserções de config apenas para admins" ON public.site_settings;
DROP POLICY IF EXISTS "Permitir atualizações de config apenas para admins" ON public.site_settings;
DROP POLICY IF EXISTS "Permitir exclusões de config apenas para admins" ON public.site_settings;

-- Cria novas políticas
-- Qualquer pessoa pode ler as configurações (usado pelas páginas públicas do site)
CREATE POLICY "Permitir leitura pública de configurações" 
ON public.site_settings FOR SELECT USING (true);

-- Apenas admins autorizados podem alterar/salvar configurações
CREATE POLICY "Permitir inserções de config apenas para admins" 
ON public.site_settings FOR INSERT TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.authorized_admins 
        WHERE public.authorized_admins.email = auth.jwt() ->> 'email'
    )
);

CREATE POLICY "Permitir atualizações de config apenas para admins" 
ON public.site_settings FOR UPDATE TO authenticated 
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

CREATE POLICY "Permitir exclusões de config apenas para admins" 
ON public.site_settings FOR DELETE TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.authorized_admins 
        WHERE public.authorized_admins.email = auth.jwt() ->> 'email'
    )
);

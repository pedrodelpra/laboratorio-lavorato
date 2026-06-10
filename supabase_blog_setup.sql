-- ==============================================================================
-- SCRIPT DE CRIAÇÃO DA TABELA DE BLOG NO SUPABASE
-- Execute este script no SQL Editor do seu projeto Supabase para habilitar o CMS.
-- ==============================================================================

-- 1. Criação da tabela de Artigos (Blog Posts)
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    readtime TEXT,
    image TEXT,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    date TEXT NOT NULL, -- formato de exibição (ex: "10/06/2026" ou "2026-06-10")
    has_footer BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar o Row Level Security (RLS)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- 3. Política: Permitir leitura pública (Qualquer visitante do site pode ler os artigos)
CREATE POLICY "Permitir leitura pública de artigos" 
ON public.blog_posts 
FOR SELECT 
USING (true);

-- 4. Política: Permitir inserção apenas para admins autorizados
CREATE POLICY "Permitir inserções apenas para admins autorizados" 
ON public.blog_posts 
FOR INSERT 
TO authenticated 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.authorized_admins 
        WHERE public.authorized_admins.email = auth.jwt() ->> 'email'
    )
);

-- 5. Política: Permitir atualizações apenas para admins autorizados
CREATE POLICY "Permitir atualizações apenas para admins autorizados" 
ON public.blog_posts 
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

-- 6. Política: Permitir exclusões apenas para admins autorizados
CREATE POLICY "Permitir exclusões apenas para admins autorizados" 
ON public.blog_posts 
FOR DELETE 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.authorized_admins 
        WHERE public.authorized_admins.email = auth.jwt() ->> 'email'
    )
);

-- Popula os artigos padrão do laboratório se a tabela estiver vazia
INSERT INTO public.blog_posts (title, category, readtime, image, summary, content, date, has_footer)
VALUES
(
    'O Futuro da Moldagem: Como o Fluxo Digital está Redefinindo a Precisão',
    'fluxo',
    '6 min de leitura',
    'assets/images/servicos/scanner-3d.png',
    'Descubra como as novas tecnologias de escaneamento intraoral e impressão 3D estão eliminando erros manuais e garantindo adaptações marginais perfeitas em próteses fixas.',
    'O avanço vertiginoso da odontologia digital trouxe uma revolução sem precedentes para clínicas e laboratórios.\n\nA transição da moldagem convencional com alginato ou silicone para o escaneamento intraoral elimina uma das maiores fontes de distorções e desconforto para o paciente.\n\nCom arquivos digitais enviados instantaneamente ao laboratório, o tempo de produção é reduzido pela metade, e a fidelidade aos tecidos moles e dentes preparados atinge margens de precisão micrométricas, garantindo próteses perfeitamente adaptadas e com necessidade mínima de ajustes clínicos.',
    '2026-06-01',
    true
),
(
    'Zircônia Multilayer: A Revolução da Estética e Resistência',
    'estetica',
    '5 min de leitura',
    'assets/images/servicos/zirconia-multilayer.png',
    'Entenda por que a zircônia de última geração se tornou a escolha número um para reabilitações extensas.',
    'A busca pelo equilíbrio entre translucidez natural e alta resistência mecânica encontrou seu ápice na zircônia multilayer.\n\nAntigamente, as próteses de zircônia eram criticadas pelo visual excessivamente opaco, necessitando de aplicação manual de cerâmica que corria o risco de lascamento (chipping).\n\nHoje, com os discos multicamadas com transição suave de cor e translucidez do colo à borda incisal, conseguimos fresar próteses monolíticas extremamente estéticas, capazes de resistir a cargas mastigatórias intensas na região posterior sem comprometer a beleza do sorriso.',
    '2026-05-28',
    true
)
ON CONFLICT DO NOTHING;

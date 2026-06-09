# Laboratório Lavorato - Website & Painel Administrativo

Este repositório contém o código-fonte do website institucional e do painel administrativo do **Laboratório Lavorato** (fundado em 1991, referência em prótese dentária e fluxo digital CAD/CAM).

A estrutura interna foi organizada seguindo as melhores práticas de desenvolvimento para garantir modularidade, segurança de dados, legibilidade e fácil manutenção para futuros desenvolvedores.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando uma stack focada em performance, segurança e escalabilidade:

- **HTML5 & Vanilla JavaScript**: Para estrutura e lógica interativa.
- **Tailwind CSS (via CDN)**: Framework de estilização utilitário para design moderno.
- **Vite**: Ferramenta de build e servidor de desenvolvimento ultrarrápido.
- **Supabase**: Backend-as-a-Service (BaaS) provendo banco de dados PostgreSQL, Autenticação e APIs em tempo real.
- **Material Symbols Outlined (Google Fonts)**: Biblioteca de ícones moderna.

---

## 📂 Organização de Pastas e Arquivos

```text
SiteLaboratorioLavorato/
├── assets/
│   ├── images/
│   │   ├── depoimentos/     # Fotos reais dos dentistas nos depoimentos
│   │   ├── servicos/        # Imagens de serviços e próteses
│   │   ├── Logo.avif        # Logotipo oficial
│   │   └── fundadores.png   # Foto dos fundadores
│   └── js/
│       ├── supabase-client.js # Cliente centralizado e inicialização do Supabase
│       └── legal-modal.js   # Controle dos termos legais e LGPD
├── index.html               # Página inicial (Home)
├── sobre.html               # Página Quem Somos / História
├── blog.html                # Blog Científico
├── contato.html             # Formulário de contato para novos dentistas
├── login.html               # Tela de Login Administrativo (Supabase Auth)
├── dashboard.html           # Painel de Controle (Leads & CMS do Blog)
├── package.json             # Dependências e scripts
├── .env                     # Variáveis de ambiente locais (NÃO enviado ao Git)
└── README.md                # Este documento de documentação técnica
```

---

## 🚀 Como Executar o Projeto Localmente

1. **Instalar Dependências**:
   ```bash
   npm install
   ```

2. **Configurar as Variáveis de Ambiente**:
   Crie um arquivo `.env` na raiz do projeto e configure as chaves do seu projeto Supabase:
   ```env
   VITE_SUPABASE_URL="https://seu-projeto-id.supabase.co"
   VITE_SUPABASE_ANON_KEY="sua-anon-key-publica"
   ```

3. **Iniciar Servidor de Desenvolvimento**:
   ```bash
   npm run dev
   ```
   O projeto estará acessível por padrão em `http://localhost:5173`.

4. **Gerar Build de Produção**:
   ```bash
   npm run build
   ```

---

## 🗄️ Integração & Estrutura do Banco de Dados (Supabase)

O projeto armazena os leads (contatos) e gerencia acessos de forma dinâmica via Supabase. Para configurar o banco de dados do cliente, execute o seguinte script no **SQL Editor** do Supabase:

```sql
-- 1. Tabela de Administradores Autorizados
CREATE TABLE IF NOT EXISTS public.authorized_admins (
    email TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.authorized_admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de admins para autenticados" 
ON public.authorized_admins FOR SELECT TO authenticated USING (true);

-- Inserir os administradores iniciais
INSERT INTO public.authorized_admins (email) 
VALUES 
    ('pedrodelpra@gmail.com'),
    ('laboratoriolavorato@hotmail.com')
ON CONFLICT (email) DO NOTHING;

-- 2. Tabela de Leads
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    cro TEXT,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    contacted BOOLEAN DEFAULT false NOT NULL
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Permite inserções públicas (qualquer visitante pode mandar um lead de contato)
CREATE POLICY "Permitir inserções públicas de novos leads" 
ON public.leads FOR INSERT WITH CHECK (true);

-- Permite visualização, atualização e exclusão apenas se o e-mail do usuário logado constar em authorized_admins
CREATE POLICY "Permitir leitura apenas para admins autorizados" 
ON public.leads FOR SELECT TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.authorized_admins 
        WHERE public.authorized_admins.email = auth.jwt() ->> 'email'
    )
);

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

CREATE POLICY "Permitir exclusão apenas para admins autorizados" 
ON public.leads FOR DELETE TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM public.authorized_admins 
        WHERE public.authorized_admins.email = auth.jwt() ->> 'email'
    )
);
```

---

## 🔒 Diretrizes de Segurança & Deploy

- **O arquivo `.README.md` DEVE ser público**: Este arquivo serve como manual técnico e deve ser versionado no GitHub para guiar os próximos desenvolvedores. Ele não contém nenhuma senha ou segredo.
- **O arquivo `.env` DEVE ser ignorado**: O `.gitignore` está configurado para nunca enviar o arquivo `.env` para o Git. As chaves de acesso reais devem ser preenchidas apenas localmente ou configuradas como variáveis de ambiente na plataforma de hospedagem (ex: Vercel, Netlify, Cloudflare Pages).
- **Segurança a Nível de Linha (RLS)**: Nunca desative o RLS nas tabelas do Supabase. Ele garante que, mesmo que alguém descubra a chave anônima da API, nenhum dado sensível seja exposto sem a autenticação de um e-mail cadastrado na tabela de administradores.
- **Prevenção de Cliques Múltiplos**: O formulário de contato possui proteção contra double-submit, desativando o botão enquanto a requisição assíncrona ao Supabase estiver em andamento.

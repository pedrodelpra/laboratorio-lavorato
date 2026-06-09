# Diretrizes de Desenvolvimento e Segurança do Agente

Este arquivo define as regras de desenvolvimento que qualquer agente de IA deve seguir estritamente ao trabalhar neste repositório.

## 1. Evitar a Armadilha do Vibecoding
- **NÃO** realize modificações sem antes ter um modelo mental claro do comportamento esperado.
- **NÃO** entre em loops infinitos de correção de bugs colando erros sem controle ativo de arquitetura (Decision Debt).
- Siga sempre o fluxo do framework VIBLE: Vision (Visão), Interfaces, Build loops (Ciclos de compilação) e Enforcement (Aplicação de regras).
- Planeje limites e fluxos de dados antes de iniciar alterações de código.

## 2. Abordagem Modular (SRR)
- Siga o fluxo **SRR (Small, Reversible, Reviewable)**.
- Nunca faça grandes alterações generalizadas ou adicione múltiplos recursos em um único ciclo.
- **NÃO** misture a resolução de erros existentes com o desenvolvimento de novas funcionalidades.

## 3. Gestão e Isolamento de Chaves (Secrets)
- **Chaves de Frontend**: Apenas chaves seguras por design e destinadas à exposição pública (ex: `SUPABASE_ANON_KEY`, Publishable Keys) podem estar acessíveis ao browser.
- **Chaves Privadas**: Chaves como `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, e `OPENAI_API_KEY` devem ficar estritamente no ambiente do servidor/Edge Functions.
- **NUNCA** realize chamadas a APIs de serviços sensíveis diretamente a partir do código executado no navegador do usuário. Sempre utilize proxies server-side ou Edge Functions seguras.

## 4. Supabase & RLS (Row Level Security)
- RLS deve estar **ATIVADO** por padrão em todas as tabelas.
- As políticas de RLS devem validar autenticação robusta usando `auth.uid()`.
- **NUNCA** guarde dados sensíveis que controlem privilégios (ex: `is_premium`, `rate_limit`, `role`) em tabelas livremente modificáveis pelo usuário.
- Crie suítes de testes automatizados simulando cenários onde um usuário tenta ler ou atualizar dados pertencentes a outro para comprovar o RLS.

## 5. Validação e Segurança de Input
- A validação de inputs deve ser implementada no **BACKEND**. Validações de frontend servem apenas para a experiência do usuário.
- Implemente proteções contra SQL Injection e payloads maliciosos.

## 6. Limitação de Taxa (Rate Limiting)
- Implemente políticas de Rate Limiting e controle de consumo no backend baseados no IP/Usuário para mitigar ataques de negação de serviço e abuso de cotas das APIs de IA.

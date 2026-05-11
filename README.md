# Oferta Certa — versão conectada ao Supabase

## Rodar localmente
```bash
npm install
npm run dev
```

## Configurar Supabase
1. Crie um arquivo `.env` na raiz do projeto.
2. Copie o conteúdo do `.env.example`.
3. Troque `COLE_SUA_ANON_KEY_AQUI` pela sua anon key.
4. Rode o conteúdo de `supabase-schema.sql` no SQL Editor do Supabase.

## Logins de teste
Admin: `admin@ofertacerta` / `admin0901`
Usuário comum: `teste` / `teste`

## O que esta versão já faz
- Carrega mercados, filiais, produtos e ofertas reais do Supabase.
- Salva novas ofertas no Supabase pelo painel Admin.
- Exclui ofertas do Supabase.
- Mantém fallback local quando o banco estiver vazio ou indisponível.
- Tem PWA básico configurado.
- Tem scanner por digitação de código de barras.
- Tem comunidade, favoritos, alertas, ranking, lista inteligente e comparação.

## Importante
O login ainda é de teste/local. Para login 100% real via Supabase Auth, crie os usuários no painel Authentication do Supabase e a tela pode ser trocada para `supabase.auth.signInWithPassword`.

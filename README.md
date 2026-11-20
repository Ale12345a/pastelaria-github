# Pastelaria

Website desenvolvido com **Next.js** para uma pastelaria, com uma interface pública para apresentação de produtos e um painel de administração para gestão de conteúdos.

## Funcionalidades

- Apresentação de categorias de produtos.
- Galerias de fotografias por categoria.
- Visualização de fotografias em lightbox.
- Seleção de fotografia principal por categoria.
- Formulário de contacto e encomendas.
- Painel de administração.
- Autenticação de administradores.
- Gestão de fotografias e conteúdos.
- Interface responsiva para diferentes dispositivos.

## Tecnologias

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL

## Requisitos

Antes de começar, é necessário ter instalado:

- [Node.js](https://nodejs.org/)
- npm
- Uma conta [Supabase](https://supabase.com/)

## Executar localmente

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd <NOME_DA_PASTA>
```

### 2. Instalar as dependências

```bash
npm ci
```

### 3. Configurar o Supabase

Cria um projeto Supabase próprio para a demonstração.

No painel do projeto, obtém:

- Project URL
- Publishable key

Não utilizes credenciais de projetos de produção.

### 4. Configurar as variáveis de ambiente

Na raiz do projeto, cria o ficheiro `.env.local` a partir do exemplo:

```bash
cp .env.example .env.local
```

Edita o ficheiro `.env.local` e substitui os valores de exemplo:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Utiliza os valores do teu próprio projeto Supabase.

### 5. Configurar a base de dados

No painel Supabase, abre o **SQL Editor**.

Executa os ficheiros SQL existentes em `src/lib/supabase/migrations`, pela seguinte ordem:

1. `001_create_categories.sql`
2. `003_create_products.sql`
3. `004_create_gallery.sql`
4. `005_create_business_info.sql`
5. `006_create_admin_users.sql`
6. `007_create_is_admin_function.sql`
7. `008_admin_policies.sql`
8. `009_storage_admin_policies.sql`
9. `011_create_product_images.sql`
10. `012_create_category_images.sql`
11. `013_add_is_primary_to_category_images.sql`
12. `014_create_demo_storage_bucket.sql`

Cada ficheiro deve ser executado integralmente antes de avançar para o seguinte.

Estas migrações criam as tabelas, funções, políticas de segurança e o bucket de armazenamento utilizado pela demonstração.

### 6. Criar o primeiro administrador

A aplicação utiliza a autenticação do Supabase e uma tabela própria (`public.admin_users`) para identificar os administradores.

Primeiro:

1. Abre **Authentication → Users** no painel Supabase.
2. Cria um utilizador com email e palavra-passe.
3. Copia o UUID desse utilizador.

Depois, no SQL Editor, executa:

```sql
INSERT INTO public.admin_users (id)
VALUES ('UUID_DO_UTILIZADOR');
```

Substitui `UUID_DO_UTILIZADOR` pelo UUID real da conta criada.

Apenas os utilizadores registados nesta tabela têm acesso ao painel de administração.

### 7. Iniciar a aplicação

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) no navegador.

O painel de administração está disponível em:

[http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Estrutura das migrações

As migrações estão organizadas em:

```text
src/
└── lib/
    └── supabase/
        └── migrations/
```

São executadas manualmente através do SQL Editor do Supabase, pela ordem indicada anteriormente.

## Segurança

- Não incluir ficheiros `.env.local` ou outras credenciais no repositório.
- Não publicar palavras-passe, tokens ou chaves privadas.
- Utilizar um projeto Supabase independente para a demonstração.
- Não utilizar dados pessoais ou informação de clientes reais.
- Manter as políticas de Row Level Security (RLS) ativas.
- Nunca expor chaves `service_role` ou outras credenciais privadas no frontend.

## Objetivo

Projeto desenvolvido para aplicar e consolidar conhecimentos de desenvolvimento web full-stack, gestão de bases de dados, autenticação, armazenamento de ficheiros e desenvolvimento de interfaces administrativas.

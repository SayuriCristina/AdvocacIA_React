# AdvocacIA — Front-end (React)

O **AdvocacIA** é uma plataforma gamificada de estudos para o exame da Ordem dos Advogados do Brasil (OAB).
Este repositório contém o **front-end** responsável pela interface web, interação com a API, autenticação de usuários e experiência de gamificação com assistente de IA para explicações conceituais e análise de erros.

---

## 🧱 Arquitetura e Tecnologias

* **React 19.1.1** + **React Router 7.9.5** (SPA e navegação dinâmica)
* **TypeScript 5.9.3** (segurança de tipos e legibilidade)
* **Vite 7.1.7** (build e servidor de desenvolvimento rápidos)
* **Tailwind CSS 4.1.16** com `@tailwindcss/vite` plugin (design responsivo e acessível)
* **Axios 1.13.1** (requisições HTTP e camada de serviço configurável)
* **React-Toastify 11.0.5** (notificações e feedback ao usuário)
* **OpenAI SDK 6.7.0** com **OpenRouter** (assistente de IA)

Configuração por variáveis de ambiente no `.env`:

```env
VITE_BACKEND_URL=https://api.seudominio.com
VITE_OPENROUTER_API_KEY=sua_chave_openrouter
```

Essas variáveis permitem a comunicação segura com o back-end e a integração com o modelo de IA.

### 📋 Scripts Disponíveis

```json
{
  "dev": "vite",                           # Inicia servidor de desenvolvimento
  "build": "tsc -b && vite build",        # Compila TypeScript e gera build otimizado
  "lint": "eslint .",                     # Verifica qualidade do código
  "preview": "vite preview"               # Preview da build de produção
}
```

---

## 🗃️ Estrutura e Fluxos (resumo)

**Arquitetura de pastas:**

```
src/
 ├── api/                      # Configuração do OpenRouter e integração com IA
 ├── components/
 │   ├── common/               # Componentes reutilizáveis (SpotlightCard, etc.)
 │   ├── feedback/             # Componentes de feedback (ToastAlert)
 │   └── layout/               # Layouts (Navbar, Footer)
 ├── context/                  # Contexto de autenticação (AuthContext)
 ├── hooks/                    # Lógicas customizadas (useQuiz, useQuestao)
 ├── lib/                      # Utilitários e funções auxiliares (utils.ts)
 ├── models/                   # Tipagens TypeScript (Questao, Usuario, UsuarioLogin)
 ├── pages/
 │   ├── Home/                 # Página inicial com questão diária
 │   ├── Login/                # Página de login
 │   ├── Register/             # Página de registro
 │   ├── Perfil/               # Página de perfil do usuário
 │   ├── Quiz/                 # Página de realização do quiz
 │   └── QuizForm/             # Formulário de configuração do quiz
 ├── services/                 # Comunicação com a API via Axios (auth.service.ts)
 ├── App.tsx                   # Definição de rotas e layout base
 ├── index.css                 # Estilos globais
 └── main.tsx                  # Ponto de entrada da aplicação
```

**Rotas disponíveis:**

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial (Home) com questão diária |
| `/login` | Login do usuário |
| `/register` | Registro de novo usuário |
| `/perfil` | Perfil e estatísticas do usuário |
| `/quizform` | Formulário de configuração do quiz |
| `/quiz` | Realização do quiz |

**Fluxos principais:**

* **Autenticação (`AuthContext`)**

  * Persistência de `usuario` e `token` via `localStorage`.
  * Funções `handleLogin` e `handleLogout` para controle de sessão.
  * Integração com `auth.service` para login, cadastro e atualização.

* **Camada HTTP (`auth.service.ts`)**

  * Instância Axios com `baseURL` definida por `VITE_BACKEND_URL`.
  * Métodos de autenticação, atualização de pontos e consulta de questões.

* **Quiz e Gamificação (`useQuiz.ts`, `QuizForm`, `Quiz`)**

  * Embaralhamento de questões e controle de pontuação.
  * Atualização de streaks e taxa de acerto.
  * Sincronização com o back-end e fallback local em caso de falha de rede.

* **Questão Diária / Home (`useQuestao.ts`)**

  * Carregamento aleatório de questão rápida.
  * Exibição imediata e responsiva com animações leves.

* **Assistente de IA (`openRouter.api.ts`)**

  * Explicação de conceitos e análise de respostas.
  * Detecção de truncamento e complementação de saída.

* **Acessibilidade e UX**

  * Navegação por teclado garantida em formulários e botões.
  * Feedback visual e auditivo via toasts não bloqueantes.
  * Design responsivo com Tailwind e sem dependência de frameworks pesados.

---

## 🔐 Integração com o Back-end

O front-end consome os endpoints REST do back-end (`Spring Boot`) através da instância Axios configurada em `src/services/auth.service.ts` para:

* **Autenticação:** registro, login e atualização de dados do usuário
* **Questões:** listagem, filtro por assunto e busca individual
* **Gamificação:** envio e atualização de pontuação, streaks e histórico de acertos

**Autenticação JWT:**

* Token armazenado no `localStorage`
* Injetado automaticamente no cabeçalho `Authorization: Bearer <token>` nas requisições autenticadas
* Timeout padrão de 10 segundos nas requisições

**Exemplo de chamada autenticada:**

```typescript
const header = {
  headers: {
    Authorization: `Bearer ${token}`
  }
}
await buscar('/api/usuario/profile', setDados, header)
```

---

## 💻 Como Rodar Localmente

### 🧩 Requisitos

* [Node.js 20+](https://nodejs.org/)
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
* Backend em execução (ex.: [`http://localhost:8080`](http://localhost:8080))
* Chave de API da plataforma [OpenRouter](https://openrouter.ai/)

### ⚙️ Passo a passo

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/SayuriCristina/AdvocacIA_React
   cd AdvocacIA_React
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Crie o arquivo `.env` na raiz do projeto:**

   ```env
   VITE_BACKEND_URL=http://localhost:8080
   VITE_OPENROUTER_API_KEY=sua_chave_openrouter
   ```

4. **Execute o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

   O app será iniciado em:

   ```
   http://localhost:5173
   ```

5. **Para build de produção:**

   ```bash
   npm run build
   ```

6. **Para preview da build:**

   ```bash
   npm run preview
   ```

---

## � Principais Funcionalidades

* **Autenticação segura** com JWT e login/registro
* **Questão diária** aleatória para prática rápida
* **Quiz personalizado** com seleção de quantidade de questões e assunto
* **Assistente de IA** para explicações conceituais e análise de erros
* **Perseguição de progresso** com pontuação, streaks e taxa de acerto
* **Perfil do usuário** com estatísticas e histórico de quizzes
* **Interface responsiva** otimizada para desktop e dispositivos móveis
* **Design acessível** com suporte a navegação por teclado
* **Notificações em tempo real** via react-toastify

---

## ☁️ Deploy e Serviços em Nuvem

O front-end é preparado para **deploy contínuo** e hospedagem em ambientes **cloud-native**, como **Vercel**, **Render** ou **Netlify**.

### 🔹 Infraestrutura e serviços utilizados

* **Vite Build + Node**
  Gera artefatos otimizados (HTML/CSS/JS minificados) com tree-shaking automático, prontos para deploy estático em CDN.

* **OpenRouter (IA)**
  Serviço conectado via SDK OpenAI, fornecendo explicações e feedback inteligente no quiz através de requisições HTTPS.

* **Axios com timeout**
  Requisições HTTP com timeout padrão de 10 segundos garantem melhor experiência em conexões lentes.

Esses serviços garantem velocidade, confiabilidade e escalabilidade para a interface do AdvocacIA.

---

## 🛠️ Configuração de Desenvolvimento

### Alias de Path

O projeto usa alias de path configurado no `tsconfig.json` e `vite.config.ts`:

```typescript
// Ao invés de: import { utils } from '../../../lib/utils'
import { utils } from '@/lib/utils'
```

### Qualidade de Código

* **ESLint** com regras recomendadas para React e TypeScript
* **TypeScript** com verificação rigorosa de tipos
* **React Hooks** com validações automáticas

### Styles

* **Tailwind CSS 4** via plugin Vite para performance
* **Variáveis CSS** personalizadas no `index.css`
* **Animações** via `tw-animate-css` para transições suaves


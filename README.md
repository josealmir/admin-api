# Admin API

API administrativa construída com **Clean Architecture**, **Fastify**, **TypeORM**, **JWT** e **OpenTelemetry**.

---

## Arquitetura

O projeto segue os princípios da **Clean Architecture** (Robert C. Martin), organizado em 4 camadas:

```
src/
├── domain/           # Núcleo do negócio — sem dependências externas
│   ├── entities/     # Entidades de domínio (User, etc.)
│   ├── value-objects/# Value Objects (Email, etc.)
│   └── repositories/ # Interfaces de repositório
│
├── application/      # Casos de uso — orquestram o domínio
│   ├── use-cases/    # CreateUserUseCase, AuthLoginUseCase, etc.
│   └── dtos/         # Data Transfer Objects
│
├── infrastructure/   # Implementações concretas (frameworks, DB, etc.)
│   ├── database/     # TypeORM (config, entidades, repositórios, migrations)
│   ├── telemetry/    # OpenTelemetry, Prometheus, Health Check
│   └── auth/         # Provedor JWT
│
├── presentation/     # Interface com o mundo externo (Fastify)
│   ├── plugins/      # Plugins (auth, cors, swagger)
│   ├── routes/       # Definição de rotas
│   ├── controllers/  # Handlers das requisições
│   └── schemas/      # Schemas de validação
│
└── shared/           # Utilitários compartilhados
    ├── errors/       # AppError customizado
    ├── middleware/    # Error handler global
    └── constants/    # Configurações de ambiente
```

**Regras da arquitetura:**
- `domain` → não importa nada de fora (zero dependências)
- `application` → importa apenas `domain`
- `infrastructure` → implementa interfaces de `domain`/`application`
- `presentation` → depende de `application` e `infrastructure`

---

## Stack Tecnológica

| Tecnologia | Versão | Finalidade |
|-----------|--------|-----------|
| Node.js | 20 LTS | Runtime |
| TypeScript | 6.x | Tipagem estática |
| Fastify | 4.x | Framework HTTP |
| TypeORM | 0.3.x | ORM MySQL |
| MySQL | 8.x | Banco de dados |
| JWT (`@fastify/jwt`) | — | Autenticação |
| bcrypt | — | Hash de senhas |
| OpenTelemetry | — | Traces distribuídos (OTLP) |
| Prometheus (`prom-client`) | — | Métricas |
| Zod | — | Validação de schemas |
| Swagger (`@fastify/swagger`) | — | Geração OpenAPI spec |
| Scalar (`@scalar/fastify-api-reference`) | — | UI de documentação |
| Jest + ts-jest | — | Testes + code coverage |
| ESLint + Prettier | — | Lint + formatação |
| Husky + lint-staged | — | Git hooks (pre-commit) |
| Docker + Compose | — | Ambiente local |

---

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 10+
- [Docker](https://docker.com/) e [Docker Compose](https://docs.docker.com/compose/) (opcional)

---

## Como Rodar

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e ajuste conforme necessário:

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas configurações (banco, JWT, etc.).

### 3. Subir o MySQL (via Docker)

```bash
docker compose up mysql -d
```

### 4. Rodar as migrations

```bash
pnpm migration:run
```

### 5. Iniciar o servidor

```bash
# Desenvolvimento (com hot-reload)
pnpm dev

# Produção (build + start)
pnpm build
pnpm start
```

---

## Docker Compose (ambiente completo)

```bash
docker compose --env-file .env.local up -d
```

Isso sobe:
- **MySQL 8** — banco de dados
- **Admin API** — aplicação (build local via Dockerfile)
- **OTEL Collector** — coletor de traces OpenTelemetry

---

## Endpoints

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|-------------|
| GET | `/api/v1/ping` | Health check simples | ❌ |
| POST | `/api/v1/register` | Criar conta (retorna JWT) | ❌ |
| POST | `/api/v1/login` | Login (retorna JWT) | ❌ |
| GET | `/api/v1/users` | Listar usuários | ✅ JWT |
| GET | `/api/v1/users/:id` | Buscar usuário por ID | ✅ JWT |
| POST | `/api/v1/users` | Criar usuário | ✅ JWT |
| GET | `/health` | Health check (DB + uptime) | ❌ |
| GET | `/metrics` | Métricas Prometheus | ❌ |
| GET | `/docs` | Documentação interativa (Scalar) | ❌ |

---

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `pnpm dev` | Inicia servidor com hot-reload |
| `pnpm build` | Compila TypeScript para `dist/` |
| `pnpm start` | Inicia servidor em produção |
| `pnpm lint` | Verifica código com ESLint |
| `pnpm lint:fix` | Corrige problemas de lint |
| `pnpm format` | Formata código com Prettier |
| `pnpm format:check` | Verifica formatação |
| `pnpm test` | Executa testes |
| `pnpm test:coverage` | Executa testes com cobertura |
| `pnpm migration:generate` | Gera nova migration |
| `pnpm migration:run` | Executa migrations pendentes |
| `pnpm migration:revert` | Reverte última migration |

---

## Testes

```bash
# Todos os testes
pnpm test

# Com cobertura (threshold mínimo: 80%)
pnpm test:coverage
```

---

## Qualidade de Código

O projeto utiliza **Husky** com **lint-staged** para rodar ESLint + Prettier automaticamente antes de cada commit.

Configuração do SonarQube para análise estática disponível em `sonar-project.properties`.

---

## Telemetria

### OpenTelemetry

Traces são exportados via protocolo OTLP para o endpoint configurado em `OTEL_ENDPOINT`.

### Prometheus

Métricas disponíveis em `GET /metrics`:
- `http_request_duration_seconds` — histograma de duração das requisições
- `http_requests_total` — contador total de requisições
- Métricas padrão do Node.js (`collectDefaultMetrics`)

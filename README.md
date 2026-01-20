# Albums Manager Server

## Visão Geral

O Albums Manager Server é uma API back-end desenvolvida em Node.js com TypeScript, focada na gestão de álbuns e fotos de usuários. O projeto adota Clean Architecture e DDD para garantir escalabilidade, manutenibilidade e separação clara de responsabilidades. Principais tecnologias incluem Prisma ORM, PostgreSQL, autenticação JWT, validação com Zod, Docker e tratamento centralizado de erros.

**Objetivo:**
Facilitar o gerenciamento de álbuns e fotos, oferecendo endpoints seguros e padronizados para operações CRUD, autenticação e integração com serviços de e-mail e filas.

**Principais Tecnologias:**
- Node.js + TypeScript
- PostgreSQL + Prisma ORM
- Docker & Docker Compose
- JWT (access/refresh token)
- Zod (validação)
- Nodemailer (e-mail)

---

## Arquitetura

O projeto segue Clean Architecture e DDD, com camadas bem definidas:

```
modules/
  └─ domínio (ex: albums, auth, users, photos)
      ├─ controllers/
      ├─ dtos/
      ├─ repositories/
      ├─ schemas/
      ├─ use-cases/
      ├─ routes.ts
shared/
  ├─ errors/
  ├─ interfaces/
  ├─ utils/
infra/
  ├─ email/
  ├─ multer/
  ├─ redis/
lib/
  └─ prisma.ts
config/
  ├─ env.ts
  ├─ mail.ts
  ├─ redis.ts
```

**Responsabilidade das Camadas:**
- **Controller:** Recebe requisições HTTP, chama use-cases, retorna responses.
- **UseCase:** Lógica de negócio, orquestra operações entre repositórios e serviços.
- **Repository:** Abstração de acesso a dados (Prisma, Redis, etc).
- **DTO:** Tipos para entrada/saída de dados.
- **Schema:** Validação de dados (Zod).
- **Routes:** Define rotas e middlewares.
- **Shared:** Erros, interfaces, utilitários comuns.
- **Infra:** Serviços externos (e-mail, Redis, upload).
- **Config:** Configurações globais.

---

## Estrutura de Pastas

```
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   ├── generated/
│   ├── infra/
│   ├── lib/
│   ├── modules/
│   ├── shared/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── uploads/
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── nodemon.json
```

**Explicação dos Diretórios:**
- **src/**: Código-fonte principal.
- **modules/**: Domínios da aplicação (albums, auth, users, photos, etc).
- **shared/**: Utilitários, interfaces e erros globais.
- **infra/**: Serviços externos (e-mail, Redis, upload).
- **config/**: Configurações globais.
- **lib/**: Instâncias e helpers (ex: Prisma).
- **prisma/**: Schema e migrations do banco.
- **uploads/**: Arquivos enviados pelos usuários.

---

## Configurações

### Variáveis de Ambiente (.env)
- `DATABASE_URL`: URL de conexão do PostgreSQL
- `JWT_SECRET`: Chave secreta para JWT
- `JWT_REFRESH_SECRET`: Chave para refresh token
- `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASS`: Configuração de e-mail
- `REDIS_URL`: URL do Redis
- Outras variáveis específicas do ambiente

### Prisma
- Schema definido em `prisma/schema.prisma`
- Migrations em `prisma/migrations/`
- Configuração em `prisma.config.ts`

### Autenticação (JWT)
- Tokens gerados e validados via helpers em `shared/utils/jwt.ts`
- Middleware de autenticação em `modules/auth/middlewares/auth.middleware.ts`

### Middlewares Globais
- Logger, CORS, body-parser, tratamento de erros
- Error handler centralizado em `shared/errors/errorHandler.ts`

### Tratamento de Erros
- Classe `AppError` para erros customizados
- Middleware captura e responde erros padronizados

---

## Banco de Dados

### Entidades Principais
- **User**: id, name, email, password, createdAt
- **Album**: id, name, description, userId, createdAt, thumbnail
- **Photo**: id, albumId, url, createdAt
- **RefreshToken**: id, userId, token, expiresAt

### Relacionamentos
- User 1:N Album
- Album 1:N Photo
- User 1:N RefreshToken

### Observações
- Índices em campos de busca (ex: email)
- Constraints de integridade referencial (FKs)

---

## Docker

### Imagens Utilizadas
- **node:alpine** para aplicação
- **postgres** para banco de dados
- **redis** para cache/filas

### Dockerfile
- Instala dependências
- Copia código
- Define entrypoint

### docker-compose.yml
- Orquestra containers: app, db, redis
- Define volumes, networks e variáveis de ambiente

### Subindo o Projeto com Docker
```bash
docker-compose up --build
```

---

## Endpoints da API

### Auth
- **POST /auth/register**
  - Autenticação: Não
  - Descrição: Cadastro de usuário
  - Request:
    ```json
    { "name": "Lucas", "email": "lucas@email.com", "password": "123456" }
    ```
  - Response:
    ```json
    { "status": "success", "message": "Usuário cadastrado", "data": { ... }, "errors": null }
    ```

- **POST /auth/login**
  - Autenticação: Não
  - Descrição: Login do usuário
  - Request:
    ```json
    { "email": "lucas@email.com", "password": "123456" }
    ```
  - Response:
    ```json
    { "status": "success", "message": "Login realizado", "data": { "accessToken": "...", "refreshToken": "..." }, "errors": null }
    ```

- **POST /auth/refresh**
  - Autenticação: Não
  - Descrição: Gera novo access token
  - Request:
    ```json
    { "refreshToken": "..." }
    ```
  - Response:
    ```json
    { "status": "success", "message": "Token renovado", "data": { "accessToken": "..." }, "errors": null }
    ```

### Users
- **GET /users/me**
  - Autenticação: Sim
  - Descrição: Retorna dados do usuário logado
  - Response:
    ```json
    { "status": "success", "message": "Dados do usuário", "data": { ... }, "errors": null }
    ```

### Albums
- **POST /albums**
  - Autenticação: Sim
  - Descrição: Criação de álbum
  - Request:
    ```json
    { "name": "Viagem", "description": "Fotos da viagem" }
    ```
  - Response:
    ```json
    { "status": "success", "message": "Álbum criado", "data": { ... }, "errors": null }
    ```

- **GET /albums**
  - Autenticação: Sim
  - Descrição: Lista álbuns do usuário
  - Response:
    ```json
    { "status": "success", "message": "Álbuns encontrados", "data": [ ... ], "errors": null }
    ```

- **GET /albums/:id**
  - Autenticação: Sim
  - Descrição: Retorna detalhes de um álbum do usuário.
  - Request:
    - Parâmetro de rota: `id` (ID do álbum)
    - Exemplo:
      ```bash
      curl -X GET \
        -H "Authorization: Bearer <token>" \
        https://api.seusite.com/albums/123
      ```
  - Response:
    ```json
    {
      "status": "success",
      "message": "Detalhes do álbum",
      "data": {
        "id": "123",
        "name": "Viagem",
        "description": "Fotos da viagem",
        "thumbnail": "/uploads/users/<userId>/photos/thumb.jpg",
        "createdAt": "2026-01-18T00:00:00.000Z",
        "photos": [ ... ]
      },
      "errors": null
    }
    ```

- **PUT /albums/:id**
  - Autenticação: Sim
  - Descrição: Atualiza dados de um álbum do usuário.
  - Request:
    - Parâmetro de rota: `id` (ID do álbum)
    - Body:
      ```json
      { "name": "Nova Viagem", "description": "Atualizado" }
      ```
    - Exemplo:
      ```bash
      curl -X PUT \
        -H "Authorization: Bearer <token>" \
        -H "Content-Type: application/json" \
        -d '{ "name": "Nova Viagem", "description": "Atualizado" }' \
        https://api.seusite.com/albums/123
      ```
  - Response:
    ```json
    {
      "status": "success",
      "message": "Álbum atualizado",
      "data": { ... },
      "errors": null
    }
    ```

- **DELETE /albums/:id**
  - Autenticação: Sim
  - Descrição: Remove um álbum do usuário (soft delete).
  - Request:
    - Parâmetro de rota: `id` (ID do álbum)
    - Exemplo:
      ```bash
      curl -X DELETE \
        -H "Authorization: Bearer <token>" \
        https://api.seusite.com/albums/123
      ```
  - Response:
    ```json
    {
      "status": "success",
      "message": "Álbum removido",
      "data": null,
      "errors": null
    }
    ```

### Photos

- **POST /photos/upload**
  - Autenticação: Sim
  - Descrição: Upload de foto do usuário para um álbum. O arquivo é salvo e enviado para processamento assíncrono.
  - Request (multipart/form-data):
    - Campos:
      - `file`: Arquivo de imagem (jpeg, png, webp)
      - `albumId`: (opcional) ID do álbum
      - `acquiredAt`: (opcional) Data de aquisição da foto
    - Exemplo usando cURL:
      ```bash
      curl -X POST \
        -H "Authorization: Bearer <token>" \
        -F "file=@/caminho/para/foto.jpg" \
        -F "albumId=123" \
        -F "acquiredAt=2026-01-18" \
        https://api.seusite.com/photos/upload
      ```
  - Response:
    ```json
    {
      "success": true,
      "message": "Photo queued for processing",
      "data": null,
      "errors": null
    }
    ```

- **GET /photos/:id**
  - Autenticação: Sim
  - Descrição: Retorna detalhes de uma foto específica do usuário.
  - Request:
    - Parâmetro de rota: `id` (ID da foto)
    - Exemplo:
      ```bash
      curl -X GET \
        -H "Authorization: Bearer <token>" \
        https://api.seusite.com/photos/abc123
      ```
  - Response:
    ```json
    {
      "success": true,
      "message": "Detalhes da foto",
      "data": {
        "id": "abc123",
        "albumId": "123",
        "url": "/uploads/users/<userId>/photos/abc123.jpg",
        "title": "Foto de viagem",
        "description": "Praia",
        "acquiredAt": "2026-01-18T00:00:00.000Z"
      },
      "errors": null
    }
    ```

- **DELETE /photos/:id**
  - Autenticação: Sim
  - Descrição: Remove uma foto do usuário (soft delete).
  - Request:
    - Parâmetro de rota: `id` (ID da foto)
    - Exemplo:
      ```bash
      curl -X DELETE \
        -H "Authorization: Bearer <token>" \
        https://api.seusite.com/photos/abc123
      ```
  - Response:
    ```json
    {
      "success": true,
      "message": "Photo deleted successfully",
      "data": null,
      "errors": null
    }
    ```

### Health

- **GET /health**
  - Autenticação: Não
  - Descrição: Verifica se a API está online.
  - Request:
    - Exemplo:
      ```bash
      curl -X GET https://api.seusite.com/health
      ```
  - Response:
    ```json
    {
      "status": "success",
      "message": "API online",
      "data": null,
      "errors": null
    }
    ```

---

## Padrão de Response

### Sucesso
```json
{
  "status": "success",
  "message": "Operação realizada com sucesso",
  "data": { ... },
  "errors": null
}
```

### Erro
```json
{
  "status": "error",
  "message": "Descrição do erro",
  "data": null,
  "errors": [ { "field": "email", "message": "E-mail inválido" } ]
}
```

**Campos:**
- `status`: "success" ou "error"
- `message`: Mensagem descritiva
- `data`: Dados retornados (ou null)
- `errors`: Lista de erros (ou null)

---

## Como rodar o projeto

### Localmente
```bash
npm install
npm run dev
```

### Com Docker
```bash
docker-compose up --build
```

### Migrations
```bash
npx prisma migrate dev
```

### Seed (se existir)
```bash
npx prisma db seed
```

---

## Boas práticas adotadas
- Separação clara de responsabilidades por camadas
- Validação de dados com Zod
- Tratamento centralizado de erros
- Autenticação e autorização robusta
- Uso de DTOs e schemas para entrada/saída
- Segurança básica (hash de senhas, JWT, CORS)
- Escalabilidade e fácil manutenção

---

## Licença

Este projeto está licenciado sob a MIT License.

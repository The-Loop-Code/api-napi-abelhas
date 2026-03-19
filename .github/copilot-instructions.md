# Copilot Instructions — api-napi-abelhas

## Projeto

API REST para gerenciamento de amostras laboratoriais do NAPI Abelhas (mel, pólen, própolis).
Framework: NestJS 11 + TypeScript 5 + Prisma 7 + Zod 4.
Banco: PostgreSQL 16. Cache: Redis 7. Storage: MinIO (S3-compatível). Auth: Clerk (JWT/JWKS).
Logger: Pino (nestjs-pino) com NDJSON estruturado.

## Arquitetura — Clean + SOLID + DRY + Modular

Módulos de domínio (rotas da API) ficam em `src/modules/`.
Infraestrutura compartilhada fica na raiz de `src/` (`common/`, `config/`, `prisma/`, `auth/`, `storage/`).

Cada módulo de domínio segue 5 camadas obrigatórias:

```
src/modules/<modulo>/
  <modulo>.module.ts
  <modulo>.controller.ts
  usecases/
    create-<modulo>.usecase.ts
    find-all-<modulo>.usecase.ts
    find-one-<modulo>.usecase.ts
    update-<modulo>.usecase.ts
    remove-<modulo>.usecase.ts
  repositories/
    <modulo>.repository.ts          # interface (porta)
    prisma-<modulo>.repository.ts   # implementação Prisma (adaptador)
  dto/
    create-<modulo>.dto.ts
    update-<modulo>.dto.ts
```

### Regras de camada

| Camada | Responsabilidade | NÃO pode |
|--------|------------------|----------|
| **Controller** | Mapear rotas HTTP, aplicar Guards e ZodValidationPipe, delegar ao UseCase | Conter lógica de negócio, acessar Prisma |
| **UseCase** | Executar uma única regra de negócio (SRP) | Conhecer HTTP (headers, status), instanciar dependências |
| **Repository (interface)** | Definir contrato de acesso a dados | Ter implementação concreta |
| **Repository (impl)** | Implementar acesso ao banco via PrismaService | Conter lógica de negócio |
| **DTO** | Definir schema Zod + tipo TypeScript inferido | Usar class-validator/class-transformer |

### Dependency Inversion (DIP)

UseCases dependem da **interface** do Repository (porta), não da implementação.
O Module faz o binding:

```typescript
@Module({
  providers: [
    CreateProducerUseCase,
    { provide: 'IProducerRepository', useClass: PrismaProducerRepository },
  ],
})
```

UseCase recebe via `@Inject('IProducerRepository')`:

```typescript
@Injectable()
export class CreateProducerUseCase {
  constructor(
    @Inject('IProducerRepository') private readonly repo: IProducerRepository,
  ) {}
}
```

## Validação — Zod exclusivamente

- **Nunca** use `class-validator` ou `class-transformer`.
- Cada DTO exporta um **schema Zod** e um **tipo inferido** (`z.infer<typeof schema>`).
- DTOs de atualização reutilizam o schema de criação com `.partial()`.
- Validação aplicada no Controller via `new ZodValidationPipe(schema)`.

## Tipagem e ESLint

- `import type` para importações que são apenas tipos.
- Proibido `any` como atalho — prefira `unknown` + type narrowing.
- Regras ESLint ativas: `@typescript-eslint/no-floating-promises: warn`, `@typescript-eslint/no-unsafe-argument: warn`.
- Todo método `async` **deve** conter `await`. Se não precisa de `await`, remova o `async`.
- Prettier integrado ao ESLint — aspas simples, trailing comma, endOfLine auto.
- **Sempre rodar `npm run lint` e `npm run format` antes de considerar qualquer código pronto.**

## Autenticação

- Guards e decorators compartilhados ficam em `src/common/` (nunca dentro de módulos de domínio).
- Rotas protegidas: `@UseGuards(ClerkAuthGuard)` no nível da classe — importar de `common/guards/clerk-auth.guard`.
- Autorização por role: `@UseGuards(ClerkAuthGuard, RolesGuard)` + `@Roles('ADMIN')` — importar de `common/guards/` e `common/decorators/`.
- Obter usuário: `@CurrentUser() user: ClerkJwtPayload` — importar de `common/decorators/current-user.decorator`.

## Tratamento de Erros

- Usar exceções do NestJS (`NotFoundException`, `BadRequestException`, etc.) — nunca `throw new Error()`.
- O `AllExceptionsFilter` global (registrado no `main.ts`) captura **todas** as exceções:
  - `HttpException` → retorna status e body da exceção.
  - `PrismaClientKnownRequestError` → mapeado por código (`P2002` → 409, `P2025` → 404, `P2003` → 400, etc.).
  - `PrismaClientValidationError` → 400 Bad Request.
  - `PrismaClientInitializationError` → 503 Service Unavailable.
  - Qualquer outra exceção → 500 Internal server error sem vazar detalhes internos.
- Formato padronizado: `{ statusCode, timestamp, path, message }`.
- Erros 5xx são logados como `error` (com stack trace) e erros 4xx como `warn` via Pino.
- O antigo `HttpExceptionFilter` foi substituído pelo `AllExceptionsFilter`.

## Documentação da API — Swagger (OpenAPI)

- O pacote `@nestjs/swagger` gera documentação interativa em `/api/docs`.
- Configurado no `main.ts` via `DocumentBuilder` + `SwaggerModule`.
- Usa `addBearerAuth()` para documentar endpoints protegidos por JWT.
- Decorators do Swagger (`@ApiTags`, `@ApiOperation`, `@ApiBearerAuth`, etc.) podem ser usados nos Controllers para enriquecer a documentação.
- A documentação **não** é servida em produção por padrão — considere desabilitar com base em `NODE_ENV`.

## Logger — Pino (nestjs-pino)

- O logger padrão do NestJS foi substituído pelo **Pino** via `nestjs-pino`.
- Em **produção**: saída JSON puro (NDJSON) em stdout — ideal para Docker + Loki/Grafana, ELK, CloudWatch.
- Em **desenvolvimento**: `pino-pretty` com cores, timestamps legíveis e single-line.
- Nível de log controlado pela variável de ambiente `LOG_LEVEL` (default: `info`).
- Headers sensíveis (`authorization`, `cookie`, `set-cookie`) são censurados automaticamente via `redact`.
- O `bufferLogs: true` é usado no bootstrap para capturar logs antes do Pino estar pronto.
- Para logar em services/usecases, use o `Logger` do `@nestjs/common` (que delega ao Pino automaticamente):

```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class CreateProducerUseCase {
  private readonly logger = new Logger(CreateProducerUseCase.name);

  async execute(dto: CreateProducerDto) {
    this.logger.log('Creating producer');
    return this.repo.create(dto);
  }
}
```

## Testes

- Testes unitários: `*.spec.ts` ao lado do arquivo testado.
- Testes E2E: `test/*.e2e-spec.ts`.
- UseCases e Repositories devem ter testes unitários com mock do repository/prisma.
- Após criar/alterar código, rodar `npm test` para validar.

## Convenções

- Nomes de arquivo: `kebab-case`.
- Classes: `PascalCase`. Variáveis/funções: `camelCase`. Constantes: `UPPER_SNAKE_CASE`.
- Controller routes: recurso no plural, inglês quando possível.
- REST: GET (list/find), POST (create), PATCH (update), DELETE (remove).
- `findOne` antes de `update`/`remove` para garantir existência.
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`).

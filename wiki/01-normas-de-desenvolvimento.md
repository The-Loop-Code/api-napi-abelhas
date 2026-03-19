# Normas de Desenvolvimento

## Visão Geral

Este documento estabelece as normas que todos os colaboradores do projeto **api-napi-abelhas** devem seguir para garantir consistência, manutenibilidade e qualidade do código.

---

## 1. Estrutura de Módulos

O projeto segue a arquitetura modular do NestJS. Cada domínio de negócio deve ser encapsulado em um módulo próprio com a seguinte estrutura:

```
src/<nome-do-modulo>/
  <nome>.controller.ts   # Rotas HTTP e entrada de dados
  <nome>.service.ts      # Lógica de negócio
  <nome>.module.ts       # Declaração do módulo NestJS
  dto/
    create-<nome>.dto.ts  # Schema Zod + tipo TypeScript para criação
    update-<nome>.dto.ts  # Schema Zod + tipo TypeScript para atualização
```

Exemplos existentes: `producers`, `samples`, `analysis`, `abelhas`, `pontos-coleta`.

---

## 2. Nomenclatura

| Elemento               | Convenção               | Exemplo                        |
|------------------------|-------------------------|--------------------------------|
| Arquivos               | `kebab-case`            | `pontos-coleta.service.ts`     |
| Classes                | `PascalCase`            | `PontosColetaService`          |
| Variáveis e funções    | `camelCase`             | `findAll`, `createProdutor`    |
| Constantes globais     | `UPPER_SNAKE_CASE`      | `ROLES_KEY`, `JWKS_CACHE_TTL_MS` |
| Campos do Prisma/DB    | `camelCase`             | `nomeCientifico`, `cidadeId`   |
| Enums (Prisma)         | `UPPER_SNAKE_CASE`      | `CENTRO_OESTE`, `MATA_ATLANTICA` |

---

## 3. Rotas e Controllers

- O decorator `@Controller()` deve receber o nome do recurso no plural e em inglês quando possível (ex.: `@Controller('producers')`, `@Controller('samples')`).
- Rotas seguem REST padrão:
  - `GET /recurso` → listar todos
  - `GET /recurso/:id` → buscar por ID
  - `POST /recurso` → criar
  - `PATCH /recurso/:id` → atualizar parcialmente
  - `DELETE /recurso/:id` → remover
- Todo controller que manipula dados sensíveis deve aplicar `@UseGuards(ClerkAuthGuard)` no nível da classe.

---

## 4. Serviços e Lógica de Negócio

- A injeção do `PrismaService` deve ser feita pelo construtor (`constructor(private prisma: PrismaService)`).
- Antes de qualquer operação de `update` ou `remove`, o serviço **deve** chamar `findOne(id)` para garantir que o recurso existe e lançar `NotFoundException` se não for encontrado.
- Métodos de serviço devem ser `async` e retornar diretamente o resultado do Prisma (sem wrappers desnecessários).

```typescript
// Padrão obrigatório para update/remove
async update(id: string, dto: UpdateFooDto) {
  await this.findOne(id); // garante existência antes de operar
  return this.prisma.foo.update({ where: { id }, data: dto });
}
```

---

## 5. Tratamento de Erros

- Use as exceções HTTP nativas do NestJS (`NotFoundException`, `BadRequestException`, `ForbiddenException`, etc.) nos serviços.
- Todas as respostas de erro passam pelo `HttpExceptionFilter` global, que padroniza o formato:

```json
{
  "statusCode": 404,
  "timestamp": "2026-03-19T12:00:00.000Z",
  "path": "/producers/123",
  "message": "Producer with id 123 not found"
}
```

- Nunca lance `Error` genérico em serviços — sempre use as classes de exceção do `@nestjs/common`.

---

## 6. Commits e Versionamento

- Use mensagens de commit em português ou inglês, curtas e descritivas.
- Prefixos recomendados seguindo Conventional Commits:
  - `feat:` — nova funcionalidade
  - `fix:` — correção de bug
  - `chore:` — tarefas de manutenção (deps, config)
  - `refactor:` — refatoração sem mudança de comportamento
  - `test:` — adição ou correção de testes
  - `docs:` — alterações em documentação

---

## 7. Testes

- Arquivos de teste unitário ficam junto ao arquivo testado: `*.spec.ts`.
- Testes E2E ficam em `test/` com sufixo `*.e2e-spec.ts`.
- Para rodar os testes:
  ```bash
  # Unitários
  npm test

  # Com cobertura
  npm run test:cov

  # E2E
  npm run test:e2e
  ```
- Cobertura mínima esperada: serviços (`*.service.ts`) devem ter testes unitários cobrindo os cenários de sucesso e `NotFoundException`.

---

## 8. Linting e Formatação

- Antes de qualquer push, execute:
  ```bash
  npm run lint    # ESLint com auto-fix
  npm run format  # Prettier
  ```
- O pipeline não aceita código com erros de lint.
- A configuração de lint está em `eslint.config.mjs` e a de formatação segue as regras do Prettier integrado ao ESLint (`eslint-plugin-prettier`).

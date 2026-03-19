---
applyTo: "src/**/*.ts"
---

# Análise de Código

Ao analisar qualquer arquivo TypeScript do projeto, verifique obrigatoriamente:

## Arquitetura e Camadas

1. **Controllers** (`*.controller.ts`) NÃO devem:
   - Acessar `PrismaService` diretamente
   - Conter lógica de negócio (if/else de domínio, cálculos)
   - Manipular exceções — o `HttpExceptionFilter` global cuida disso

2. **UseCases** (`usecases/*.usecase.ts`) devem:
   - Implementar UMA ÚNICA regra de negócio (SRP)
   - Receber o Repository via `@Inject('I<Modulo>Repository')` — nunca o `PrismaService` direto
   - Lançar exceções do NestJS (`NotFoundException`, `BadRequestException`)
   - NÃO conhecer HTTP (headers, status codes, request/response)

3. **Repositories** (`repositories/*.repository.ts`):
   - A interface define o contrato — sem implementação
   - A implementação Prisma (`prisma-*.repository.ts`) acessa o banco — sem lógica de negócio
   - O Module faz o binding: `{ provide: 'IFooRepository', useClass: PrismaFooRepository }`

4. **DTOs** (`dto/*.dto.ts`) devem:
   - Exportar schema Zod + tipo inferido (`z.infer<typeof schema>`)
   - NUNCA usar `class-validator` ou `class-transformer`
   - Update DTOs reutilizam create via `.partial()`

## Tipagem

- Todo `import` de tipo deve usar `import type`
- Proibido `any` como atalho — use `unknown` + type narrowing
- Métodos `async` DEVEM conter `await`. Se não usa `await`, remova `async`
- `@typescript-eslint/no-floating-promises: warn` — toda Promise deve ser awaited ou ter `.catch()`
- `@typescript-eslint/no-unsafe-argument: warn` — argumentos devem ser tipados

## Padrões obrigatórios

- `findOne(id)` ANTES de `update`/`remove` para garantir existência
- Exceções: usar `NotFoundException`, `BadRequestException` etc. — NUNCA `throw new Error()`
- Autenticação: `@UseGuards(ClerkAuthGuard)` no nível da classe do controller — importar de `common/guards/`
- Autorização: `@Roles()` — importar de `common/decorators/`
- Validação: `@Body(new ZodValidationPipe(schema))` no controller — importar de `common/pipes/`
- Guards, decorators e pipes são compartilhados em `src/common/` — NUNCA duplicar dentro de módulos

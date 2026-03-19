---
applyTo: "**/*.ts"
---

# Tipagem e Padrões ESLint

Regras obrigatórias de tipagem TypeScript e conformidade com ESLint para todo arquivo `.ts` do projeto.

## Configuração ativa

- ESLint 9 com `typescript-eslint/recommendedTypeChecked` (análise com tipos)
- Prettier integrado via `eslint-plugin-prettier`
- TypeScript com `strictNullChecks: true`, `target: ES2023`, `module: nodenext`

## Regras ESLint críticas

| Regra | Nível | O que faz |
|-------|-------|-----------|
| `@typescript-eslint/no-floating-promises` | warn | Toda Promise deve ter `await`, `.then()` ou `.catch()` |
| `@typescript-eslint/no-unsafe-argument` | warn | Argumentos passados a funções devem ser tipados (sem `any` implícito) |
| `@typescript-eslint/require-await` | error | Método `async` DEVE conter `await`. Se não usa `await`, remova `async` |
| `@typescript-eslint/no-explicit-any` | off | Permitido, mas **EVITE** — prefira `unknown` + type narrowing |
| `prettier/prettier` | error | Código deve seguir formatação Prettier (aspas simples, trailing comma, endOfLine auto) |

## Import de tipos

SEMPRE use `import type` para importações que são apenas tipos:

```typescript
// ✅ Correto
import type { CreateProducerDto } from './dto/create-producer.dto';
import type { Request } from 'express';

// ❌ Errado — importa valor quando só precisa do tipo
import { CreateProducerDto } from './dto/create-producer.dto';
```

## Async/Await

```typescript
// ✅ Correto — async com await
async findOne(id: string) {
  const item = await this.repo.findOne(id);
  if (!item) throw new NotFoundException(`Item ${id} not found`);
  return item;
}

// ✅ Correto — sem async quando não precisa
findOne(id: string) {
  return this.repo.findOne(id);
}

// ❌ Errado — async sem await (ESLint: require-await)
async handleEvent(event: Event): Promise<void> {
  this.logger.log(event.type); // síncrono, não precisa de async
}
```

## unknowm vs any

```typescript
// ✅ Correto — unknown + narrowing
function processValue(value: unknown) {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  throw new BadRequestException('Expected a string');
}

// ❌ Errado — any como atalho
function processValue(value: any) {
  return value.toUpperCase(); // sem segurança de tipo
}
```

## Promises

```typescript
// ✅ Correto — await na Promise
await this.repo.remove(id);

// ✅ Correto — retorno direto (sem floating)
return this.repo.findAll();

// ❌ Errado — floating promise (ESLint: no-floating-promises)
this.repo.remove(id); // promise ignorada
```

## Prettier (formatação)

Configuração em `.prettierrc`:
```json
{
  "singleQuote": true,
  "trailingComma": "all"
}
```

Integrado ao ESLint — erros de formatação são erros de lint.

## Comandos obrigatórios

```bash
npm run format    # auto-formata com Prettier
npm run lint      # verifica e auto-corrige com ESLint
```

**Rodar SEMPRE antes de comitar.** Código com warnings pendentes NÃO deve ser mergeado.

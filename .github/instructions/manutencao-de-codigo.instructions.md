---
applyTo: "src/**/*.ts"
---

# Manutenção de Código

Ao alterar código existente, editar módulos ou corrigir bugs, siga estas regras.

## Antes de alterar

1. Leia e entenda o arquivo completo antes de modificar
2. Identifique a camada onde a mudança deve ocorrer:
   - **Bug de rota/validação** → Controller
   - **Bug de regra de negócio** → UseCase
   - **Bug de query/dados** → Repository (implementação Prisma)
   - **Bug de schema** → DTO
3. NÃO mova lógica para camada errada (ex.: colocar query no controller)

## Regras de refatoração

- **Extrair para UseCase**: se um Service tem lógica complexa, quebre em UseCases separados (1 UseCase = 1 responsabilidade)
- **Extrair para Repository**: se um UseCase acessa `PrismaService` diretamente, mova para a interface + implementação do Repository
- **Nunca apagar testes**: ao alterar um Service/UseCase, atualize o teste correspondente. Se não existe teste, crie.

## Ao adicionar campo no Prisma Schema

1. Editar `prisma/schema.prisma`
2. Rodar `npx prisma migrate dev --name descricao-da-mudanca`
3. Atualizar o DTO de criação (`create-*.dto.ts`) com o novo campo no schema Zod
4. Atualizar o Repository (interface + implementação) se o campo afeta queries
5. Atualizar o UseCase se há nova regra de negócio

## Ao adicionar nova rota

1. Criar UseCase correspondente em `usecases/`
2. Adicionar método no Repository (interface + implementação) se precisar de nova query
3. Adicionar rota no Controller delegando ao UseCase
4. Aplicar `ZodValidationPipe` se há body
5. Aplicar `@UseGuards(ClerkAuthGuard)` se rota é protegida

## Ao alterar autenticação/autorização

- Guards ficam APENAS no controller (decorator `@UseGuards`)
- Roles ficam APENAS no controller (decorator `@Roles`)
- UseCase NUNCA verifica autenticação — assume que o controller já validou

## Validação pós-alteração obrigatória

Após QUALQUER alteração, executar nesta ordem:

```bash
npm run format    # Prettier - formatação
npm run lint      # ESLint - qualidade + estilo
npm test          # Jest - testes unitários
```

Se o lint falhar, corrija ANTES de comitar. Warnings também devem ser resolvidos:
- `@typescript-eslint/no-floating-promises` → adicione `await` ou `.catch()`
- `@typescript-eslint/no-unsafe-argument` → tipar o argumento corretamente
- `@typescript-eslint/require-await` → remova `async` se não há `await`

## Commits de manutenção

- `fix:` para correção de bugs
- `refactor:` para mudanças sem alterar comportamento
- `chore:` para dependências e configs
- Mensagem curta, descritiva, em português ou inglês

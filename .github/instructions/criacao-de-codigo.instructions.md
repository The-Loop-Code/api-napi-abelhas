---
applyTo: "src/**/*.ts"
---

# Criação de Código

Ao criar novos arquivos ou funcionalidades neste projeto, siga rigidamente a estrutura abaixo.

## Estrutura de Módulo Completa

Todo módulo de domínio (rotas da API) fica em `src/modules/`. NUNCA crie módulos de domínio na raiz de `src/`.

Cada módulo de domínio DEVE ter esta estrutura:

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

## Modelo de Repository (Interface)

```typescript
export interface IProducerRepository {
  create(data: CreateProducerDto): Promise<Producer>;
  findAll(): Promise<Producer[]>;
  findOne(id: string): Promise<Producer | null>;
  update(id: string, data: UpdateProducerDto): Promise<Producer>;
  remove(id: string): Promise<Producer>;
}
```

## Modelo de Repository (Implementação Prisma)

```typescript
@Injectable()
export class PrismaProducerRepository implements IProducerRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateProducerDto) {
    return this.prisma.produtor.create({ data });
  }

  async findAll() {
    return this.prisma.produtor.findMany();
  }

  async findOne(id: string) {
    return this.prisma.produtor.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateProducerDto) {
    return this.prisma.produtor.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.produtor.delete({ where: { id } });
  }
}
```

## Modelo de UseCase

```typescript
@Injectable()
export class CreateProducerUseCase {
  constructor(
    @Inject('IProducerRepository')
    private readonly repo: IProducerRepository,
  ) {}

  async execute(dto: CreateProducerDto) {
    return this.repo.create(dto);
  }
}
```

```typescript
@Injectable()
export class FindOneProducerUseCase {
  constructor(
    @Inject('IProducerRepository')
    private readonly repo: IProducerRepository,
  ) {}

  async execute(id: string) {
    const producer = await this.repo.findOne(id);
    if (!producer) {
      throw new NotFoundException(`Producer with id ${id} not found`);
    }
    return producer;
  }
}
```

```typescript
@Injectable()
export class UpdateProducerUseCase {
  constructor(
    @Inject('IProducerRepository')
    private readonly repo: IProducerRepository,
    private readonly findOne: FindOneProducerUseCase,
  ) {}

  async execute(id: string, dto: UpdateProducerDto) {
    await this.findOne.execute(id); // garante existência
    return this.repo.update(id, dto);
  }
}
```

## Modelo de Controller

```typescript
@Controller('producers')
@UseGuards(ClerkAuthGuard)
export class ProducersController {
  constructor(
    private readonly createUseCase: CreateProducerUseCase,
    private readonly findAllUseCase: FindAllProducerUseCase,
    private readonly findOneUseCase: FindOneProducerUseCase,
    private readonly updateUseCase: UpdateProducerUseCase,
    private readonly removeUseCase: RemoveProducerUseCase,
  ) {}

  @Post()
  create(@Body(new ZodValidationPipe(createProducerSchema)) dto: CreateProducerDto) {
    return this.createUseCase.execute(dto);
  }

  @Get()
  findAll() { return this.findAllUseCase.execute(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.findOneUseCase.execute(id); }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateProducerSchema)) dto: UpdateProducerDto,
  ) { return this.updateUseCase.execute(id, dto); }

  @Delete(':id')
  remove(@Param('id') id: string) { return this.removeUseCase.execute(id); }
}
```

## Modelo de Module (com DIP binding)

```typescript
@Module({
  controllers: [ProducersController],
  providers: [
    CreateProducerUseCase,
    FindAllProducerUseCase,
    FindOneProducerUseCase,
    UpdateProducerUseCase,
    RemoveProducerUseCase,
    { provide: 'IProducerRepository', useClass: PrismaProducerRepository },
  ],
  exports: [FindOneProducerUseCase], // apenas se outros módulos precisarem
})
export class ProducersModule {}
```

## Modelo de DTO (Zod)

```typescript
// create-producer.dto.ts
import { z } from 'zod';

export const createProducerSchema = z.object({
  nome: z.string().min(1),
  cidadeId: z.string().uuid().optional(),
});

export type CreateProducerDto = z.infer<typeof createProducerSchema>;
```

```typescript
// update-producer.dto.ts
import { z } from 'zod';
import { createProducerSchema } from './create-producer.dto';

export const updateProducerSchema = createProducerSchema.partial();
export type UpdateProducerDto = z.infer<typeof updateProducerSchema>;
```

## Nomenclatura de Arquivos

- Todos em `kebab-case`
- Classes em `PascalCase`
- Variáveis/funções em `camelCase`
- Constantes em `UPPER_SNAKE_CASE`

## Imports de elementos compartilhados

Guards, decorators e pipes são globais em `common/`. Importar sempre de lá:

```typescript
// ✅ Correto — importar de common/
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';

// ❌ Errado — NUNCA duplicar guards/decorators dentro de módulos
import { ClerkAuthGuard } from './guards/clerk-auth.guard';
```

## Após criar qualquer código

Rodar obrigatoriamente:
```bash
npm run lint
npm run format
npm test
```

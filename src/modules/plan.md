# Plano de Módulos — api-napi-abelhas

> Baseado no `prisma/schema.prisma` e nas convenções do projeto.
> Cada módulo segue a estrutura: Controller → UseCase → Repository (interface + Prisma) → DTO (Zod).

---

## 1. `cidades-ibge` — Cidades IBGE

**Model Prisma:** `CidadesIBGE`
**Descrição:** Tabela de consulta (lookup) de cidades conforme dados do IBGE. Sem criação/edição pelo usuário — dados populados via seed.
**Rotas:** somente leitura.

| Método | Rota                  | UseCase               | Descrição                            |
|--------|-----------------------|-----------------------|--------------------------------------|
| GET    | `/cidades-ibge`       | `FindAllCidadesIbge`  | Listar cidades (com filtros opcionais: estado, região, bioma) |
| GET    | `/cidades-ibge/:id`   | `FindOneCidadesIbge`  | Buscar cidade por ID                 |

**Estrutura:**

```
src/modules/cidades-ibge/
  cidades-ibge.module.ts
  cidades-ibge.controller.ts
  usecases/
    find-all-cidades-ibge.usecase.ts
    find-one-cidades-ibge.usecase.ts
  repositories/
    cidades-ibge.repository.ts
    prisma-cidades-ibge.repository.ts
  dto/
    query-cidades-ibge.dto.ts      # filtros opcionais (estado, regiao, bioma)
```

**Observações:**

- Não possui DTOs de criação/atualização — dados vêm de seed.
- DTO de query para filtros no `findAll` (query params).
- Interface do repository expõe apenas `findAll(filters?)` e `findOne(id)`.

---

## 2. `produtores` — Produtores

**Model Prisma:** `Produtor`
**Descrição:** CRUD completo de apicultores/meliponicultores.
**Relações:** pertence a `CidadesIBGE` (opcional), possui muitas `Amostra`.

| Método | Rota                 | UseCase              | Descrição               |
|--------|----------------------|----------------------|--------------------------|
| POST   | `/produtores`        | `CreateProdutor`     | Criar produtor           |
| GET    | `/produtores`        | `FindAllProdutor`    | Listar produtores        |
| GET    | `/produtores/:id`    | `FindOneProdutor`    | Buscar produtor por ID   |
| PATCH  | `/produtores/:id`    | `UpdateProdutor`     | Atualizar produtor       |
| DELETE | `/produtores/:id`    | `RemoveProdutor`     | Remover produtor         |

**Estrutura:**

```
src/modules/produtores/
  produtores.module.ts
  produtores.controller.ts
  usecases/
    create-produtor.usecase.ts
    find-all-produtores.usecase.ts
    find-one-produtor.usecase.ts
    update-produtor.usecase.ts
    remove-produtor.usecase.ts
  repositories/
    produtores.repository.ts
    prisma-produtores.repository.ts
  dto/
    create-produtor.dto.ts
    update-produtor.dto.ts
```

**DTO de criação (`create-produtor.dto.ts`):**

```typescript
// Campos: nome (string, required), cidadeId (string/uuid, optional)
```

**DTO de atualização:** `createProdutorSchema.partial()`

---

## 3. `responsaveis` — Responsáveis

**Model Prisma:** `Responsavel`
**Descrição:** CRUD de responsáveis técnicos (analistas) por análises laboratoriais.
**Relações:** pertence a `CidadesIBGE` (opcional), possui muitas `Analise`. Campo `instituicaoId` é único.

| Método | Rota                   | UseCase                | Descrição                 |
|--------|------------------------|------------------------|---------------------------|
| POST   | `/responsaveis`        | `CreateResponsavel`    | Criar responsável         |
| GET    | `/responsaveis`        | `FindAllResponsavel`   | Listar responsáveis       |
| GET    | `/responsaveis/:id`    | `FindOneResponsavel`   | Buscar responsável por ID |
| PATCH  | `/responsaveis/:id`    | `UpdateResponsavel`    | Atualizar responsável     |
| DELETE | `/responsaveis/:id`    | `RemoveResponsavel`    | Remover responsável       |

**Estrutura:**

```
src/modules/responsaveis/
  responsaveis.module.ts
  responsaveis.controller.ts
  usecases/
    create-responsavel.usecase.ts
    find-all-responsaveis.usecase.ts
    find-one-responsavel.usecase.ts
    update-responsavel.usecase.ts
    remove-responsavel.usecase.ts
  repositories/
    responsaveis.repository.ts
    prisma-responsaveis.repository.ts
  dto/
    create-responsavel.dto.ts
    update-responsavel.dto.ts
```

**DTO de criação:**

```typescript
// Campos: nome (string, required), instituicaoId (string, required, unique), cidadeId (string/uuid, optional)
```

---

## 4. `tipos-amostra` — Tipos de Amostra

**Model Prisma:** `TipoAmostra`
**Descrição:** Tabela de tipos de amostra (mel, pólen, própolis, etc.). CRUD completo para administradores.
**Relações:** possui muitas `Amostra`.

| Método | Rota                    | UseCase                | Descrição                    |
|--------|-------------------------|------------------------|------------------------------|
| POST   | `/tipos-amostra`        | `CreateTipoAmostra`   | Criar tipo de amostra        |
| GET    | `/tipos-amostra`        | `FindAllTipoAmostra`  | Listar tipos de amostra      |
| GET    | `/tipos-amostra/:id`    | `FindOneTipoAmostra`  | Buscar tipo de amostra por ID|
| PATCH  | `/tipos-amostra/:id`    | `UpdateTipoAmostra`   | Atualizar tipo de amostra    |
| DELETE | `/tipos-amostra/:id`    | `RemoveTipoAmostra`   | Remover tipo de amostra      |

**Estrutura:**

```
src/modules/tipos-amostra/
  tipos-amostra.module.ts
  tipos-amostra.controller.ts
  usecases/
    create-tipo-amostra.usecase.ts
    find-all-tipos-amostra.usecase.ts
    find-one-tipo-amostra.usecase.ts
    update-tipo-amostra.usecase.ts
    remove-tipo-amostra.usecase.ts
  repositories/
    tipos-amostra.repository.ts
    prisma-tipos-amostra.repository.ts
  dto/
    create-tipo-amostra.dto.ts
    update-tipo-amostra.dto.ts
```

**DTO de criação:**

```typescript
// Campos: nome (string, required, unique), descricao (string, optional)
```

---

## 5. `tipos-analise` — Tipos de Análise

**Model Prisma:** `TipoAnalise`
**Descrição:** Tabela de tipos de análise laboratorial. CRUD completo para administradores.
**Relações:** possui muitas `Analise`.

| Método | Rota                     | UseCase                | Descrição                      |
|--------|--------------------------|------------------------|--------------------------------|
| POST   | `/tipos-analise`         | `CreateTipoAnalise`   | Criar tipo de análise          |
| GET    | `/tipos-analise`         | `FindAllTipoAnalise`  | Listar tipos de análise        |
| GET    | `/tipos-analise/:id`     | `FindOneTipoAnalise`  | Buscar tipo de análise por ID  |
| PATCH  | `/tipos-analise/:id`     | `UpdateTipoAnalise`   | Atualizar tipo de análise      |
| DELETE | `/tipos-analise/:id`     | `RemoveTipoAnalise`   | Remover tipo de análise        |

**Estrutura:**

```
src/modules/tipos-analise/
  tipos-analise.module.ts
  tipos-analise.controller.ts
  usecases/
    create-tipo-analise.usecase.ts
    find-all-tipos-analise.usecase.ts
    find-one-tipo-analise.usecase.ts
    update-tipo-analise.usecase.ts
    remove-tipo-analise.usecase.ts
  repositories/
    tipos-analise.repository.ts
    prisma-tipos-analise.repository.ts
  dto/
    create-tipo-analise.dto.ts
    update-tipo-analise.dto.ts
```

**DTO de criação:**

```typescript
// Campos: nome (string, required, unique)
```

---

## 6. `abelhas` — Abelhas

**Model Prisma:** `Abelha`
**Descrição:** CRUD de espécies de abelhas catalogadas.
**Relações:** possui muitas `Amostra`.

| Método | Rota               | UseCase            | Descrição                  |
|--------|--------------------|--------------------|-----------------------------|
| POST   | `/abelhas`         | `CreateAbelha`     | Criar espécie de abelha     |
| GET    | `/abelhas`         | `FindAllAbelha`    | Listar espécies de abelha   |
| GET    | `/abelhas/:id`     | `FindOneAbelha`    | Buscar espécie por ID       |
| PATCH  | `/abelhas/:id`     | `UpdateAbelha`     | Atualizar espécie           |
| DELETE | `/abelhas/:id`     | `RemoveAbelha`     | Remover espécie             |

**Estrutura:**

```
src/modules/abelhas/
  abelhas.module.ts
  abelhas.controller.ts
  usecases/
    create-abelha.usecase.ts
    find-all-abelhas.usecase.ts
    find-one-abelha.usecase.ts
    update-abelha.usecase.ts
    remove-abelha.usecase.ts
  repositories/
    abelhas.repository.ts
    prisma-abelhas.repository.ts
  dto/
    create-abelha.dto.ts
    update-abelha.dto.ts
```

**DTO de criação:**

```typescript
// Campos: nomeCientifico (string, required, unique), nomePopular (string, optional),
//         semFerrao (boolean, default true), nativa (boolean, default true), descricao (string, optional)
```

---

## 7. `pontos-coleta` — Pontos de Coleta

**Model Prisma:** `PontoColeta`
**Descrição:** CRUD de pontos geográficos onde são realizadas coletas de amostras.
**Relações:** pertence a `CidadesIBGE` (obrigatório), possui muitas `Amostra`.

| Método | Rota                     | UseCase                | Descrição                      |
|--------|--------------------------|------------------------|--------------------------------|
| POST   | `/pontos-coleta`         | `CreatePontoColeta`   | Criar ponto de coleta          |
| GET    | `/pontos-coleta`         | `FindAllPontoColeta`  | Listar pontos de coleta        |
| GET    | `/pontos-coleta/:id`     | `FindOnePontoColeta`  | Buscar ponto de coleta por ID  |
| PATCH  | `/pontos-coleta/:id`     | `UpdatePontoColeta`   | Atualizar ponto de coleta      |
| DELETE | `/pontos-coleta/:id`     | `RemovePontoColeta`   | Remover ponto de coleta        |

**Estrutura:**

```
src/modules/pontos-coleta/
  pontos-coleta.module.ts
  pontos-coleta.controller.ts
  usecases/
    create-ponto-coleta.usecase.ts
    find-all-pontos-coleta.usecase.ts
    find-one-ponto-coleta.usecase.ts
    update-ponto-coleta.usecase.ts
    remove-ponto-coleta.usecase.ts
  repositories/
    pontos-coleta.repository.ts
    prisma-pontos-coleta.repository.ts
  dto/
    create-ponto-coleta.dto.ts
    update-ponto-coleta.dto.ts
```

**DTO de criação:**

```typescript
// Campos: nome (string, required), latitude (number, required), longitude (number, required),
//         raio (number, optional), cidadeId (string/uuid, required)
```

---

## 8. `amostras` — Amostras

**Model Prisma:** `Amostra`
**Descrição:** CRUD principal — gerencia amostras laboratoriais coletadas em campo.
**Relações:** pertence a `PontoColeta`, `Abelha`, `Produtor`, `TipoAmostra`. Possui muitas `Analise` e `FileGroup`.

| Método | Rota                | UseCase             | Descrição                 |
|--------|---------------------|---------------------|---------------------------|
| POST   | `/amostras`         | `CreateAmostra`     | Criar amostra             |
| GET    | `/amostras`         | `FindAllAmostra`    | Listar amostras           |
| GET    | `/amostras/:id`     | `FindOneAmostra`    | Buscar amostra por ID     |
| PATCH  | `/amostras/:id`     | `UpdateAmostra`     | Atualizar amostra         |
| DELETE | `/amostras/:id`     | `RemoveAmostra`     | Remover amostra           |

**Estrutura:**

```
src/modules/amostras/
  amostras.module.ts
  amostras.controller.ts
  usecases/
    create-amostra.usecase.ts
    find-all-amostras.usecase.ts
    find-one-amostra.usecase.ts
    update-amostra.usecase.ts
    remove-amostra.usecase.ts
  repositories/
    amostras.repository.ts
    prisma-amostras.repository.ts
  dto/
    create-amostra.dto.ts
    update-amostra.dto.ts
```

**DTO de criação:**

```typescript
// Campos: nome (string, required), dataColeta (string/date ISO, required),
//         pontoColetaId (uuid, required), abelhaId (uuid, required),
//         produtorId (uuid, required), tipoAmostraId (uuid, required)
```

**Observações:**

- `findOne` deve incluir relações (pontoColeta, abelha, produtor, tipoAmostra) via Prisma `include`.
- `findAll` pode suportar filtros por tipoAmostra, produtor, abelha, período.

---

## 9. `analises` — Análises

**Model Prisma:** `Analise`
**Descrição:** CRUD de análises laboratoriais vinculadas a amostras.
**Relações:** pertence a `Amostra` (cascade delete), `TipoAnalise`, `Responsavel`. Possui muitos `FileGroup`.

| Método | Rota                | UseCase             | Descrição                |
|--------|---------------------|---------------------|--------------------------|
| POST   | `/analises`         | `CreateAnalise`     | Criar análise            |
| GET    | `/analises`         | `FindAllAnalise`    | Listar análises          |
| GET    | `/analises/:id`     | `FindOneAnalise`    | Buscar análise por ID    |
| PATCH  | `/analises/:id`     | `UpdateAnalise`     | Atualizar análise        |
| DELETE | `/analises/:id`     | `RemoveAnalise`     | Remover análise          |

**Estrutura:**

```
src/modules/analises/
  analises.module.ts
  analises.controller.ts
  usecases/
    create-analise.usecase.ts
    find-all-analises.usecase.ts
    find-one-analise.usecase.ts
    update-analise.usecase.ts
    remove-analise.usecase.ts
  repositories/
    analises.repository.ts
    prisma-analises.repository.ts
  dto/
    create-analise.dto.ts
    update-analise.dto.ts
```

**DTO de criação:**

```typescript
// Campos: amostraId (uuid, required), tipoAnaliseId (uuid, required), responsavelId (uuid, required)
```

**Observações:**

- `findOne` deve incluir relações (amostra, tipoAnalise, responsavel).
- Ao remover uma `Amostra`, as análises vinculadas são removidas em cascata pelo Prisma (`onDelete: Cascade`).

---

## 10. `file-groups` — Grupos de Arquivos

**Models Prisma:** `FileGroup` + `File`
**Descrição:** Gerenciamento de grupos de arquivos vinculados a amostras ou análises. Um `FileGroup` agrupa múltiplos `File` e se conecta a uma `Amostra` ou `Analise`.
**Relações:** pertence a `Amostra` (opcional) ou `Analise` (opcional). Possui muitos `File`. Constraint unique em `[amostraId, analiseId]`.

| Método | Rota                          | UseCase                 | Descrição                           |
|--------|-------------------------------|-------------------------|--------------------------------------|
| POST   | `/file-groups`                | `CreateFileGroup`       | Criar grupo de arquivos              |
| GET    | `/file-groups`                | `FindAllFileGroup`      | Listar grupos (filtro por amostra/análise) |
| GET    | `/file-groups/:id`            | `FindOneFileGroup`      | Buscar grupo por ID (com arquivos)   |
| PATCH  | `/file-groups/:id`            | `UpdateFileGroup`       | Atualizar vínculo do grupo           |
| DELETE | `/file-groups/:id`            | `RemoveFileGroup`       | Remover grupo e arquivos (cascade)   |
| POST   | `/file-groups/:id/files`      | `AddFileToGroup`        | Adicionar arquivo ao grupo           |
| DELETE | `/file-groups/:id/files/:fid` | `RemoveFileFromGroup`   | Remover arquivo do grupo             |

**Estrutura:**

```
src/modules/file-groups/
  file-groups.module.ts
  file-groups.controller.ts
  usecases/
    create-file-group.usecase.ts
    find-all-file-groups.usecase.ts
    find-one-file-group.usecase.ts
    update-file-group.usecase.ts
    remove-file-group.usecase.ts
    add-file-to-group.usecase.ts
    remove-file-from-group.usecase.ts
  repositories/
    file-groups.repository.ts
    prisma-file-groups.repository.ts
  dto/
    create-file-group.dto.ts
    update-file-group.dto.ts
    add-file.dto.ts
```

**DTO de criação do grupo:**

```typescript
// Campos: amostraId (uuid, optional), analiseId (uuid, optional)
// Regra: pelo menos um dos dois deve ser informado
```

**DTO de adição de arquivo:**

```typescript
// Campos: url (string/url, required), type (enum FileType: IMAGE | TEXTO | PDF | OUTROS, default IMAGE)
```

**Observações:**

- Integrar com o módulo `storage/` existente para gerar URLs pré-assinadas antes de criar o `File`.
- `File` usa `onDelete: Cascade` do `FileGroup` — ao remover o grupo, todos os arquivos são deletados.

---

## Ordem de Implementação Sugerida

A ordem respeita dependências entre models (módulos sem FK externa primeiro):

| Fase | Módulo(s)                                    | Justificativa                                     |
|------|----------------------------------------------|----------------------------------------------------|
| 1    | `cidades-ibge`                               | Sem dependências, base para produtores/responsáveis/pontos |
| 2    | `tipos-amostra`, `tipos-analise`, `abelhas`  | Tabelas de lookup/catálogo, sem dependências externas |
| 3    | `produtores`, `responsaveis`                 | Dependem de `cidades-ibge`                         |
| 4    | `pontos-coleta`                              | Depende de `cidades-ibge`                          |
| 5    | `amostras`                                   | Depende de `pontos-coleta`, `abelhas`, `produtores`, `tipos-amostra` |
| 6    | `analises`                                   | Depende de `amostras`, `tipos-analise`, `responsaveis` |
| 7    | `file-groups`                                | Depende de `amostras`, `analises`, integra com `storage` |

---

## Resumo de Autenticação e Autorização

| Módulo            | Auth Guard          | Roles              |
|-------------------|---------------------|--------------------|
| `cidades-ibge`    | `ClerkAuthGuard`    | — (leitura aberta a qualquer autenticado) |
| `produtores`      | `ClerkAuthGuard`    | CRUD: `ADMIN`      |
| `responsaveis`    | `ClerkAuthGuard`    | CRUD: `ADMIN`      |
| `tipos-amostra`   | `ClerkAuthGuard`    | Escrita: `ADMIN`   |
| `tipos-analise`   | `ClerkAuthGuard`    | Escrita: `ADMIN`   |
| `abelhas`         | `ClerkAuthGuard`    | Escrita: `ADMIN`   |
| `pontos-coleta`   | `ClerkAuthGuard`    | CRUD: `ADMIN`      |
| `amostras`        | `ClerkAuthGuard`    | CRUD: `ADMIN`      |
| `analises`        | `ClerkAuthGuard`    | CRUD: `ADMIN`      |
| `file-groups`     | `ClerkAuthGuard`    | CRUD: `ADMIN`      |

---

## Total de Arquivos a Criar

| Módulo          | Arquivos |
|-----------------|----------|
| cidades-ibge    | 6        |
| produtores      | 9        |
| responsaveis    | 9        |
| tipos-amostra   | 9        |
| tipos-analise   | 9        |
| abelhas         | 9        |
| pontos-coleta   | 9        |
| amostras        | 9        |
| analises        | 9        |
| file-groups     | 12       |
| **Total**       | **90**   |

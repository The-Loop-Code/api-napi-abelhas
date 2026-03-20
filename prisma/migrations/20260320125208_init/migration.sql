-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO');

-- CreateEnum
CREATE TYPE "Regiao" AS ENUM ('NORTE', 'NORDESTE', 'CENTRO_OESTE', 'SUDESTE', 'SUL');

-- CreateEnum
CREATE TYPE "Bioma" AS ENUM ('AMAZONIA', 'CERRADO', 'MATA_ATLANTICA', 'CAATINGA', 'PAMPA', 'PANTANAL');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('IMAGE', 'TEXTO', 'PDF', 'OUTROS');

-- CreateTable
CREATE TABLE "CidadesIBGE" (
    "id" TEXT NOT NULL,
    "codigoIBGE" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" "Estado" NOT NULL,
    "regiao" "Regiao" NOT NULL,
    "bioma" "Bioma",

    CONSTRAINT "CidadesIBGE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produtor" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cidadeId" TEXT,

    CONSTRAINT "Produtor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Responsavel" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "instituicaoId" TEXT NOT NULL,
    "cidadeId" TEXT,

    CONSTRAINT "Responsavel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoAmostra" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,

    CONSTRAINT "TipoAmostra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TipoAnalise" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "TipoAnalise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Abelha" (
    "id" TEXT NOT NULL,
    "nomeCientifico" TEXT NOT NULL,
    "nomePopular" TEXT,
    "semFerrao" BOOLEAN NOT NULL DEFAULT true,
    "nativa" BOOLEAN NOT NULL DEFAULT true,
    "descricao" TEXT,

    CONSTRAINT "Abelha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileGroup" (
    "id" TEXT NOT NULL,
    "amostraId" TEXT,
    "analiseId" TEXT,

    CONSTRAINT "FileGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "FileType" NOT NULL DEFAULT 'IMAGE',
    "fileGroupId" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PontoColeta" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "raio" DOUBLE PRECISION,
    "cidadeId" TEXT NOT NULL,

    CONSTRAINT "PontoColeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amostra" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "dataColeta" TIMESTAMP(3) NOT NULL,
    "pontoColetaId" TEXT NOT NULL,
    "abelhaId" TEXT NOT NULL,
    "produtorId" TEXT NOT NULL,
    "tipoAmostraId" TEXT NOT NULL,

    CONSTRAINT "Amostra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analise" (
    "id" TEXT NOT NULL,
    "amostraId" TEXT NOT NULL,
    "tipoAnaliseId" TEXT NOT NULL,
    "responsavelId" TEXT NOT NULL,

    CONSTRAINT "Analise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CidadesIBGE_codigoIBGE_key" ON "CidadesIBGE"("codigoIBGE");

-- CreateIndex
CREATE UNIQUE INDEX "Responsavel_instituicaoId_key" ON "Responsavel"("instituicaoId");

-- CreateIndex
CREATE UNIQUE INDEX "TipoAmostra_nome_key" ON "TipoAmostra"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "TipoAnalise_nome_key" ON "TipoAnalise"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Abelha_nomeCientifico_key" ON "Abelha"("nomeCientifico");

-- CreateIndex
CREATE UNIQUE INDEX "FileGroup_amostraId_analiseId_key" ON "FileGroup"("amostraId", "analiseId");

-- CreateIndex
CREATE UNIQUE INDEX "File_url_key" ON "File"("url");

-- AddForeignKey
ALTER TABLE "Produtor" ADD CONSTRAINT "Produtor_cidadeId_fkey" FOREIGN KEY ("cidadeId") REFERENCES "CidadesIBGE"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Responsavel" ADD CONSTRAINT "Responsavel_cidadeId_fkey" FOREIGN KEY ("cidadeId") REFERENCES "CidadesIBGE"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileGroup" ADD CONSTRAINT "FileGroup_amostraId_fkey" FOREIGN KEY ("amostraId") REFERENCES "Amostra"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileGroup" ADD CONSTRAINT "FileGroup_analiseId_fkey" FOREIGN KEY ("analiseId") REFERENCES "Analise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_fileGroupId_fkey" FOREIGN KEY ("fileGroupId") REFERENCES "FileGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PontoColeta" ADD CONSTRAINT "PontoColeta_cidadeId_fkey" FOREIGN KEY ("cidadeId") REFERENCES "CidadesIBGE"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amostra" ADD CONSTRAINT "Amostra_pontoColetaId_fkey" FOREIGN KEY ("pontoColetaId") REFERENCES "PontoColeta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amostra" ADD CONSTRAINT "Amostra_abelhaId_fkey" FOREIGN KEY ("abelhaId") REFERENCES "Abelha"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amostra" ADD CONSTRAINT "Amostra_produtorId_fkey" FOREIGN KEY ("produtorId") REFERENCES "Produtor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amostra" ADD CONSTRAINT "Amostra_tipoAmostraId_fkey" FOREIGN KEY ("tipoAmostraId") REFERENCES "TipoAmostra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analise" ADD CONSTRAINT "Analise_amostraId_fkey" FOREIGN KEY ("amostraId") REFERENCES "Amostra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analise" ADD CONSTRAINT "Analise_tipoAnaliseId_fkey" FOREIGN KEY ("tipoAnaliseId") REFERENCES "TipoAnalise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analise" ADD CONSTRAINT "Analise_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "Responsavel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

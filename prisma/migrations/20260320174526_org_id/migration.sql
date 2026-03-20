/*
  Warnings:

  - Added the required column `orgId` to the `Amostra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `Analise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `FileGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `PontoColeta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `Produtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orgId` to the `Responsavel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Amostra" ADD COLUMN     "orgId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Analise" ADD COLUMN     "orgId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "FileGroup" ADD COLUMN     "orgId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PontoColeta" ADD COLUMN     "orgId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Produtor" ADD COLUMN     "orgId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Responsavel" ADD COLUMN     "orgId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Amostra_orgId_idx" ON "Amostra"("orgId");

-- CreateIndex
CREATE INDEX "Analise_orgId_idx" ON "Analise"("orgId");

-- CreateIndex
CREATE INDEX "FileGroup_orgId_idx" ON "FileGroup"("orgId");

-- CreateIndex
CREATE INDEX "PontoColeta_orgId_idx" ON "PontoColeta"("orgId");

-- CreateIndex
CREATE INDEX "Produtor_orgId_idx" ON "Produtor"("orgId");

-- CreateIndex
CREATE INDEX "Responsavel_orgId_idx" ON "Responsavel"("orgId");

/*
  Warnings:

  - Added the required column `updatedAt` to the `Abelha` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Amostra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Analise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `File` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `FileGroup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `PontoColeta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Produtor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Responsavel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TipoAmostra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TipoAnalise` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StatusAnalise" AS ENUM ('PENDENTE', 'EM_PREPARO', 'AGUARDANDO_RESULTADO', 'EM_REVISAO', 'CONCLUIDA', 'REJEITADA');

-- AlterTable
ALTER TABLE "Abelha" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Amostra" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Analise" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "StatusAnalise" NOT NULL DEFAULT 'PENDENTE',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "uploadedByName" TEXT,
ADD COLUMN     "uploadedByUserId" TEXT;

-- AlterTable
ALTER TABLE "FileGroup" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "PontoColeta" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Produtor" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Responsavel" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TipoAmostra" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TipoAnalise" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

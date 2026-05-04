-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'MEMBER');

-- AlterTable
ALTER TABLE "CompanyUser" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'MEMBER';

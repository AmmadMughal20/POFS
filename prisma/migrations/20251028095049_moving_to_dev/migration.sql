-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_branchId_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "branchId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

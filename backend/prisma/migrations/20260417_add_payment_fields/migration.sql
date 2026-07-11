-- AlterTable
ALTER TABLE "Order" ADD COLUMN "orderType" TEXT NOT NULL DEFAULT 'dine-in';
ALTER TABLE "Order" ADD COLUMN "paymentStatus" TEXT NOT NULL DEFAULT 'unpaid';
ALTER TABLE "Order" ADD COLUMN "paymentMethod" TEXT;

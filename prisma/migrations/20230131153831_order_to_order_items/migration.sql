-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "ordersOrderId" INTEGER;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_ordersOrderId_fkey" FOREIGN KEY ("ordersOrderId") REFERENCES "Orders"("orderId") ON DELETE SET NULL ON UPDATE CASCADE;

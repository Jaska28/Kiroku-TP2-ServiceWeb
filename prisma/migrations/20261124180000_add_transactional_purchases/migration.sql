BEGIN;

-- CreateEnum
CREATE TYPE "EditionType" AS ENUM ('MANGA_VOLUME', 'ANIME_EPISODE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'EXPIRED', 'REFUNDED');

-- CreateTable
CREATE TABLE "Product" (
    "productId" UUID NOT NULL,
    "mediaId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "editionType" "EditionType" NOT NULL,
    "editionNumber" INTEGER NOT NULL,
    "priceCents" INTEGER NOT NULL DEFAULT 499,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "Order" (
    "orderId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "currency" CHAR(3) NOT NULL DEFAULT 'cad',
    "subtotalCents" INTEGER NOT NULL,
    "gstCents" INTEGER NOT NULL,
    "qstCents" INTEGER NOT NULL,
    "totalCents" INTEGER NOT NULL,
    "stripeCheckoutSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paidAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "orderItemId" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "productName" TEXT NOT NULL,
    "unitPriceCents" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("orderItemId")
);

-- CreateTable
CREATE TABLE "Refund" (
    "refundId" UUID NOT NULL,
    "orderId" UUID NOT NULL,
    "stripeRefundId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "refundedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("refundId")
);

-- CreateTable
CREATE TABLE "WebhookEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_mediaId_editionType_editionNumber_key" ON "Product"("mediaId", "editionType", "editionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeCheckoutSessionId_key" ON "Order"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripePaymentIntentId_key" ON "Order"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "Order_userId_status_idx" ON "Order"("userId", "status");

-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderItem_orderId_productId_key" ON "OrderItem"("orderId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Refund_orderId_key" ON "Refund"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Refund_stripeRefundId_key" ON "Refund"("stripeRefundId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("mediaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Product" ADD CONSTRAINT "Product_valid_edition_check"
  CHECK ("editionNumber" > 0 AND "priceCents" > 0);

ALTER TABLE "Order" ADD CONSTRAINT "Order_valid_amounts_check"
  CHECK ("subtotalCents" > 0 AND "gstCents" >= 0 AND "qstCents" >= 0
    AND "totalCents" = "subtotalCents" + "gstCents" + "qstCents");

ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_positive_price_check"
  CHECK ("unitPriceCents" > 0);

ALTER TABLE "Refund" ADD CONSTRAINT "Refund_positive_amount_check"
  CHECK ("amountCents" > 0);

COMMIT;

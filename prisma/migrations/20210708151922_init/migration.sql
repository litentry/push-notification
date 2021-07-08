-- CreateTable
CREATE TABLE "subscriptions" (
    "id" SERIAL NOT NULL,
    "device_token" VARCHAR(255) NOT NULL,
    "events" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_addresses" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "subscriptionId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "subscriptions.device_token_index" ON "subscriptions"("device_token");

-- CreateIndex
CREATE INDEX "wallet_addresses.address_index" ON "wallet_addresses"("address");

-- AddForeignKey
ALTER TABLE "wallet_addresses" ADD FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" SERIAL NOT NULL,
    "device_token" VARCHAR(255) NOT NULL,
    "events" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_addresses" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "subscription_id" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions.device_token_unique" ON "subscriptions"("device_token");

-- CreateIndex
CREATE INDEX "subscriptions.device_token_index" ON "subscriptions"("device_token");

-- CreateIndex
CREATE INDEX "wallet_addresses.address_index" ON "wallet_addresses"("address");

-- AddForeignKey
ALTER TABLE "wallet_addresses" ADD FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

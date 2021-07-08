/*
  Warnings:

  - A unique constraint covering the columns `[device_token]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "subscriptions.device_token_unique" ON "subscriptions"("device_token");

/*
  Warnings:

  - The primary key for the `Reservations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `ticketCount` to the `Reservations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservations" DROP CONSTRAINT "Reservations_pkey",
ADD COLUMN     "ticketCount" INTEGER NOT NULL,
ALTER COLUMN "reservationID" DROP DEFAULT,
ALTER COLUMN "reservationID" SET DATA TYPE TEXT,
ADD CONSTRAINT "Reservations_pkey" PRIMARY KEY ("reservationID");
DROP SEQUENCE "Reservations_reservationID_seq";

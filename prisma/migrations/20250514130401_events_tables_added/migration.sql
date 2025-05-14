-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('ONGOING', 'COMPLETE', 'CANCELLED');

-- CreateTable
CREATE TABLE "Events" (
    "eventID" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "eventTime" TIMESTAMP(3) NOT NULL,
    "venue" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "saleStart" TIMESTAMP(3) NOT NULL,
    "saleEnds" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("eventID")
);

-- CreateTable
CREATE TABLE "EventTicketCounts" (
    "eventID" INTEGER NOT NULL,
    "ticketType" TEXT NOT NULL,
    "totalTickets" INTEGER NOT NULL,
    "availableTickets" INTEGER NOT NULL,
    "ongoingReservations" INTEGER NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "EventTicketCounts_pkey" PRIMARY KEY ("eventID","ticketType")
);

-- CreateTable
CREATE TABLE "Reservations" (
    "reservationID" SERIAL NOT NULL,
    "eventID" INTEGER NOT NULL,
    "ticketType" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,
    "expirationTime" TIMESTAMP(3) NOT NULL,
    "status" "ReservationStatus" NOT NULL,

    CONSTRAINT "Reservations_pkey" PRIMARY KEY ("reservationID")
);

-- CreateIndex
CREATE INDEX "Reservations_eventID_ticketType_userID_idx" ON "Reservations"("eventID", "ticketType", "userID");

-- AddForeignKey
ALTER TABLE "EventTicketCounts" ADD CONSTRAINT "EventTicketCounts_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Events"("eventID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservations" ADD CONSTRAINT "Reservations_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Events"("eventID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservations" ADD CONSTRAINT "Reservations_eventID_ticketType_fkey" FOREIGN KEY ("eventID", "ticketType") REFERENCES "EventTicketCounts"("eventID", "ticketType") ON DELETE CASCADE ON UPDATE CASCADE;

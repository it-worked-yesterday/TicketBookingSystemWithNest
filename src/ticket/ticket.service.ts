import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid'; // We can remove this as the database will generate the UUID

@Injectable()
export class TicketService {
  private readonly reservationExpirationTime = 15 * 60 * 1000; // 15 minutes in milliseconds

  constructor(private readonly prisma: PrismaService) {}

  async reserveTicket(
    userID: number,
    eventID: number,
    ticketType: string,
    ticketCount: number,
  ): Promise<{ reservationId: string; expirationTime: Date }> {
    const eventTicketCount = await this.prisma.eventTicketCounts.findUnique({
      where: {
        eventID_ticketType: {
          eventID,
          ticketType,
        },
      },
    });

    if (!eventTicketCount) {
      throw new BadRequestException(
        `Event with ID ${eventID} and ticket type '${ticketType}' not found`,
      );
    }

    if (eventTicketCount.availableTickets < ticketCount) {
      throw new BadRequestException('No More seats left');
    }

    const newAvailableTickets = eventTicketCount.availableTickets - ticketCount;

    try {
      const updatedEventTicketCount =
        await this.prisma.eventTicketCounts.update({
          where: {
            eventID_ticketType: {
              eventID,
              ticketType,
            },

            // Optimistic locking condition: ensure availableTickets hasn't changed
            availableTickets: eventTicketCount.availableTickets,
            // Implicitly ensures that availableTickets >= ticketCount at the time of update
          },

          data: {
            availableTickets: newAvailableTickets,
          },
        });

      if (!updatedEventTicketCount) {
        // This indicates that the availableTickets changed between the read and update,
        // likely due to a concurrent reservation.
        throw new BadRequestException('No More seats left'); // Or a more specific error message
      }

      const expirationTime = new Date(
        Date.now() + this.reservationExpirationTime,
      );

      const reservation = await this.prisma.reservations.create({
        data: {
          eventID,
          ticketType,
          userID,
          expirationTime,
          status: 'ONGOING',
          ticketCount, // Save the ticketCount in the reservation
        },
      });

      return { reservationId: reservation.reservationID, expirationTime };
    } catch (error) {
      if (error.code === 'P2002') {
        // Unique constraint violation (though unlikely here)
        throw new BadRequestException('Failed to reserve ticket.');
      }
      console.error('Error during reservation:', error);
      throw new BadRequestException('Failed to reserve ticket.');
    }
  }

  async confirmReservation(
    reservationId: string,
    userId: number,
  ): Promise<{ message: string; reservationId: string }> {
    const reservation = await this.prisma.reservations.findUnique({
      where: {
        reservationID: reservationId,
        userID: userId, // Ensure the reservation belongs to the requesting user
      },
    });

    if (!reservation) {
      throw new BadRequestException('Invalid reservation ID');
    }

    if (reservation.expirationTime < new Date()) {
      // Reservation has expired, increase available tickets
      await this.prisma.eventTicketCounts.update({
        where: {
          eventID_ticketType: {
            eventID: reservation.eventID,
            ticketType: reservation.ticketType,
          },
        },
        data: {
          availableTickets: {
            increment: reservation.ticketCount,
          },
        },
      });

      throw new BadRequestException('reservation expired!');
    }

    // Reservation is still valid, mark it as COMPLETE
    const updatedReservation = await this.prisma.reservations.update({
      where: {
        reservationID: reservationId,
      },
      data: {
        status: 'COMPLETE',
      },
    });

    //update reservations  set status= 'Complete' where reservationID = :resID and expirationTime > currentTimestamp

    return {
      message: 'success',
      reservationId: updatedReservation.reservationID,
    };
  }
}

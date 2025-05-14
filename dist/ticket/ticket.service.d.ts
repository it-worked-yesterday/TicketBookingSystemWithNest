import { PrismaService } from '../prisma/prisma.service';
export declare class TicketService {
    private readonly prisma;
    private readonly reservationExpirationTime;
    constructor(prisma: PrismaService);
    reserveTicket(userID: number, eventID: number, ticketType: string, ticketCount: number): Promise<{
        reservationId: string;
        expirationTime: Date;
    }>;
    confirmReservation(reservationId: string, userId: number): Promise<{
        message: string;
        reservationId: string;
    }>;
}

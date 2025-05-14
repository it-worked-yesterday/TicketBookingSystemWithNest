import { TicketService } from './ticket.service';
import { ConfirmReservationDto, ReserveTicketDto } from './dto/tickets.dto';
export declare class TicketController {
    private readonly ticketService;
    constructor(ticketService: TicketService);
    reserveTicket(reserveTicketDto: ReserveTicketDto): Promise<{
        message: string;
        reservationId: string;
        expirationTime: Date;
    }>;
    confirmReservation(userIdHeader: string, confirmReservationDto: ConfirmReservationDto): Promise<{
        message: string;
        reservationId: string;
    }>;
}

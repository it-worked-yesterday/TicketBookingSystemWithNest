import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Headers,
} from '@nestjs/common';
import { TicketService } from './ticket.service';

import { v4 as uuidv4 } from 'uuid';
import { ConfirmReservationDto, ReserveTicketDto } from './dto/tickets.dto';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post('reserve')
  @HttpCode(HttpStatus.OK)
  async reserveTicket(@Body() reserveTicketDto: ReserveTicketDto) {
    try {
      const { userID, eventID, ticketType, ticketCount } = reserveTicketDto;
      const reservation = await this.ticketService.reserveTicket(
        userID,
        eventID,
        ticketType,
        ticketCount,
      );

      return {
        message: 'success',
        reservationId: reservation.reservationId,
        expirationTime: reservation.expirationTime,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      // Handle other potential errors (e.g., database errors)
      console.error('Error during reservation:', error);
      throw new BadRequestException('Failed to reserve ticket');
    }
  }

  @Post('confirmReservation')
  @HttpCode(HttpStatus.OK)
  async confirmReservation(
    @Headers('userID') userIdHeader: string,
    @Body() confirmReservationDto: ConfirmReservationDto,
  ) {
    if (!userIdHeader) {
      throw new BadRequestException('User ID header is required');
    }
    const userID = parseInt(userIdHeader, 10);
    if (isNaN(userID)) {
      throw new BadRequestException('Invalid User ID header');
    }

    try {
      const { reservationId } = confirmReservationDto;
      const result = await this.ticketService.confirmReservation(
        reservationId,
        userID,
      );
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('Error confirming reservation:', error);
      throw new BadRequestException('Failed to confirm reservation');
    }
  }
}

import { IsNotEmpty, IsInt, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
export class ReserveTicketDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  userID: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  eventID: number;

  @IsNotEmpty()
  ticketType: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  ticketCount: number;
}

export class ConfirmReservationDto {
  @IsNotEmpty()
  @IsUUID()
  reservationId: string;
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TicketService = class TicketService {
    prisma;
    reservationExpirationTime = 15 * 60 * 1000;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async reserveTicket(userID, eventID, ticketType, ticketCount) {
        const eventTicketCount = await this.prisma.eventTicketCounts.findUnique({
            where: {
                eventID_ticketType: {
                    eventID,
                    ticketType,
                },
            },
        });
        if (!eventTicketCount) {
            throw new common_1.BadRequestException(`Event with ID ${eventID} and ticket type '${ticketType}' not found`);
        }
        if (eventTicketCount.availableTickets < ticketCount) {
            throw new common_1.BadRequestException('No More seats left');
        }
        const newAvailableTickets = eventTicketCount.availableTickets - ticketCount;
        try {
            const updatedEventTicketCount = await this.prisma.eventTicketCounts.update({
                where: {
                    eventID_ticketType: {
                        eventID,
                        ticketType,
                    },
                    availableTickets: eventTicketCount.availableTickets,
                },
                data: {
                    availableTickets: newAvailableTickets,
                },
            });
            if (!updatedEventTicketCount) {
                throw new common_1.BadRequestException('No More seats left');
            }
            const expirationTime = new Date(Date.now() + this.reservationExpirationTime);
            const reservation = await this.prisma.reservations.create({
                data: {
                    eventID,
                    ticketType,
                    userID,
                    expirationTime,
                    status: 'ONGOING',
                    ticketCount,
                },
            });
            return { reservationId: reservation.reservationID, expirationTime };
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.BadRequestException('Failed to reserve ticket.');
            }
            console.error('Error during reservation:', error);
            throw new common_1.BadRequestException('Failed to reserve ticket.');
        }
    }
    async confirmReservation(reservationId, userId) {
        const reservation = await this.prisma.reservations.findUnique({
            where: {
                reservationID: reservationId,
                userID: userId,
            },
        });
        if (!reservation) {
            throw new common_1.BadRequestException('Invalid reservation ID');
        }
        if (reservation.expirationTime < new Date()) {
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
            throw new common_1.BadRequestException('reservation expired!');
        }
        const updatedReservation = await this.prisma.reservations.update({
            where: {
                reservationID: reservationId,
            },
            data: {
                status: 'COMPLETE',
            },
        });
        return {
            message: 'success',
            reservationId: updatedReservation.reservationID,
        };
    }
};
exports.TicketService = TicketService;
exports.TicketService = TicketService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TicketService);
//# sourceMappingURL=ticket.service.js.map
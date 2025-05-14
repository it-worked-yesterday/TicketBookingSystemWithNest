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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketController = void 0;
const common_1 = require("@nestjs/common");
const ticket_service_1 = require("./ticket.service");
const tickets_dto_1 = require("./dto/tickets.dto");
let TicketController = class TicketController {
    ticketService;
    constructor(ticketService) {
        this.ticketService = ticketService;
    }
    async reserveTicket(reserveTicketDto) {
        try {
            const { userID, eventID, ticketType, ticketCount } = reserveTicketDto;
            const reservation = await this.ticketService.reserveTicket(userID, eventID, ticketType, ticketCount);
            return {
                message: 'success',
                reservationId: reservation.reservationId,
                expirationTime: reservation.expirationTime,
            };
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('Error during reservation:', error);
            throw new common_1.BadRequestException('Failed to reserve ticket');
        }
    }
    async confirmReservation(userIdHeader, confirmReservationDto) {
        if (!userIdHeader) {
            throw new common_1.BadRequestException('User ID header is required');
        }
        const userID = parseInt(userIdHeader, 10);
        if (isNaN(userID)) {
            throw new common_1.BadRequestException('Invalid User ID header');
        }
        try {
            const { reservationId } = confirmReservationDto;
            const result = await this.ticketService.confirmReservation(reservationId, userID);
            return result;
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('Error confirming reservation:', error);
            throw new common_1.BadRequestException('Failed to confirm reservation');
        }
    }
};
exports.TicketController = TicketController;
__decorate([
    (0, common_1.Post)('reserve'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tickets_dto_1.ReserveTicketDto]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "reserveTicket", null);
__decorate([
    (0, common_1.Post)('confirmReservation'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Headers)('userID')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, tickets_dto_1.ConfirmReservationDto]),
    __metadata("design:returntype", Promise)
], TicketController.prototype, "confirmReservation", null);
exports.TicketController = TicketController = __decorate([
    (0, common_1.Controller)('ticket'),
    __metadata("design:paramtypes", [ticket_service_1.TicketService])
], TicketController);
//# sourceMappingURL=ticket.controller.js.map
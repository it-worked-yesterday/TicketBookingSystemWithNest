Design and implement a backend restful API service for an event ticketing system that can handle concurrent ticket bookings, manage inventory, and process waitlists. The system should be robust enough to handle multiple simultaneous users trying to book tickets while maintaining data consistency and preventing overselling.

Core Requirements

1. Event Management
   Create events with:
   Event name and description
   Date and time
   Venue and seating capacity
   Multiple ticket types (e.g., VIP, Regular)
   Ticket prices
   Sale start and end dates

   Update event details
   Manage ticket inventory
   View event details and available tickets

2. Ticket Booking System

Reserve tickets for a limited time period
Purchase reserved tickets
Handle concurrent booking requests
Implement a waitlist system when tickets are sold out (Optional)
Cancel bookings and process refunds
View booking history

3. Inventory Management
   Track available tickets in real-time
   Implement locking mechanism for concurrent bookings
   Handle ticket release for failed/expired reservations
   Support different ticket types per event

4. [ out of scope] Waitlist Management (Optional / Time permitting)

   Add users to waitlist when event is sold out
   Process waitlist when tickets become available
   Notify users about waitlist status
   Allow users to leave waitlist

# Technical Requirements

Concurrency Handling
Implement optimistic/pessimistic locking
Handle race conditions
Ensure data consistency
Prevent overselling of tickets
Transaction Management

Implement ACID transactions for bookings
Handle rollbacks for failed operations
Maintain booking history
Track payment status
API Design

Design RESTful APIs
Implement rate limiting
Include API documentation
Handle error scenarios

Queue Management (Optional)
Implement booking queue
Handle waitlist queue
Process queued operations
Manage queue priorities

### Database schema

- Events

  - eventID PK
  - name string
  - description string
  - eventTime datetime
  - venue string
  - capacity int
  - saleStart datetime
  - saleEnds datetime

- EventTicketCounts

  - eventID
  - TicketType
  - totalTickets
  - availableTickets
  - ongoingReservations
  - unitPrice

  - composite index (eventID, TicketType)

- Reservations

  - eventID
  - ticketType
  - userID
  - expirationTime
  - status (ONGOING, COMPLETE, CANCELLED)

  - composite index (eventID, TicketType, userID )

## APIS

    Tickets booking
        - POST /ticket/reserve
           body {
                userID
                eventID
                ticketType
                ticketCount
            }

            response: 200
                {
                    message: "success",
                    reservationId: "uuid",
                    expirationTime: "Datetime"
                }

            400
                - if eventID, tickeType

        - POST /ticket/confirmReservation
         headers
            - userID

            body : {
                reserverationId
            }

            resonse :
            200
                  {
                    message: "success",
                    reservationId: "uuid",
                }

            - reservationID doesn exist
              1.   400 BadRequest


            - request timed out: 400
                {
                    message: "reservation invalid now"
                }


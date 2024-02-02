import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from "@nestjs/common";
import { Roles } from "src/modules/auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt.auth.guard";
import { RolesGuard } from "src/modules/auth/guards/roles.guard";
import { ID } from "src/interfaces/ID.types";
import { ReservationService } from "./reservations.service";
import { HotelsService } from "../hotels/hotels.service";
import { HotelRoomsService } from "../hotelRooms/hotelRooms.service";
import { DtoValidationPipe } from "src/validators/dto.validation.pipe";
import { ReservationDto } from "src/interfaces/reservation/ReservationDto.interface";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api')
export class ReservationController {
    constructor(
        private reservationService: ReservationService,
        private hotelsService: HotelsService,
        private hotelRoomsService: HotelRoomsService,
    ) {}

    @Roles('client')
    @Post('/client/reservations')
    async addReservstion(
        @Body(DtoValidationPipe) body: ReservationDto,
        @Request() req: any,
    ) {
        const room = this.hotelRoomsService.findById(body.roomId);
        if (!room || !(await room).isEnabled) {
            throw new BadRequestException("Номер не доступен");
        }
        const hotel = this.hotelsService.findById(body.hotelId);
        if (!room || !(await room).isEnabled) {
            throw new BadRequestException("Отель не доступен");
        }
        const reservation = await this.reservationService.addReservation({
            userId: req.user.id,
            hotelId: body.hotelId,
            roomId: body.roomId,
            dateStart: new Date(body.dateStart),
            dateEnd: new Date(body.dateEnd),
        });
        return {
            dateStart: reservation.dateStart,
            dateEnd: reservation.dateEnd,
            hotelRoom: {
                description: (await room).description,
                images: (await room).images,
            },
            hotel: {
                title: (await hotel).title,
                description: (await hotel).description,
            }
        };
    }

    @Roles('client')
    @Get('/client/reservations')
    async getReservationListByClient(@Request() req: any) {
        const reservation = this.reservationService.getReservations({
            userId: req.user.id,
        });
        return (await reservation).map((item: any) => ({
            dateStart: item.dateStart,
            dateEnd: item.dateEnd,
            hotelRoom: {
                description: item.room.description,
                images: item.room.images,
            },
            hotel: {
                title: item.hotel.title,
                description: item.hotel.description,
            }
        }))
    }

    @Roles('client')
    @Delete('/client/reservations/:id')
    async deleteReservationByClient(@Param('id') id: ID) {
        await this.reservationService.removeReservation(id);
        return;
    }

    @Roles('manager')
    @Get('/manager/reservations/:userId')
    async getReservationListByManager(@Param('userId') userId: ID) {
        const reservations = await this.reservationService.getReservations({
            userId,
        });
        return reservations.map((item: any) => ({
            dateStart: item.dateStart,
            dateEnd: item.dateEnd,
            hotelRoom: {
                description: item.room.description,
                images: item.room.images,
            },
            hotel: {
                title: item.hotel.title,
                description: item.hotel.description,
            }
        }))
    }

    @Roles('manager')
    @Delete('/manager/reservations/:id')
    async deleteReservationByManager(@Param('id') id: ID) {
        await this.reservationService.removeReservation(id);
        return;
    }
}
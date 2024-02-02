import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoomsService} from "./hotelRooms.service";
import { HotelRoom, HotelRoomSchema } from '../../schemas/hotelRoom.schema';
import { HotelRoomsController } from "./hotelRooms.controller";
import { HotelsModule } from "../hotels/hotels.module";
import { ReservationModule } from "../reservations/reservations.module";
import { Reservation, ReservationSchema } from "src/schemas/reservation.schema";
import { Hotel, HotelSchema } from "src/schemas/hotel.schema";

@Module({ 
    imports: [
        MongooseModule.forFeature([
            {
                name: HotelRoom.name, 
                schema: HotelRoomSchema,
            },
        ]),
        HotelsModule,
    ],
    controllers: [HotelRoomsController],
    providers: [HotelRoomsService],
    exports: [HotelRoomsService],
})

export class HotelRoomsModule {}
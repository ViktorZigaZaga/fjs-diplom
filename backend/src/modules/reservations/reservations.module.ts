import { Module } from "@nestjs/common";
import { ReservationService } from "./reservations.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Reservation, ReservationSchema } from "src/schemas/reservation.schema";
import { ReservationController } from "./reservations.controller";
import { HotelsModule } from "../hotels/hotels.module";
import { HotelRoomsModule } from "../hotelRooms/hotelRooms.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Reservation.name, 
                schema: ReservationSchema
            }
        ]),
        HotelsModule,
        HotelRoomsModule,
        
    ],
    providers: [ReservationService],
    exports: [ReservationService],
    controllers: [ReservationController],
})

export class ReservationModule {}
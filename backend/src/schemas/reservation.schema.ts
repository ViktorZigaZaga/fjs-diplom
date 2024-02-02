import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { IReservation } from "src/interfaces/reservation/IReservation.interfaces";
import { User } from "./user.schema";
import { Hotel } from "./hotel.schema";
import { HotelRoom } from "./hotelRoom.schema";

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema()
export class Reservation implements IReservation{
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({required: [true, 'Не указан пользователь'], type: mongoose.Schema.Types.ObjectId, ref: () => User })
    userId: ObjectId;

    @Prop({required: [true, 'Не указан отель'], type: mongoose.Schema.Types.ObjectId, ref: () => Hotel })
    hotelId: ObjectId;

    @Prop({required: [true, 'Не указана комната'], type: mongoose.Schema.Types.ObjectId, ref: () => HotelRoom })
    roomId: ObjectId;

    @Prop({required: [true, 'Не указана дата начала']})
    dateStart: Date;

    @Prop({required: [true, 'Не указана дата окончания']})
    dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

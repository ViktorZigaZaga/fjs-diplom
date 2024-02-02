import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId } from 'mongoose';
import { IHotelRoom } from "src/interfaces/hotel/IHotelRoom.interface";
import { Hotel } from "src/schemas/hotel.schema";

export type HotelRoomDocument = HydratedDocument<HotelRoom>;

@Schema()
export class HotelRoom implements IHotelRoom {
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: [true, 'Отель не указан'], type: mongoose.Schema.Types.ObjectId, ref: () => Hotel })
    hotel: ObjectId;

    @Prop({ required: false })
    description: string;

    @Prop({ required: false, default: []})
    images: string[];

    @Prop({ required: [true, 'Не указана дата добавления'], default: new Date() })
    createdAt: Date;

    @Prop({ required: [true, 'Не указана дата обновления'], default: new Date() })
    updatedAt: Date;

    @Prop({ required: true, default: true })
    isEnabled: boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
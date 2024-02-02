import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IHotel } from "src/interfaces/hotel/IHotel.interface";

export type HotelDocument = HydratedDocument<Hotel>;

@Schema()
export class Hotel implements IHotel {
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: [true, 'Не указано название'], unique: [true, 'Отель с таким названием уже существует'] })
    title: string;

    @Prop({ required: false })
    description: string;

    @Prop({ required: [true, 'Не указана дата добавления'], default: new Date() })
    createdAt: Date;

    @Prop({ required: [true, 'Не указана дата обновления'], default: new Date() })
    updatedAt: Date;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
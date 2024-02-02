import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IUser } from "src/interfaces/user/IUser.interface";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User implements IUser {
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: [true, 'Не указан email'], unique: [true, 'Пользователь с таким email уже существует'] })
    email: string;

    @Prop({ required: [true, 'Не указан пароль'] })
    passwordHash: string;

    @Prop({ required: [true, 'Не указано имя'] })
    name: string;

    @Prop({ required: false })
    contactPhone: string;

    @Prop({ required: true, default: 'client' })
    role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
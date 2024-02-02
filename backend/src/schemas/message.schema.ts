import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { IMessage } from "src/interfaces/support/IMessage.interface";
import { User } from "./user.schema";

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message implements IMessage {
    _id: mongoose.Schema.Types.ObjectId;

    @Prop({ required: [true, 'Не указан автор'], type: mongoose.Schema.Types.ObjectId, ref: () => User })
    author: ObjectId;

    @Prop({ required: [true, 'Не указана дата отправки'] })
    sentAt: Date;

    @Prop({ required: [true, 'Не указан текст сообщения'] })
    text: string;

    @Prop({ required: false })
    readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
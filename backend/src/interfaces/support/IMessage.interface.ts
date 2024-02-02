import { ObjectId } from 'mongoose';

export interface IMessage {
    author: ObjectId;
    sentAt: Date;
    text: string;
    readAt: Date;
}